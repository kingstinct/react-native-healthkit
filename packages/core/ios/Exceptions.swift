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

/// Resumes a checked continuation at most once. HealthKit can raise after it has
/// registered its completion and then still call that completion, so the raise
/// and the completion can both try to resume. The second resume is dropped
/// instead of trapping with "SWIFT TASK CONTINUATION MISUSE".
private final class ResumeOnce<T>: @unchecked Sendable {
  private let lock = NSLock()
  private var continuation: CheckedContinuation<T, Error>?

  init(_ continuation: CheckedContinuation<T, Error>) {
    self.continuation = continuation
  }

  private func take() -> CheckedContinuation<T, Error>? {
    lock.lock()
    defer { lock.unlock() }
    let taken = continuation
    continuation = nil
    return taken
  }

  func resume(returning value: T) {
    take()?.resume(returning: value)
  }

  func resume(throwing error: Error) {
    take()?.resume(throwing: error)
  }
}

/// `getRequestStatusForAuthorization` raises an Objective-C exception for some
/// type sets on iOS 26. Calls HealthKit from Objective-C so the exception is
/// caught, and resolves on the main queue like the plain HealthKit callback.
public func getRequestStatusForAuthorizationSafe(
  toShare: Set<HKSampleType>, read: Set<HKObjectType>
) async throws -> HKAuthorizationRequestStatus {
  return try await withCheckedThrowingContinuation { continuation in
    let once = ResumeOnce(continuation)
    var caughtError: NSError?
    let started = HKGetRequestStatusForAuthorizationCatchingExceptions(
      healthStore, toShare, read,
      { status, error in
        DispatchQueue.main.async {
          if let error = error {
            once.resume(throwing: error)
          } else {
            once.resume(returning: status)
          }
        }
      }, &caughtError)
    if !started {
      once.resume(
        throwing: (caughtError as Error?)
          ?? makeRuntimeError("getRequestStatusForAuthorization raised an Objective-C exception"))
    }
  }
}

/// `requestAuthorization` counterpart of `getRequestStatusForAuthorizationSafe`.
public func requestAuthorizationSafe(
  toShare: Set<HKSampleType>, read: Set<HKObjectType>
) async throws -> Bool {
  return try await withCheckedThrowingContinuation { continuation in
    let once = ResumeOnce(continuation)
    var caughtError: NSError?
    let started = HKRequestAuthorizationCatchingExceptions(
      healthStore, toShare, read,
      { success, error in
        DispatchQueue.main.async {
          if let error = error {
            once.resume(throwing: error)
          } else {
            once.resume(returning: success)
          }
        }
      }, &caughtError)
    if !started {
      once.resume(
        throwing: (caughtError as Error?)
          ?? makeRuntimeError("requestAuthorization raised an Objective-C exception"))
    }
  }
}
