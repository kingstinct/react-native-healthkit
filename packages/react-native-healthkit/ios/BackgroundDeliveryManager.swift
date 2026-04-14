import Foundation
import HealthKit

/// Manages HealthKit background delivery by registering observer queries at
/// app launch, before the JS bridge is available. This is required by
/// Apple — observer queries must be set up in
/// `application(_:didFinishLaunchingWithOptions:)` to receive background
/// delivery callbacks after the app has been terminated.
///
/// Usage from AppDelegate.swift:
///   BackgroundDeliveryManager.shared.setupBackgroundObservers()
///
/// The registrations (identifier + kind pairs) are persisted in UserDefaults
/// by `configure(registrations:frequency:)` called from JS via
/// `CoreModule.configureBackgroundSync`. On subsequent cold launches the
/// manager reads them and registers observers immediately.
@objc public class BackgroundDeliveryManager: NSObject {
  @objc public static let shared = BackgroundDeliveryManager()

  private let healthStore = HKHealthStore()
  private let queue = DispatchQueue(label: "com.kingstinct.healthkit.background", attributes: .concurrent)
  private var observerQueries: [String: HKObserverQuery] = [:]
  private var pendingEvents: [(typeIdentifier: String, errorMessage: String?)] = []
  private var jsCallback: ((String, String?) -> Void)?
  private var isSetUp = false

  static let registrationsKey = "com.kingstinct.healthkit.backgroundRegistrations"
  static let frequencyKey = "com.kingstinct.healthkit.backgroundFrequency"

  /// Identifier + kind pair persisted for every registered type. Kind is
  /// stored as the raw string value of `SyncKind` so the on-disk format
  /// survives Nitro regenerations.
  public struct Registration: Codable {
    public let identifier: String
    public let kind: String

    public init(identifier: String, kind: String) {
      self.identifier = identifier
      self.kind = kind
    }
  }

  private override init() {
    super.init()
  }

  /// Call this from AppDelegate.didFinishLaunchingWithOptions to register
  /// observer queries for any previously configured background delivery
  /// types.
  @objc public func setupBackgroundObservers() {
    guard HKHealthStore.isHealthDataAvailable() else { return }

    guard let data = UserDefaults.standard.data(forKey: BackgroundDeliveryManager.registrationsKey),
          let registrations = try? JSONDecoder().decode([Registration].self, from: data)
    else {
      return
    }

    let frequencyRaw = UserDefaults.standard.integer(forKey: BackgroundDeliveryManager.frequencyKey)
    let frequency = HKUpdateFrequency(rawValue: frequencyRaw) ?? .immediate

    registerObservers(registrations: registrations, frequency: frequency)
  }

  /// Persist registrations and frequency, then register observers for the
  /// current session. Called from JS via
  /// `CoreModule.configureBackgroundSync`.
  func configure(registrations: [Registration], frequency: HKUpdateFrequency) {
    if let data = try? JSONEncoder().encode(registrations) {
      UserDefaults.standard.set(data, forKey: BackgroundDeliveryManager.registrationsKey)
    }
    UserDefaults.standard.set(frequency.rawValue, forKey: BackgroundDeliveryManager.frequencyKey)

    tearDown()
    registerObservers(registrations: registrations, frequency: frequency)
  }

  /// Subscribe a JS callback for reactive foreground updates. Any events
  /// that arrived before JS was ready are flushed immediately. Note: the
  /// callback runs alongside the native sync path — both fire in the
  /// foreground, backend dedup absorbs overlap.
  func setCallback(_ callback: @escaping (String, String?) -> Void) {
    queue.sync(flags: .barrier) {
      self.jsCallback = callback
      let events = self.pendingEvents
      self.pendingEvents = []

      for event in events {
        callback(event.typeIdentifier, event.errorMessage)
      }
    }
  }

  /// Remove the JS callback (e.g., on teardown).
  func removeCallback() {
    queue.sync(flags: .barrier) {
      self.jsCallback = nil
    }
  }

  /// Returns any pending events and clears the queue. Used by
  /// CoreModule.subscribeToObserverQuery to flush events that arrived
  /// before JS subscribed.
  func drainPendingEvents() -> [(typeIdentifier: String, errorMessage: String?)] {
    return queue.sync(flags: .barrier) {
      let events = self.pendingEvents
      self.pendingEvents = []
      return events
    }
  }

  /// Stop all observer queries and clear state.
  func tearDown() {
    queue.sync(flags: .barrier) {
      for (_, query) in self.observerQueries {
        self.healthStore.stop(query)
      }
      self.observerQueries = [:]
      self.isSetUp = false
    }
  }

  /// Clear persisted configuration (disables background delivery on next launch).
  func clearConfiguration() {
    UserDefaults.standard.removeObject(forKey: BackgroundDeliveryManager.registrationsKey)
    UserDefaults.standard.removeObject(forKey: BackgroundDeliveryManager.frequencyKey)
    tearDown()
  }

  private func registerObservers(registrations: [Registration], frequency: HKUpdateFrequency) {
    queue.sync(flags: .barrier) {
      guard !self.isSetUp else { return }
      self.isSetUp = true
    }

    for reg in registrations {
      guard let sampleType = BackgroundDeliveryManager.sampleTypeFromString(reg.identifier) else {
        print("[react-native-healthkit] BackgroundDeliveryManager: skipping unrecognized type \(reg.identifier)")
        continue
      }

      // Capture kind so the observer callback knows which set of registered
      // types to batch-query on fire.
      let kind = reg.kind

      // nil predicate catches all samples including those written while the
      // app was terminated.
      let query = HKObserverQuery(
        sampleType: sampleType,
        predicate: nil
      ) { [weak self] (_: HKObserverQuery, completionHandler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
        guard let self = self else { completionHandler(); return }

        // Always run native sync — deterministic, no race with JS boot.
        // The callback runs on a HealthKit-owned background queue.
        NativeSyncEngine.shared.syncKind(kind) {
          completionHandler()
        }

        // In parallel, notify any subscribed JS listener for reactive
        // foreground UI. This intentionally runs alongside the native sync;
        // backend dedup handles any duplicate pushes.
        self.notifyJs(typeIdentifier: reg.identifier, error: error)
      }

      healthStore.execute(query)

      healthStore.enableBackgroundDelivery(for: sampleType, frequency: frequency) { success, error in
        if let error = error {
          print("[react-native-healthkit] BackgroundDeliveryManager: enableBackgroundDelivery failed for \(reg.identifier): \(error.localizedDescription)")
        } else if !success {
          print("[react-native-healthkit] BackgroundDeliveryManager: enableBackgroundDelivery returned false for \(reg.identifier)")
        }
      }

      queue.sync(flags: .barrier) {
        self.observerQueries[reg.identifier] = query
      }
    }
  }

  /// Notify any subscribed JS callback (used for reactive foreground UI).
  /// Runs independently of the native sync path — both fire concurrently.
  private func notifyJs(typeIdentifier: String, error: Error?) {
    let errorMessage = error?.localizedDescription

    queue.sync(flags: .barrier) {
      if let callback = self.jsCallback {
        DispatchQueue.main.async {
          callback(typeIdentifier, errorMessage)
        }
      } else {
        // JS not ready yet — queue the event for later
        self.pendingEvents.append((typeIdentifier: typeIdentifier, errorMessage: errorMessage))
      }
    }
  }

  // Local type resolution that doesn't depend on NitroModules (which isn't
  // available at AppDelegate time). Uses the older factory APIs
  // (quantityType(forIdentifier:) etc.) for iOS 13+ compatibility. Static so
  // NativeSyncEngine can also resolve types without NitroModules.
  static func sampleTypeFromString(_ identifier: String) -> HKSampleType? {
    if identifier.starts(with: "HKQuantityTypeIdentifier") {
      let typeId = HKQuantityTypeIdentifier(rawValue: identifier)
      return HKSampleType.quantityType(forIdentifier: typeId)
    }
    if identifier.starts(with: "HKCategoryTypeIdentifier") {
      let typeId = HKCategoryTypeIdentifier(rawValue: identifier)
      return HKSampleType.categoryType(forIdentifier: typeId)
    }
    if identifier == "HKWorkoutTypeIdentifier" {
      return HKSampleType.workoutType()
    }
    if identifier.starts(with: "HKCorrelationTypeIdentifier") {
      let typeId = HKCorrelationTypeIdentifier(rawValue: identifier)
      return HKSampleType.correlationType(forIdentifier: typeId)
    }
    if identifier == "HKAudiogramSampleType" {
      return HKObjectType.audiogramSampleType()
    }
    if identifier == "HKDataTypeIdentifierHeartbeatSeries" || identifier == "HKWorkoutRouteTypeIdentifier" {
      return HKObjectType.seriesType(forIdentifier: identifier)
    }
    if identifier == "HKElectrocardiogramType" {
      if #available(iOS 14.0, *) {
        return HKSampleType.electrocardiogramType()
      }
      return nil
    }
    return nil
  }
}
