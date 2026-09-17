import Foundation
import HealthKit
import UIKit
import os.log

private let bgLog = OSLog(subsystem: "com.kingstinct.healthkit", category: "BackgroundDelivery")

/// Identifies the package that owns a set of background-delivery types. Each
/// scope persists its own type list and update frequency, so one package's
/// `configureBackgroundTypes` never replaces another's. The id doubles as the
/// UserDefaults key prefix; the packages use the ids they stored under before
/// this manager was shared, so existing installs keep their configuration.
public struct BackgroundDeliveryScope: Hashable {
  public let id: String

  public init(id: String) {
    self.id = id
  }

  var typesKey: String { "\(id).backgroundTypes" }
  var frequencyKey: String { "\(id).backgroundFrequency" }
}

/// Manages HealthKit background delivery by registering observer queries at app launch,
/// before the JS bridge is available. This is required by Apple — observer queries must
/// be set up in `application(_:didFinishLaunchingWithOptions:)` to receive background
/// delivery callbacks after the app has been terminated.
///
/// `BackgroundLaunchHook.mm` calls `setupBackgroundObservers()` on
/// UIApplicationDidFinishLaunchingNotification, so no AppDelegate change is needed.
/// The `@objc(RNHealthKitCoreBackgroundDeliveryManager)` name is what that hook looks up
/// at runtime. It is deliberately not the bare `BackgroundDeliveryManager`: versions of
/// `@kingstinct/react-native-healthkit` from before this pod existed export a class under
/// that name, and an app that upgrades only `@react-native-healthkit/health-records` would
/// otherwise load two classes with one name, leaving `NSClassFromString` to pick either.
///
/// The types to observe are persisted in UserDefaults per scope by `configure(scope:...)`,
/// called from each package's `configureBackgroundTypes()`. On subsequent cold launches
/// the manager reads them and registers observers immediately, queuing any events until
/// JS subscribes via `setCallback(typeIdentifier:callback:)`.
@objc(RNHealthKitCoreBackgroundDeliveryManager)
public final class BackgroundDeliveryManager: NSObject {
  @objc public static let shared = BackgroundDeliveryManager()

  /// Scopes with persisted configuration. Filled by `configure(scope:...)`; the
  /// legacy ids cover installs configured before the registry existed.
  private static let scopesKey = "com.kingstinct.healthkit.backgroundScopes"
  private static let legacyScopeIds = [
    "com.kingstinct.healthkit",
    "com.kingstinct.healthkit.healthrecords",
  ]

  private let queue = DispatchQueue(
    label: "com.kingstinct.healthkit.background", attributes: .concurrent)
  private var observerQueries: [String: (scope: BackgroundDeliveryScope, query: HKObserverQuery)] = [:]
  private var pendingEvents: [(typeIdentifier: String, errorMessage: String?)] = []
  // Per-type JS callbacks. Lets a package route a JS subscription for a
  // background-configured type through this manager's already-running
  // HKObserverQuery instead of registering a second, independent one.
  private var typeCallbacks: [String: (String, String?) -> Void] = [:]
  private var registeredScopes: Set<BackgroundDeliveryScope> = []

  private override init() {
    super.init()
  }

  /// Registers observer queries for every scope's previously configured types.
  /// Called at launch by `BackgroundLaunchHook.mm`; safe to call again.
  @objc public func setupBackgroundObservers() {
    guard HKHealthStore.isHealthDataAvailable() else { return }

    var registeredAny = false
    for scope in persistedScopes() {
      guard let typeIdentifiers = UserDefaults.standard.stringArray(forKey: scope.typesKey) else {
        continue
      }
      registeredAny = true

      let frequencyRaw = UserDefaults.standard.integer(forKey: scope.frequencyKey)
      let frequency = HKUpdateFrequency(rawValue: frequencyRaw) ?? .immediate

      os_log(
        "launch: registering %d background observer(s) for %{public}@: %{public}@", log: bgLog,
        type: .info, typeIdentifiers.count, scope.id, typeIdentifiers.joined(separator: ", "))

      registerObservers(scope: scope, typeIdentifiers: typeIdentifiers, frequency: frequency)
    }

    if !registeredAny {
      os_log(
        "launch: no background delivery types configured, nothing to register", log: bgLog,
        type: .debug)
    }
  }

  /// Persist the scope's types and frequency, then register observers for the
  /// current session. Replaces the scope's previous configuration only.
  public func configure(
    scope: BackgroundDeliveryScope, typeIdentifiers: [String], frequency: HKUpdateFrequency
  ) {
    let defaults = UserDefaults.standard
    defaults.set(typeIdentifiers, forKey: scope.typesKey)
    defaults.set(frequency.rawValue, forKey: scope.frequencyKey)

    var scopeIds = defaults.stringArray(forKey: BackgroundDeliveryManager.scopesKey) ?? []
    if !scopeIds.contains(scope.id) {
      scopeIds.append(scope.id)
      defaults.set(scopeIds, forKey: BackgroundDeliveryManager.scopesKey)
    }

    tearDown(scope: scope)
    registerObservers(scope: scope, typeIdentifiers: typeIdentifiers, frequency: frequency)
  }

  /// Clear the scope's persisted configuration and stop its observer queries;
  /// nothing is registered for it on the next launch.
  public func clearConfiguration(scope: BackgroundDeliveryScope) {
    UserDefaults.standard.removeObject(forKey: scope.typesKey)
    UserDefaults.standard.removeObject(forKey: scope.frequencyKey)
    tearDown(scope: scope)
  }

  /// Subscribe a JS callback for one type. Events for that type which arrived
  /// before JS subscribed (e.g. from a background wake) are flushed immediately.
  public func setCallback(typeIdentifier: String, callback: @escaping (String, String?) -> Void) {
    queue.sync(flags: .barrier) {
      self.typeCallbacks[typeIdentifier] = callback
      let matching = self.pendingEvents.filter { $0.typeIdentifier == typeIdentifier }
      self.pendingEvents.removeAll { $0.typeIdentifier == typeIdentifier }
      for event in matching {
        callback(typeIdentifier, event.errorMessage)
      }
    }
  }

  public func removeCallback(typeIdentifier: String) {
    queue.sync(flags: .barrier) {
      _ = self.typeCallbacks.removeValue(forKey: typeIdentifier)
    }
  }

  /// True if an observer for `typeIdentifier` is registered here, so a package
  /// can route a JS subscription through it instead of a second query.
  public func isBackgroundConfigured(typeIdentifier: String) -> Bool {
    return queue.sync {
      self.observerQueries[typeIdentifier] != nil
    }
  }

  /// Stop the scope's observer queries and drop their callbacks.
  public func tearDown(scope: BackgroundDeliveryScope) {
    queue.sync(flags: .barrier) {
      for (typeIdentifier, entry) in self.observerQueries where entry.scope == scope {
        healthStore.stop(entry.query)
        self.observerQueries.removeValue(forKey: typeIdentifier)
        self.typeCallbacks.removeValue(forKey: typeIdentifier)
      }
      _ = self.registeredScopes.remove(scope)
    }
  }

  private func persistedScopes() -> [BackgroundDeliveryScope] {
    let stored = UserDefaults.standard.stringArray(forKey: BackgroundDeliveryManager.scopesKey) ?? []
    var seen = Set<String>()
    return (stored + BackgroundDeliveryManager.legacyScopeIds).compactMap { id in
      seen.insert(id).inserted ? BackgroundDeliveryScope(id: id) : nil
    }
  }

  private func registerObservers(
    scope: BackgroundDeliveryScope, typeIdentifiers: [String], frequency: HKUpdateFrequency
  ) {
    let alreadyRegistered = queue.sync(flags: .barrier) { () -> Bool in
      if self.registeredScopes.contains(scope) {
        return true
      }
      self.registeredScopes.insert(scope)
      return false
    }
    guard !alreadyRegistered else { return }

    for typeIdentifier in typeIdentifiers {
      guard let sampleType = sampleType(fromIdentifier: typeIdentifier) else {
        logWarning("BackgroundDeliveryManager: skipping unrecognized type \(typeIdentifier)")
        continue
      }

      // Use nil predicate to catch all samples, including those written while the app was terminated.
      let query = HKObserverQuery(sampleType: sampleType, predicate: nil) {
        [weak self] (_: HKObserverQuery, completionHandler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
        // handleObserverCallback opens a beginBackgroundTask() window as its
        // first, synchronous action, before this returns to call
        // completionHandler() — otherwise iOS is free to suspend the process
        // the moment HealthKit's own completion handler fires, possibly
        // before Hermes has finished booting to run the JS callback.
        self?.handleObserverCallback(typeIdentifier: typeIdentifier, error: error)
        // Must call the completion handler promptly so iOS knows we processed the update.
        completionHandler()
      }

      healthStore.execute(query)

      healthStore.enableBackgroundDelivery(for: sampleType, frequency: frequency) { success, error in
        if let error = error {
          logWarning(
            "BackgroundDeliveryManager: enableBackgroundDelivery failed for \(typeIdentifier): \(error.localizedDescription)"
          )
        } else if !success {
          logWarning(
            "BackgroundDeliveryManager: enableBackgroundDelivery returned false for \(typeIdentifier)")
        }
      }

      queue.sync(flags: .barrier) {
        self.observerQueries[typeIdentifier] = (scope: scope, query: query)
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
    backgroundTaskId = UIApplication.shared.beginBackgroundTask(
      withName: "healthkit-observer-\(typeIdentifier)"
    ) {
      os_log("background task expired: %{public}@", log: bgLog, type: .info, typeIdentifier)
      endTask()
    }
    os_log("background task started: %{public}@", log: bgLog, type: .info, typeIdentifier)

    queue.sync(flags: .barrier) {
      if let callback = self.typeCallbacks[typeIdentifier] {
        DispatchQueue.main.async {
          os_log("dispatching to JS callback: %{public}@", log: bgLog, type: .info, typeIdentifier)
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
    // async work is unpredictable, and a completion-ack channel back from JS
    // isn't worth building yet. First place to revisit if verification shows
    // this window is too tight.
    DispatchQueue.main.asyncAfter(deadline: .now() + 25) {
      os_log("background task window elapsed: %{public}@", log: bgLog, type: .info, typeIdentifier)
      endTask()
    }
  }
}
