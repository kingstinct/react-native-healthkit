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

public func initializeUUID(_ uuidString: String) throws -> UUID {
  if let uuid = UUID(uuidString: uuidString) {
    return uuid
  }

  throw makeRuntimeError("Got invalid UUID: \(uuidString)")
}
