import Foundation
import HealthKit
import os.log

private let bgLog = OSLog(subsystem: "com.kingstinct.healthkit", category: "BackgroundDelivery")

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
  // Per-type callbacks, checked before the global `jsCallback` above. Lets
  // CoreModule.subscribeToObserverQuery route a JS subscription for a
  // background-configured type through this manager's already-running
  // HKObserverQuery instead of registering a second, independent one.
  private var typeCallbacks: [String: (String, String?) -> Void] = [:]
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

  /// Subscribe a JS callback for a specific type. Any events for this type
  /// that arrived before JS subscribed (e.g. from a background wake, queued
  /// in `pendingEvents` above) are flushed immediately.
  func setCallback(typeIdentifier: String, callback: @escaping (String, String?) -> Void) {
    queue.sync(flags: .barrier) {
      self.typeCallbacks[typeIdentifier] = callback
      let matching = self.pendingEvents.filter { $0.typeIdentifier == typeIdentifier }
      self.pendingEvents.removeAll { $0.typeIdentifier == typeIdentifier }
      for event in matching {
        callback(typeIdentifier, event.errorMessage)
      }
    }
  }

  /// Remove the per-type JS callback (e.g., on unsubscribe).
  func removeCallback(typeIdentifier: String) {
    queue.sync(flags: .barrier) {
      self.typeCallbacks.removeValue(forKey: typeIdentifier)
    }
  }

  /// True if `typeIdentifier` has a native HKObserverQuery registered by
  /// `registerObservers` — i.e. background delivery is configured for it.
  /// CoreModule.subscribeToObserverQuery checks this before deciding whether
  /// to reuse this manager's observer or register its own.
  func isBackgroundConfigured(typeIdentifier: String) -> Bool {
    return queue.sync {
      self.observerQueries[typeIdentifier] != nil
    }
  }

  /// Stop all observer queries and clear state.
  func tearDown() {
    queue.sync(flags: .barrier) {
      for (_, query) in self.observerQueries {
        self.healthStore.stop(query)
      }
      self.observerQueries = [:]
      self.typeCallbacks = [:]
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
      guard let sampleType = sampleTypeFromString(typeIdentifier) else {
        print("[react-native-healthkit] BackgroundDeliveryManager: skipping unrecognized type \(typeIdentifier)")
        continue
      }

      // Use nil predicate to catch all samples, including those written while the app was terminated.
      // The current subscribeToObserverQuery uses Date.init() which misses data from when the app was dead.
      let query = HKObserverQuery(
        sampleType: sampleType,
        predicate: nil
      ) { [weak self] (_: HKObserverQuery, completionHandler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
        // handleObserverCallback opens a beginBackgroundTask() window as its
        // first, synchronous action, before this returns to call
        // completionHandler() — otherwise iOS is free to suspend the process
        // the moment HealthKit's own completion handler fires, possibly
        // before Hermes has finished booting to run the JS callback.
        self?.handleObserverCallback(
          typeIdentifier: typeIdentifier,
          error: error
        )
        // Must call the completion handler promptly so iOS knows we processed the update.
        completionHandler()
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
    os_log("observer fired: %{public}@", log: bgLog, type: .info, typeIdentifier)

    // Ask iOS for real execution time before doing anything else, so the
    // process survives long enough for Hermes to boot and the JS callback to
    // run — see the comment at this query's registration above.
    var backgroundTaskId = UIBackgroundTaskIdentifier.invalid
    let endTask: () -> Void = { [weak self] in
      self?.queue.sync(flags: .barrier) {
        guard backgroundTaskId != .invalid else { return }
        UIApplication.shared.endBackgroundTask(backgroundTaskId)
        backgroundTaskId = .invalid
      }
    }
    backgroundTaskId = UIApplication.shared.beginBackgroundTask(withName: "healthkit-observer-\(typeIdentifier)") {
      os_log("background task expired: %{public}@", log: bgLog, type: .info, typeIdentifier)
      endTask()
    }
    os_log("background task started: %{public}@", log: bgLog, type: .info, typeIdentifier)

    queue.sync(flags: .barrier) {
      if let callback = self.typeCallbacks[typeIdentifier] {
        DispatchQueue.main.async {
          os_log("dispatching to per-type JS callback: %{public}@", log: bgLog, type: .info, typeIdentifier)
          callback(typeIdentifier, errorMessage)
        }
      } else if let callback = self.jsCallback {
        // JS is connected — dispatch to main thread for JSI safety
        DispatchQueue.main.async {
          os_log("dispatching to global JS callback: %{public}@", log: bgLog, type: .info, typeIdentifier)
          callback(typeIdentifier, errorMessage)
        }
      } else {
        // JS not ready yet — queue the event for later
        os_log("no JS callback yet, queuing: %{public}@", log: bgLog, type: .info, typeIdentifier)
        self.pendingEvents.append((typeIdentifier: typeIdentifier, errorMessage: errorMessage))
      }
    }

    // Hold the task open for a fixed, generous window rather than trying to
    // ack precisely when JS finishes — Hermes boot plus the JS callback's own
    // async work (HealthKit reads + Supabase upsert) is unpredictable, and a
    // completion-ack channel back from JS isn't worth building on the first
    // pass for a personal-use app. First place to revisit if verification
    // shows this window is too tight.
    DispatchQueue.main.asyncAfter(deadline: .now() + 25) {
      os_log("background task window elapsed: %{public}@", log: bgLog, type: .info, typeIdentifier)
      endTask()
    }
  }

  // Local type resolution that doesn't depend on NitroModules (which isn't available at AppDelegate time).
  // Uses the older factory APIs (quantityType(forIdentifier:) etc.) for iOS 13+ compatibility.
  private func sampleTypeFromString(_ identifier: String) -> HKSampleType? {
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
