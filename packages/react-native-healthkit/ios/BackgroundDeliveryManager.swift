import Foundation
import HealthKit

/// Manages HealthKit background delivery by registering observer queries at app launch,
/// before the JS bridge is available. This is required by Apple — observer queries must
/// be set up in `application(_:didFinishLaunchingWithOptions:)` to receive background
/// delivery callbacks after the app has been terminated.
///
/// Usage from AppDelegate.swift:
///   BackgroundDeliveryManager.shared.setupBackgroundObservers()
///
/// The types to observe are persisted in UserDefaults by `configureBackgroundTypes()`
/// called from JS. On subsequent cold launches, the manager reads these and registers
/// observers immediately, queuing any events until JS subscribes via `drainPendingEvents()`.
@objc public class BackgroundDeliveryManager: NSObject {
  @objc public static let shared = BackgroundDeliveryManager()

  private let healthStore = HKHealthStore()
  private let queue = DispatchQueue(label: "com.kingstinct.healthkit.background", attributes: .concurrent)
  private var observerQueries: [String: HKObserverQuery] = [:]
  private var pendingEvents: [(typeIdentifier: String, errorMessage: String?)] = []
  private var jsCallback: ((String, String?) -> Void)?
  private var isSetUp = false

  static let typesKey = "com.kingstinct.healthkit.backgroundTypes"
  static let frequencyKey = "com.kingstinct.healthkit.backgroundFrequency"

  private override init() {
    super.init()
  }

  /// Call this from AppDelegate.didFinishLaunchingWithOptions to register observer queries
  /// for any previously configured background delivery types.
  @objc public func setupBackgroundObservers() {
    guard HKHealthStore.isHealthDataAvailable() else { return }

    guard let typeIdentifiers = UserDefaults.standard.stringArray(forKey: BackgroundDeliveryManager.typesKey) else {
      return
    }

    let frequencyRaw = UserDefaults.standard.integer(forKey: BackgroundDeliveryManager.frequencyKey)
    let frequency = HKUpdateFrequency(rawValue: frequencyRaw) ?? .immediate

    registerObservers(typeIdentifiers: typeIdentifiers, frequency: frequency)
  }

  /// Persist types and frequency, then register observers for the current session.
  /// Called from JS via CoreModule.configureBackgroundTypes().
  func configure(typeIdentifiers: [String], frequency: HKUpdateFrequency) {
    UserDefaults.standard.set(typeIdentifiers, forKey: BackgroundDeliveryManager.typesKey)
    UserDefaults.standard.set(frequency.rawValue, forKey: BackgroundDeliveryManager.frequencyKey)

    // Tear down existing observers before re-registering
    tearDown()
    registerObservers(typeIdentifiers: typeIdentifiers, frequency: frequency)
  }

  /// Subscribe a JS callback. Any events that arrived before JS was ready are flushed immediately.
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

  /// Returns any pending events and clears the queue. Used by CoreModule.subscribeToObserverQuery
  /// to flush events that arrived before JS subscribed.
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
    UserDefaults.standard.removeObject(forKey: BackgroundDeliveryManager.typesKey)
    UserDefaults.standard.removeObject(forKey: BackgroundDeliveryManager.frequencyKey)
    tearDown()
  }

  private func registerObservers(typeIdentifiers: [String], frequency: HKUpdateFrequency) {
    queue.sync(flags: .barrier) {
      guard !self.isSetUp else { return }
      self.isSetUp = true
    }

    for typeIdentifier in typeIdentifiers {
      guard let sampleType = BackgroundDeliveryManager.sampleTypeFromString(typeIdentifier) else {
        print("[react-native-healthkit] BackgroundDeliveryManager: skipping unrecognized type \(typeIdentifier)")
        continue
      }

      // Use nil predicate to catch all samples, including those written while the app was terminated.
      // The current subscribeToObserverQuery uses Date.init() which misses data from when the app was dead.
      let query = HKObserverQuery(
        sampleType: sampleType,
        predicate: nil
      ) { [weak self] (_: HKObserverQuery, completionHandler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
        guard let self = self else { completionHandler(); return }

        // The observer callback runs on a HealthKit-owned background queue.
        // We check jsCallback via a synchronous barrier read — this is a fast
        // property access (no long-running work under the lock), so it's safe
        // to do synchronously even though iOS expects prompt progress here.
        let hasJsCallback = self.queue.sync { self.jsCallback != nil }

        if hasJsCallback {
          // JS bridge available (foreground) — dispatch to JS, complete immediately
          self.handleObserverCallback(typeIdentifier: typeIdentifier, error: error)
          completionHandler()
        } else {
          // No JS bridge (terminated/headless) — native sync within ~30s budget
          NativeSyncEngine.shared.syncType(typeIdentifier) {
            completionHandler()
          }
        }
      }

      healthStore.execute(query)

      healthStore.enableBackgroundDelivery(for: sampleType, frequency: frequency) { success, error in
        if let error = error {
          print("[react-native-healthkit] BackgroundDeliveryManager: enableBackgroundDelivery failed for \(typeIdentifier): \(error.localizedDescription)")
        } else if !success {
          print("[react-native-healthkit] BackgroundDeliveryManager: enableBackgroundDelivery returned false for \(typeIdentifier)")
        }
      }

      queue.sync(flags: .barrier) {
        self.observerQueries[typeIdentifier] = query
      }
    }
  }

  private func handleObserverCallback(typeIdentifier: String, error: Error?) {
    let errorMessage = error?.localizedDescription

    queue.sync(flags: .barrier) {
      if let callback = self.jsCallback {
        // JS is connected — dispatch to main thread for JSI safety
        DispatchQueue.main.async {
          callback(typeIdentifier, errorMessage)
        }
      } else {
        // JS not ready yet — queue the event for later
        self.pendingEvents.append((typeIdentifier: typeIdentifier, errorMessage: errorMessage))
      }
    }
  }

  // Local type resolution that doesn't depend on NitroModules (which isn't available at AppDelegate time).
  // Uses the older factory APIs (quantityType(forIdentifier:) etc.) for iOS 13+ compatibility.
  // Static so NativeSyncEngine can also resolve types without NitroModules.
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
