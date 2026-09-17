//
//  HealthKitStore.swift
//  ReactNativeHealthkitCore
//
//  The HKHealthStore shared by every package built on this core, plus the
//  error and logging helpers each package wraps with its own log prefix.
//

import Foundation
import HealthKit
import NitroModules

/// One store for all packages. HKHealthStore instances are interchangeable, and
/// sharing one keeps authorization, queries and background delivery together.
public let healthStore = HKHealthStore()

public let coreLogPrefix = "[react-native-healthkit]"

/// Wraps `message` in a Nitro `RuntimeError` so it reaches JS with the message intact.
public func makeRuntimeError(_ message: String, prefix: String = coreLogPrefix) -> Error {
  return RuntimeError.error(withMessage: "\(prefix) \(message)")
}

public func logWarning(_ message: String, prefix: String = coreLogPrefix) {
  print("\(prefix) \(message)")
}

private let warnedOnceLock = NSLock()
private nonisolated(unsafe) var warnedOnceKeys = Set<String>()

/// Logs `message` the first time it is called with `key`, then stays quiet for
/// the rest of the process. For conditions that recur per sample, where warning
/// every time would flood the console (and the background-delivery window) but
/// warning never would hide a real data problem.
public func logWarningOnce(key: String, _ message: String, prefix: String = coreLogPrefix) {
  warnedOnceLock.lock()
  let isFirst = warnedOnceKeys.insert(key).inserted
  warnedOnceLock.unlock()

  guard isFirst else { return }
  print("\(prefix) \(message)")
}

public func initializeUUID(_ uuidString: String) throws -> UUID {
  if let uuid = UUID(uuidString: uuidString) {
    return uuid
  }

  throw makeRuntimeError("Got invalid UUID: \(uuidString)")
}
