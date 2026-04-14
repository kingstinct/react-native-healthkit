import Foundation
import HealthKit

/// Native sync engine for HealthKit background delivery.
///
/// When a HealthKit observer fires and the JS bridge isn't available (app
/// terminated), this engine queries HealthKit for recent data and POSTs
/// records to the configured endpoint. Records use the consumer-provided
/// `type` and `unit` strings from SyncTypeConfig — the library is generic,
/// the format is consumer-defined.
///
/// ## Record shape (uniform across kinds)
///
///   {
///     "type":      "<consumer's type name>",
///     "startTime": "<ISO8601>",
///     "endTime":   "<ISO8601>",
///     "recordId":  "<stable id or type+date>",
///     "frequency": "realtime" | "daily",
///     // Kind-specific extras:
///     "value":     <number>,                // cumulativeQuantity / discreteQuantity
///     "unit":      "<unit string>",         // cumulativeQuantity / discreteQuantity
///     "category":  "<category value name>", // categorySample (e.g. "asleep_deep")
///     "workoutType":     "<activity name>", // workout
///     "duration":        <seconds>,         // workout
///     "distance":        { "value": m,     "unit": "m" },
///     "calories":        { "value": kcal,  "unit": "kcal" },
///     "averageHeartRate": <bpm>,
///     "maxHeartRate":     <bpm>,
///   }
///
/// ## Performance
///
/// - Queries of different kinds run in parallel via `withThrowingTaskGroup`.
/// - Hard 20s deadline (iOS kills background work at ~30s). If we hit it,
///   the task group is cancelled and we call the caller's completion
///   immediately — iOS never sees a missed completion.
/// - Each HTTP POST has its own 15s timeout inside that budget.
@objc public class NativeSyncEngine: NSObject {
  @objc public static let shared = NativeSyncEngine()

  private let healthStore = HKHealthStore()

  static let endpointKey = "com.kingstinct.healthkit.sync.endpoint"
  static let typeConfigsKey = "com.kingstinct.healthkit.sync.typeConfigs"
  static let breadcrumbsKey = "com.kingstinct.healthkit.sync.clientFailures"

  private static let httpTimeoutSeconds: TimeInterval = 15
  private static let syncBudgetSeconds: UInt64 = 20
  /// Max breadcrumbs retained in UserDefaults. Oldest evicted on overflow.
  /// Keeps persistent storage bounded even if the device is offline for days.
  private static let maxBreadcrumbs = 50

  private let dateFormatter: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return f
  }()

  private let localDateFormatter: DateFormatter = {
    let f = DateFormatter()
    f.dateFormat = "yyyy-MM-dd"
    // Use the current calendar/timezone at format time — computed per-record.
    return f
  }()

  private override init() {
    super.init()
  }

  // MARK: - Configuration

  struct EndpointConfig: Codable {
    let url: String
    let method: String
    let headers: [String: String]
    /// How many days of history to re-query on every wake. Defaults to 1
    /// (today only) when absent from storage.
    let lookbackDays: Int?
  }

  struct TypeConfig: Codable {
    let identifier: String
    let type: String
    let unit: String
    /// Raw string value of `SyncKind` — persisted as a String so the on-disk
    /// format survives Nitro regenerations without risking an enum rawValue
    /// drift.
    let kind: String
  }

  struct SyncConfig {
    let endpoint: EndpointConfig
    let typeConfigs: [TypeConfig]
  }

  /// One entry per local POST failure. Persisted across wakes and flushed to
  /// the consumer's backend on the next successful push via a
  /// `clientFailuresSince` field in the request body. Gives consumers
  /// visibility into native-path HTTP failures that otherwise never reach
  /// their backend logs at all.
  struct Breadcrumb: Codable {
    let timestamp: String  // ISO8601
    let reason: String
    let path: String       // "native"
  }

  func readConfig() -> SyncConfig? {
    let defaults = UserDefaults.standard
    guard let endpointData = defaults.data(forKey: NativeSyncEngine.endpointKey),
          let configData = defaults.data(forKey: NativeSyncEngine.typeConfigsKey)
    else { return nil }

    guard let endpoint = try? JSONDecoder().decode(EndpointConfig.self, from: endpointData),
          let typeConfigs = try? JSONDecoder().decode([TypeConfig].self, from: configData)
    else { return nil }

    return SyncConfig(endpoint: endpoint, typeConfigs: typeConfigs)
  }

  static func writeConfig(endpoint: EndpointConfig, typeConfigs: [TypeConfig]) throws {
    // Encode first (fail fast) before writing to UserDefaults. If encoding
    // fails we'd rather surface the error to the caller than silently skip
    // the write and fail every subsequent background wake.
    let endpointData = try JSONEncoder().encode(endpoint)
    let configData = try JSONEncoder().encode(typeConfigs)
    let defaults = UserDefaults.standard
    defaults.set(endpointData, forKey: endpointKey)
    defaults.set(configData, forKey: typeConfigsKey)
  }

  static func clearConfig() {
    let defaults = UserDefaults.standard
    defaults.removeObject(forKey: endpointKey)
    defaults.removeObject(forKey: typeConfigsKey)
  }

  // MARK: - Entry points

  /// Called by `BackgroundDeliveryManager` when an observer for a given kind
  /// fires. Queries all registered types of that kind in parallel, POSTs the
  /// combined records, and calls `completion` exactly once within the budget.
  @objc public func syncKind(_ kindRawValue: String, completion: @escaping () -> Void) {
    guard let config = readConfig() else { completion(); return }
    let matching = config.typeConfigs.filter { $0.kind == kindRawValue }
    guard !matching.isEmpty else { completion(); return }

    syncWithDeadline(configs: matching, endpoint: config.endpoint, completion: completion)
  }

  /// Convenience: sync every registered type regardless of kind. Used when a
  /// consumer only wants a single observer fanning out to everything.
  @objc public func syncAll(completion: @escaping () -> Void) {
    guard let config = readConfig(), !config.typeConfigs.isEmpty else {
      completion(); return
    }
    syncWithDeadline(configs: config.typeConfigs, endpoint: config.endpoint, completion: completion)
  }

  /// Back-compat wrapper — the old API dispatched per-identifier. Maps to
  /// the new "all registered types of that identifier's kind" behavior so
  /// callers upgrading from v0.1 don't need to change immediately.
  @objc public func syncType(_ typeIdentifier: String, completion: @escaping () -> Void) {
    guard let config = readConfig(),
          let match = config.typeConfigs.first(where: { $0.identifier == typeIdentifier })
    else { completion(); return }
    syncKind(match.kind, completion: completion)
  }

  // MARK: - Task orchestration

  /// Runs `runSync` against a 20s deadline. On deadline the task is cancelled
  /// and `completion` is called so iOS doesn't see a missed callback.
  private func syncWithDeadline(
    configs: [TypeConfig],
    endpoint: EndpointConfig,
    completion: @escaping () -> Void
  ) {
    let completedFlag = CompletedFlag()

    func finishOnce() {
      if completedFlag.setDone() {
        completion()
      }
    }

    let work = Task { [weak self] in
      guard let self = self else { finishOnce(); return }
      do {
        try await self.runSync(configs: configs, endpoint: endpoint)
      } catch {
        print("[react-native-healthkit] NativeSyncEngine: sync failed: \(error.localizedDescription)")
      }
      finishOnce()
    }

    // Hard deadline watchdog. We can't use Task.sleep(for:) on iOS 13–15
    // without availability gating, so we use the nanosecond overload.
    Task {
      try? await Task.sleep(nanoseconds: NativeSyncEngine.syncBudgetSeconds * 1_000_000_000)
      if !completedFlag.isDone {
        print("[react-native-healthkit] NativeSyncEngine: hit 20s budget, cancelling")
        work.cancel()
      }
      finishOnce()
    }
  }

  /// Fan-out query work by kind, then POST everything in a single request.
  private func runSync(configs: [TypeConfig], endpoint: EndpointConfig) async throws {
    let lookback = max(1, endpoint.lookbackDays ?? 1)
    let since: Date = {
      let cal = Calendar.current
      let startOfToday = cal.startOfDay(for: Date())
      return cal.date(byAdding: .day, value: -(lookback - 1), to: startOfToday) ?? startOfToday
    }()

    // Group configs by kind so we can dispatch appropriately.
    var byKind: [String: [TypeConfig]] = [:]
    for c in configs {
      byKind[c.kind, default: []].append(c)
    }

    var records: [[String: Any]] = []
    try await withThrowingTaskGroup(of: [[String: Any]].self) { group in
      if let cumulative = byKind["cumulativeQuantity"] {
        group.addTask { try await self.syncCumulative(cumulative, since: since) }
      }
      if let discrete = byKind["discreteQuantity"] {
        group.addTask { try await self.syncDiscrete(discrete, since: since) }
      }
      if let category = byKind["categorySample"] {
        group.addTask { try await self.syncCategory(category, since: since) }
      }
      if let workout = byKind["workout"] {
        group.addTask { try await self.syncWorkout(workout, since: since) }
      }
      for try await subset in group {
        records.append(contentsOf: subset)
      }
    }

    // Inject timezone + local date into every record. These are identical
    // across records in a single sync, so we compute once. Optional on the
    // wire — backends that don't need them ignore the fields.
    let localeFields = Self.currentLocaleFields(formatter: localDateFormatter)
    let enriched: [[String: Any]] = records.map { r in
      var m = r
      for (k, v) in localeFields { m[k] = v }
      return m
    }

    guard !enriched.isEmpty else { return }
    try Task.checkCancellation()

    // Flush any persisted client-failure breadcrumbs with this successful
    // push, then clear. On failure, append a new breadcrumb so the next
    // successful push surfaces it to the backend.
    let pending = Self.loadBreadcrumbs()
    do {
      try await sendRecords(enriched, endpoint: endpoint, breadcrumbs: pending)
      if !pending.isEmpty {
        Self.clearBreadcrumbs()
      }
    } catch {
      Self.appendBreadcrumb(reason: error.localizedDescription, iso: dateFormatter)
      throw error
    }
  }

  /// Produces timezone/localDate fields matching the consumer's optional
  /// locale schema. Applied to every outgoing record so backends can bucket
  /// by the user's local day regardless of UTC offset.
  private static func currentLocaleFields(formatter: DateFormatter) -> [String: Any] {
    let tz = TimeZone.current
    let now = Date()
    // Use a fresh formatter-local copy to avoid mutating shared state.
    let f = formatter
    f.timeZone = tz
    return [
      "timeZone": tz.identifier,
      "timeZoneOffsetMinutes": tz.secondsFromGMT(for: now) / 60,
      "localDate": f.string(from: now),
    ]
  }

  // MARK: - Cumulative

  private func syncCumulative(_ configs: [TypeConfig], since: Date) async throws -> [[String: Any]] {
    try await withThrowingTaskGroup(of: [[String: Any]].self) { group in
      for config in configs {
        group.addTask { try await self.queryCumulative(config, since: since) }
      }
      var all: [[String: Any]] = []
      for try await part in group {
        all.append(contentsOf: part)
      }
      return all
    }
  }

  /// `HKStatisticsCollectionQuery` with `.cumulativeSum` — Apple deduplicates
  /// across sources (iPhone + Watch + 3rd party apps) and returns one total
  /// per daily bucket.
  private func queryCumulative(_ config: TypeConfig, since: Date) async throws -> [[String: Any]] {
    guard let quantityType = BackgroundDeliveryManager.sampleTypeFromString(config.identifier)
            as? HKQuantityType
    else { return [] }

    return try await withCheckedThrowingContinuation { cont in
      let interval = DateComponents(day: 1)
      let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)
      let hkUnit = HKUnit(from: config.unit)

      let query = HKStatisticsCollectionQuery(
        quantityType: quantityType,
        quantitySamplePredicate: predicate,
        options: .cumulativeSum,
        anchorDate: since,
        intervalComponents: interval
      )
      query.initialResultsHandler = { _, results, error in
        if let error = error { cont.resume(throwing: error); return }
        guard let results = results else { cont.resume(returning: []); return }

        var records: [[String: Any]] = []
        results.enumerateStatistics(from: since, to: Date()) { stats, _ in
          guard let sum = stats.sumQuantity() else { return }
          let dateKey = Self.dateKey(for: stats.startDate)
          records.append([
            "type": config.type,
            "value": sum.doubleValue(for: hkUnit),
            "unit": config.unit,
            "startTime": self.dateFormatter.string(from: stats.startDate),
            "endTime": self.dateFormatter.string(from: stats.endDate),
            "recordId": "\(config.type)-\(dateKey)",
            "frequency": "daily",
          ])
        }
        cont.resume(returning: records)
      }
      healthStore.execute(query)
    }
  }

  // MARK: - Discrete quantity

  private func syncDiscrete(_ configs: [TypeConfig], since: Date) async throws -> [[String: Any]] {
    try await withThrowingTaskGroup(of: [[String: Any]].self) { group in
      for config in configs {
        group.addTask { try await self.queryDiscrete(config, since: since) }
      }
      var all: [[String: Any]] = []
      for try await part in group {
        all.append(contentsOf: part)
      }
      return all
    }
  }

  private func queryDiscrete(_ config: TypeConfig, since: Date) async throws -> [[String: Any]] {
    guard let sampleType = BackgroundDeliveryManager.sampleTypeFromString(config.identifier)
            as? HKQuantityType
    else { return [] }

    return try await withCheckedThrowingContinuation { cont in
      let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)
      let hkUnit = HKUnit(from: config.unit)

      let query = HKSampleQuery(
        sampleType: sampleType,
        predicate: predicate,
        limit: HKObjectQueryNoLimit,
        sortDescriptors: nil
      ) { _, samples, error in
        if let error = error { cont.resume(throwing: error); return }
        let records: [[String: Any]] = (samples ?? []).compactMap { sample in
          guard let q = sample as? HKQuantitySample else { return nil }
          return [
            "type": config.type,
            "value": q.quantity.doubleValue(for: hkUnit),
            "unit": config.unit,
            "startTime": self.dateFormatter.string(from: q.startDate),
            "endTime": self.dateFormatter.string(from: q.endDate),
            "recordId": q.uuid.uuidString,
            "frequency": "realtime",
          ]
        }
        cont.resume(returning: records)
      }
      healthStore.execute(query)
    }
  }

  // MARK: - Category (sleep etc.)

  private func syncCategory(_ configs: [TypeConfig], since: Date) async throws -> [[String: Any]] {
    try await withThrowingTaskGroup(of: [[String: Any]].self) { group in
      for config in configs {
        group.addTask { try await self.queryCategory(config, since: since) }
      }
      var all: [[String: Any]] = []
      for try await part in group {
        all.append(contentsOf: part)
      }
      return all
    }
  }

  private func queryCategory(_ config: TypeConfig, since: Date) async throws -> [[String: Any]] {
    guard let sampleType = BackgroundDeliveryManager.sampleTypeFromString(config.identifier)
            as? HKCategoryType
    else { return [] }

    return try await withCheckedThrowingContinuation { cont in
      let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)

      let query = HKSampleQuery(
        sampleType: sampleType,
        predicate: predicate,
        limit: HKObjectQueryNoLimit,
        sortDescriptors: nil
      ) { _, samples, error in
        if let error = error { cont.resume(throwing: error); return }
        let isSleep = sampleType.identifier == HKCategoryTypeIdentifier.sleepAnalysis.rawValue

        let records: [[String: Any]] = (samples ?? []).compactMap { sample in
          guard let c = sample as? HKCategorySample else { return nil }
          var record: [String: Any] = [
            "type": config.type,
            "startTime": self.dateFormatter.string(from: c.startDate),
            "endTime": self.dateFormatter.string(from: c.endDate),
            "recordId": c.uuid.uuidString,
            "frequency": "realtime",
          ]
          // Emit a human-readable value for sleep (handles iOS 15/16/17+).
          // For other category types the raw Int is included as a fallback.
          if isSleep {
            record["category"] = Self.mapSleepValue(c.value)
          } else {
            record["value"] = c.value
          }
          return record
        }
        cont.resume(returning: records)
      }
      healthStore.execute(query)
    }
  }

  // MARK: - Workout

  private func syncWorkout(_ configs: [TypeConfig], since: Date) async throws -> [[String: Any]] {
    // All workout configs share the same HKWorkoutType — run the query once
    // and emit a record per config (usually just one).
    let iso = dateFormatter
    return try await withCheckedThrowingContinuation { cont in
      let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)

      let query = HKSampleQuery(
        sampleType: HKObjectType.workoutType(),
        predicate: predicate,
        limit: HKObjectQueryNoLimit,
        sortDescriptors: nil
      ) { _, samples, error in
        if let error = error { cont.resume(throwing: error); return }
        let workouts = (samples ?? []).compactMap { $0 as? HKWorkout }
        var records: [[String: Any]] = []
        for config in configs {
          for w in workouts {
            records.append(Self.buildWorkoutRecord(w, config: config, iso: iso))
          }
        }
        cont.resume(returning: records)
      }
      healthStore.execute(query)
    }
  }

  private static func buildWorkoutRecord(
    _ w: HKWorkout,
    config: TypeConfig,
    iso: ISO8601DateFormatter
  ) -> [String: Any] {
    var record: [String: Any] = [
      "type": config.type,
      "startTime": iso.string(from: w.startDate),
      "endTime": iso.string(from: w.endDate),
      "recordId": w.uuid.uuidString,
      "frequency": "realtime",
      "workoutType": "\(w.workoutActivityType.rawValue)",
      "duration": w.duration,
    ]

    if let distance = workoutDistance(w) {
      record["distance"] = ["value": distance, "unit": "m"]
    }
    if let energy = workoutEnergy(w) {
      record["calories"] = ["value": energy, "unit": "kcal"]
    }
    if let avg = workoutAverageHR(w) {
      record["averageHeartRate"] = avg
    }
    if let max = workoutMaxHR(w) {
      record["maxHeartRate"] = max
    }
    return record
  }

  // MARK: - Workout field accessors (iOS 17 deprecation)

  private static func workoutDistance(_ w: HKWorkout) -> Double? {
    if #available(iOS 17.0, *) {
      return w.statistics(for: HKQuantityType(.distanceWalkingRunning))?
        .sumQuantity()?.doubleValue(for: .meter())
    } else {
      return w.totalDistance?.doubleValue(for: .meter())
    }
  }

  private static func workoutEnergy(_ w: HKWorkout) -> Double? {
    if #available(iOS 17.0, *) {
      return w.statistics(for: HKQuantityType(.activeEnergyBurned))?
        .sumQuantity()?.doubleValue(for: .kilocalorie())
    } else {
      return w.totalEnergyBurned?.doubleValue(for: .kilocalorie())
    }
  }

  private static func workoutAverageHR(_ w: HKWorkout) -> Double? {
    if #available(iOS 17.0, *) {
      return w.statistics(for: HKQuantityType(.heartRate))?
        .averageQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute()))
    } else {
      return nil  // Not exposed on pre-iOS 17 HKWorkout
    }
  }

  private static func workoutMaxHR(_ w: HKWorkout) -> Double? {
    if #available(iOS 17.0, *) {
      return w.statistics(for: HKQuantityType(.heartRate))?
        .maximumQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute()))
    } else {
      return nil
    }
  }

  // MARK: - Sleep value mapping

  /// Maps `HKCategoryValueSleepAnalysis` raw values to stable string keys.
  /// Switches on raw `Int` rather than the enum so we sidestep Swift's
  /// version-aware exhaustiveness checks when iOS 16+ values are present.
  /// Covers iOS 15 (inBed/asleep/awake), iOS 16+ (asleepCore/Deep/REM/
  /// Unspecified), and emits `unknown:<N>` for future Apple additions.
  static func mapSleepValue(_ rawValue: Int) -> String {
    switch rawValue {
    case HKCategoryValueSleepAnalysis.inBed.rawValue:
      return "in_bed"
    case HKCategoryValueSleepAnalysis.awake.rawValue:
      return "awake"
    case 1:
      // Raw value 1 is `.asleep` on iOS 15 and `.asleepUnspecified` on
      // iOS 16+ (same numeric value, just renamed). Using the literal
      // avoids the deprecation warning for `.asleep` on modern SDKs.
      return "asleep_unspecified"
    default:
      if #available(iOS 16.0, *) {
        switch rawValue {
        case HKCategoryValueSleepAnalysis.asleepCore.rawValue:
          return "asleep_core"
        case HKCategoryValueSleepAnalysis.asleepDeep.rawValue:
          return "asleep_deep"
        case HKCategoryValueSleepAnalysis.asleepREM.rawValue:
          return "asleep_rem"
        case HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue:
          return "asleep_unspecified"
        default: break
        }
      }
      print("[react-native-healthkit] NativeSyncEngine: unmapped sleep rawValue=\(rawValue)")
      return "unknown:\(rawValue)"
    }
  }

  // MARK: - Helpers

  private static func dateKey(for date: Date) -> String {
    let cal = Calendar.current
    let y = cal.component(.year, from: date)
    let m = String(format: "%02d", cal.component(.month, from: date))
    let d = String(format: "%02d", cal.component(.day, from: date))
    return "\(y)-\(m)-\(d)"
  }

  // MARK: - HTTP

  /// Send records as JSON to the configured endpoint. The body shape is
  /// `{ records: [...], clientFailuresSince?: [...] }` — a wrapper object
  /// that's easier for consumer backends to extend. `clientFailuresSince`
  /// is only included when there are persisted breadcrumbs to flush.
  private func sendRecords(
    _ records: [[String: Any]],
    endpoint: EndpointConfig,
    breadcrumbs: [Breadcrumb]
  ) async throws {
    var body: [String: Any] = ["records": records]
    if !breadcrumbs.isEmpty {
      body["clientFailuresSince"] = breadcrumbs.map {
        ["timestamp": $0.timestamp, "reason": $0.reason, "path": $0.path]
      }
    }
    guard let url = URL(string: endpoint.url) else { return }
    let jsonData = try JSONSerialization.data(withJSONObject: body)

    var request = URLRequest(url: url)
    request.httpMethod = endpoint.method
    request.timeoutInterval = NativeSyncEngine.httpTimeoutSeconds
    request.httpBody = jsonData

    let hasContentType = endpoint.headers.keys.contains { $0.lowercased() == "content-type" }
    if !hasContentType {
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    }
    for (key, value) in endpoint.headers {
      request.setValue(value, forHTTPHeaderField: key)
    }

    let (_, response) = try await URLSession.shared.data(for: request)
    if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
      throw NSError(
        domain: "com.kingstinct.healthkit.sync",
        code: http.statusCode,
        userInfo: [NSLocalizedDescriptionKey: "HTTP \(http.statusCode)"]
      )
    }
  }

  // MARK: - Breadcrumbs

  static func loadBreadcrumbs() -> [Breadcrumb] {
    guard let data = UserDefaults.standard.data(forKey: breadcrumbsKey),
          let decoded = try? JSONDecoder().decode([Breadcrumb].self, from: data)
    else { return [] }
    return decoded
  }

  static func appendBreadcrumb(reason: String, iso: ISO8601DateFormatter) {
    let entry = Breadcrumb(
      timestamp: iso.string(from: Date()),
      reason: reason,
      path: "native"
    )
    var existing = loadBreadcrumbs()
    existing.append(entry)
    // Cap — oldest evicted.
    if existing.count > maxBreadcrumbs {
      existing = Array(existing.suffix(maxBreadcrumbs))
    }
    if let encoded = try? JSONEncoder().encode(existing) {
      UserDefaults.standard.set(encoded, forKey: breadcrumbsKey)
    }
  }

  static func clearBreadcrumbs() {
    UserDefaults.standard.removeObject(forKey: breadcrumbsKey)
  }
}

// MARK: - CompletedFlag helper

/// Thread-safe boolean flag — ensures `completion` fires exactly once even
/// when the work task and the deadline watchdog race.
private final class CompletedFlag {
  private var done = false
  private let lock = NSLock()

  var isDone: Bool {
    lock.lock(); defer { lock.unlock() }
    return done
  }

  /// Returns `true` the first time called, `false` thereafter.
  func setDone() -> Bool {
    lock.lock(); defer { lock.unlock() }
    if done { return false }
    done = true
    return true
  }
}
