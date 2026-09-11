import Foundation
import HealthKit
import os.log

private let bgLog = OSLog(subsystem: "com.kingstinct.healthkit.healthrecords", category: "BackgroundDelivery")

/// Registers HKObserverQueries for clinical record types at app launch, before
/// the JS bridge exists. Apple only delivers background updates to observer
/// queries registered in `application(_:didFinishLaunchingWithOptions:)`, so
/// this mirrors the core package's `BackgroundDeliveryManager`.
///
/// `HealthRecordsBackgroundLaunchHook.mm` calls `setupBackgroundObservers()` on
/// UIApplicationDidFinishLaunchingNotification, so no AppDelegate change is needed.
///
/// The types and frequency are persisted in UserDefaults by
/// `configureBackgroundTypes()` called from JS; on the next cold launch the
/// manager registers observers immediately and queues events until JS subscribes.
@objc(HealthRecordsBackgroundDeliveryManager)
public class HealthRecordsBackgroundDeliveryManager: NSObject {
  @objc public static let shared = HealthRecordsBackgroundDeliveryManager()

  private let healthStore = HKHealthStore()
  private let queue = DispatchQueue(
    label: "com.kingstinct.healthkit.healthrecords.background", attributes: .concurrent)
  private var observerQueries: [String: HKObserverQuery] = [:]
  private var pendingEvents: [(typeIdentifier: String, errorMessage: String?)] = []
  private var typeCallbacks: [String: (String, String?) -> Void] = [:]
  private var isSetUp = false

  static let typesKey = "com.kingstinct.healthkit.healthrecords.backgroundTypes"
  static let frequencyKey = "com.kingstinct.healthkit.healthrecords.backgroundFrequency"

  private override init() {
    super.init()
  }

  /// Call from AppDelegate.didFinishLaunchingWithOptions.
  @objc public func setupBackgroundObservers() {
    guard HKHealthStore.isHealthDataAvailable() else { return }

    guard
      let typeIdentifiers = UserDefaults.standard.stringArray(
        forKey: HealthRecordsBackgroundDeliveryManager.typesKey)
    else {
      return
    }

    let frequencyRaw = UserDefaults.standard.integer(
      forKey: HealthRecordsBackgroundDeliveryManager.frequencyKey)
    let frequency = HKUpdateFrequency(rawValue: frequencyRaw) ?? .immediate

    registerObservers(typeIdentifiers: typeIdentifiers, frequency: frequency)
  }

  /// Persist types and frequency, then register observers for this session.
  func configure(typeIdentifiers: [String], frequency: HKUpdateFrequency) {
    UserDefaults.standard.set(typeIdentifiers, forKey: HealthRecordsBackgroundDeliveryManager.typesKey)
    UserDefaults.standard.set(
      frequency.rawValue, forKey: HealthRecordsBackgroundDeliveryManager.frequencyKey)

    tearDown()
    registerObservers(typeIdentifiers: typeIdentifiers, frequency: frequency)
  }

  /// Subscribe a JS callback for one type; events queued before JS was ready
  /// are flushed immediately.
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

  func removeCallback(typeIdentifier: String) {
    queue.sync(flags: .barrier) {
      self.typeCallbacks.removeValue(forKey: typeIdentifier)
    }
  }

  /// True if an observer for `typeIdentifier` is registered here, so the
  /// module can route a JS subscription through it instead of a second query.
  func isBackgroundConfigured(typeIdentifier: String) -> Bool {
    return queue.sync {
      self.observerQueries[typeIdentifier] != nil
    }
  }

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

  /// Clear persisted configuration; no observers are registered on the next launch.
  func clearConfiguration() {
    UserDefaults.standard.removeObject(forKey: HealthRecordsBackgroundDeliveryManager.typesKey)
    UserDefaults.standard.removeObject(forKey: HealthRecordsBackgroundDeliveryManager.frequencyKey)
    tearDown()
  }

  private func registerObservers(typeIdentifiers: [String], frequency: HKUpdateFrequency) {
    queue.sync(flags: .barrier) {
      guard !self.isSetUp else { return }
      self.isSetUp = true
    }

    for typeIdentifier in typeIdentifiers {
      guard
        let clinicalType = HKObjectType.clinicalType(
          forIdentifier: HKClinicalTypeIdentifier(rawValue: typeIdentifier))
      else {
        print(
          "[react-native-healthkit/health-records] BackgroundDeliveryManager: skipping unrecognized type \(typeIdentifier)"
        )
        continue
      }

      let query = HKObserverQuery(sampleType: clinicalType, predicate: nil) {
        [weak self] (_: HKObserverQuery, completionHandler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
        self?.handleObserverCallback(typeIdentifier: typeIdentifier, error: error)
        completionHandler()
      }

      healthStore.execute(query)

      healthStore.enableBackgroundDelivery(for: clinicalType, frequency: frequency) { success, error in
        if let error = error {
          print(
            "[react-native-healthkit/health-records] BackgroundDeliveryManager: enableBackgroundDelivery failed for \(typeIdentifier): \(error.localizedDescription)"
          )
        } else if !success {
          print(
            "[react-native-healthkit/health-records] BackgroundDeliveryManager: enableBackgroundDelivery returned false for \(typeIdentifier)"
          )
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

    // Ask iOS for execution time first, so the process survives long enough
    // for Hermes to boot and the JS callback to run.
    var backgroundTaskId = UIBackgroundTaskIdentifier.invalid
    let endTask: () -> Void = { [weak self] in
      self?.queue.sync(flags: .barrier) {
        guard backgroundTaskId != .invalid else { return }
        UIApplication.shared.endBackgroundTask(backgroundTaskId)
        backgroundTaskId = .invalid
      }
    }
    backgroundTaskId = UIApplication.shared.beginBackgroundTask(
      withName: "healthkit-health-records-observer-\(typeIdentifier)"
    ) {
      endTask()
    }

    queue.sync(flags: .barrier) {
      if let callback = self.typeCallbacks[typeIdentifier] {
        DispatchQueue.main.async {
          callback(typeIdentifier, errorMessage)
        }
      } else {
        self.pendingEvents.append((typeIdentifier: typeIdentifier, errorMessage: errorMessage))
      }
    }

    // Same fixed window as the core package; see its BackgroundDeliveryManager.
    DispatchQueue.main.asyncAfter(deadline: .now() + 25) {
      endTask()
    }
  }
}
