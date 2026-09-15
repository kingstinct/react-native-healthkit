//
//  Exceptions.swift
//  ReactNativeHealthkitCore
//
//  HealthKit raises Objective-C exceptions for some invalid input (unit
//  strings, authorization for unsupported types). Swift cannot catch those, so
//  these wrappers route through ExceptionCatcher.mm and rethrow as Swift errors.
//

import Foundation
import HealthKit

// Internal import: dependents importing ReactNativeHealthkitCore must not need
// the private Objective-C module (its headers are not shipped publicly).
internal import ReactNativeHealthkitCore_Private

/// Runs `block`; an Objective-C exception raised inside it is thrown as an `NSError`.
public func runCatchingObjCExceptions(_ block: () -> Void) throws {
  var caughtError: NSError?
  let completed = RunBlockCatchingObjCExceptions(block, &caughtError)
  if !completed {
    throw caughtError ?? makeRuntimeError("Unknown Objective-C exception")
  }
}

/// `HKUnit(from:)` throws an Objective-C exception for unknown unit strings.
public func parseUnitStringSafe(_ unitString: String) throws -> HKUnit {
  var err: NSError?
  if let unit = HKUnitFromStringCatchingExceptions(unitString, &err) {
    return unit
  }

  throw makeRuntimeError("Supplied invalid '\(unitString)' as HKUnit")
}
