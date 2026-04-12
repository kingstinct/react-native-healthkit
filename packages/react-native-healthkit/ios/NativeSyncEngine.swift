import Foundation
import HealthKit

/// Native sync engine for HealthKit background delivery.
///
/// When a HealthKit observer fires and the JS bridge isn't available (app terminated),
/// this engine queries HealthKit for today's data and POSTs records to the configured
/// endpoint. Records use the consumer-provided `type` and `unit` strings from
/// SyncTypeConfig — the library is generic, the format is consumer-defined.
///
/// Record shape emitted (consumer-friendly defaults for time-series health sync):
///   {
///     "type": "<consumer's type name>",
///     "value": <number>,
///     "unit": "<consumer's unit string>",
///     "startTime": "<ISO8601>",
///     "endTime": "<ISO8601>",
///     "recordId": "<uuid or type+date>",
///     "frequency": "realtime" | "daily"
///   }
@objc public class NativeSyncEngine: NSObject {
  @objc public static let shared = NativeSyncEngine()

  private let healthStore = HKHealthStore()

  static let endpointKey = "com.kingstinct.healthkit.sync.endpoint"
  static let typeConfigsKey = "com.kingstinct.healthkit.sync.typeConfigs"

  private static let httpTimeoutSeconds: TimeInterval = 15
  private static let syncBudgetSeconds: TimeInterval = 20

  private let dateFormatter: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
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
  }

  struct SyncConfig {
    let endpoint: EndpointConfig
    let typeConfigs: [TypeConfig]
  }

  struct TypeConfig: Codable {
    let identifier: String
    let type: String
    let unit: String
    let cumulative: Bool
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

  // MARK: - Sync

  func syncType(_ typeIdentifier: String, completion: @escaping () -> Void) {
    guard let config = readConfig(),
          let sampleType = BackgroundDeliveryManager.sampleTypeFromString(typeIdentifier),
          let typeConfig = config.typeConfigs.first(where: { $0.identifier == typeIdentifier })
    else {
      completion()
      return
    }

    // Hard timeout — iOS kills us at ~30s, finish by 20s
    var completed = false
    let lock = NSLock()

    func safeComplete() {
      lock.lock()
      defer { lock.unlock() }
      guard !completed else { return }
      completed = true
      completion()
    }

    DispatchQueue.global().asyncAfter(deadline: .now() + NativeSyncEngine.syncBudgetSeconds) {
      safeComplete()
    }

    // Native sync only handles today — HealthKit queues wakes for offline/catch-up
    let since = Calendar.current.startOfDay(for: Date())

    if typeConfig.cumulative, let quantityType = sampleType as? HKQuantityType {
      syncCumulativeType(quantityType, typeConfig: typeConfig, since: since, endpoint: config.endpoint, completion: safeComplete)
    } else {
      syncDiscreteType(sampleType, typeConfig: typeConfig, since: since, endpoint: config.endpoint, completion: safeComplete)
    }
  }

  // MARK: - Cumulative Types

  /// HKStatisticsCollectionQuery with cumulativeSum — Apple deduplicates across
  /// sources (iPhone + Watch) and returns one correct total per day.
  /// sourceRecordId is synthesized from consumer's type name + bucket date.
  private func syncCumulativeType(
    _ quantityType: HKQuantityType,
    typeConfig: TypeConfig,
    since: Date,
    endpoint: EndpointConfig,
    completion: @escaping () -> Void
  ) {
    let interval = DateComponents(day: 1)
    let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)
    let hkUnit = HKUnit(from: typeConfig.unit)

    let query = HKStatisticsCollectionQuery(
      quantityType: quantityType,
      quantitySamplePredicate: predicate,
      options: .cumulativeSum,
      anchorDate: since,
      intervalComponents: interval
    )

    query.initialResultsHandler = { [weak self] _, results, _ in
      guard let self = self, let results = results else { completion(); return }

      var records: [[String: Any]] = []
      results.enumerateStatistics(from: since, to: Date()) { stats, _ in
        guard let sum = stats.sumQuantity() else { return }

        let cal = Calendar.current
        let y = cal.component(.year, from: stats.startDate)
        let m = String(format: "%02d", cal.component(.month, from: stats.startDate))
        let d = String(format: "%02d", cal.component(.day, from: stats.startDate))
        let dateKey = "\(y)-\(m)-\(d)"

        records.append([
          "type": typeConfig.type,
          "value": sum.doubleValue(for: hkUnit),
          "unit": typeConfig.unit,
          "startTime": self.dateFormatter.string(from: stats.startDate),
          "endTime": self.dateFormatter.string(from: stats.endDate),
          "recordId": "\(typeConfig.type)-\(dateKey)",
          "frequency": "daily",
        ])
      }

      guard !records.isEmpty else { completion(); return }
      self.sendRecords(records, endpoint: endpoint, completion: completion)
    }

    healthStore.execute(query)
  }

  // MARK: - Discrete Types

  /// HKSampleQuery for discrete types — each sample is a distinct observation.
  /// sourceRecordId = HK sample uuid.
  private func syncDiscreteType(
    _ sampleType: HKSampleType,
    typeConfig: TypeConfig,
    since: Date,
    endpoint: EndpointConfig,
    completion: @escaping () -> Void
  ) {
    let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)

    let query = HKSampleQuery(
      sampleType: sampleType,
      predicate: predicate,
      limit: HKObjectQueryNoLimit,
      sortDescriptors: nil
    ) { [weak self] _, samples, _ in
      guard let self = self, let samples = samples, !samples.isEmpty else {
        completion()
        return
      }

      let records = self.buildDiscreteRecords(samples, typeConfig: typeConfig)
      guard !records.isEmpty else { completion(); return }
      self.sendRecords(records, endpoint: endpoint, completion: completion)
    }

    healthStore.execute(query)
  }

  // MARK: - Record Formatting

  private func buildDiscreteRecords(_ samples: [HKSample], typeConfig: TypeConfig) -> [[String: Any]] {
    let hkUnit = HKUnit(from: typeConfig.unit)

    return samples.compactMap { sample -> [String: Any]? in
      var record: [String: Any] = [
        "type": typeConfig.type,
        "startTime": dateFormatter.string(from: sample.startDate),
        "endTime": dateFormatter.string(from: sample.endDate),
        "recordId": sample.uuid.uuidString,
        "frequency": "realtime",
      ]

      if let q = sample as? HKQuantitySample {
        record["value"] = q.quantity.doubleValue(for: hkUnit)
        record["unit"] = typeConfig.unit
      } else if let c = sample as? HKCategorySample {
        record["value"] = c.value
      } else if let w = sample as? HKWorkout {
        record["workoutType"] = String(w.workoutActivityType.rawValue)
        record["duration"] = w.duration
      } else {
        return nil
      }

      return record
    }
  }

  // MARK: - HTTP

  /// Send records as JSON to the configured endpoint. The body shape is
  /// { records: [...] } — a wrapper object that's easier for consumer backends
  /// to extend (add provider, device info, etc. without changing the shape).
  private func sendRecords(_ records: [[String: Any]], endpoint: EndpointConfig, completion: @escaping () -> Void) {
    let body: [String: Any] = ["records": records]
    guard let url = URL(string: endpoint.url),
          let jsonData = try? JSONSerialization.data(withJSONObject: body)
    else {
      completion()
      return
    }

    var request = URLRequest(url: url)
    request.httpMethod = endpoint.method
    request.timeoutInterval = NativeSyncEngine.httpTimeoutSeconds
    request.httpBody = jsonData

    // Default Content-Type to application/json if the consumer didn't override it.
    let hasContentType = endpoint.headers.keys.contains { $0.lowercased() == "content-type" }
    if !hasContentType {
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    }
    for (key, value) in endpoint.headers {
      request.setValue(value, forHTTPHeaderField: key)
    }

    URLSession.shared.dataTask(with: request) { _, response, error in
      if let error = error {
        print("[react-native-healthkit] NativeSyncEngine: request failed: \(error.localizedDescription)")
      } else if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
        print("[react-native-healthkit] NativeSyncEngine: request returned \(httpResponse.statusCode)")
      }
      completion()
    }.resume()
  }
}
