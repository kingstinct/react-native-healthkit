//
//  Queries.swift
//  ReactNativeHealthkitCore
//
//  Async wrappers around the HealthKit query and save APIs.
//

import Foundation
import HealthKit
import UIKit

public func getQueryLimit(_ limit: Double) -> Int {
  if limit == .infinity || limit <= 0 || limit.isNaN {
    return HKObjectQueryNoLimit
  }

  return Int(limit)
}

public func getSortDescriptors(ascending: Bool?) -> [NSSortDescriptor] {
  return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending ?? false)]
}

public func sampleQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  predicate: NSPredicate?,
  sortDescriptors: [NSSortDescriptor]?
) async throws -> [HKSample] {
  let limit = getQueryLimit(limit)
  return try await withCheckedThrowingContinuation { continuation in
    let query = HKSampleQuery(
      sampleType: sampleType,
      predicate: predicate,
      limit: limit,
      sortDescriptors: sortDescriptors
    ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
      DispatchQueue.main.async {
        if let error = error {
          return continuation.resume(throwing: error)
        }

        if let samples = samples {
          return continuation.resume(returning: samples)
        }

        return continuation.resume(throwing: makeRuntimeError("Unexpected empty response"))
      }
    }

    healthStore.execute(query)
  }
}

/// Result of an anchored query. Deleted objects are returned as HealthKit
/// hands them over; each package serializes them into its own struct.
public struct AnchoredQueryResponse {
  public let samples: [HKSample]
  public let deletedObjects: [HKDeletedObject]
  public let newAnchor: String
}

public func sampleAnchoredQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  queryAnchor: String?,
  predicate: NSPredicate?
) async throws -> AnchoredQueryResponse {
  let queryAnchor = try deserializeHKQueryAnchor(base64String: queryAnchor)

  return try await withCheckedThrowingContinuation { continuation in
    let query = HKAnchoredObjectQuery(
      type: sampleType,
      predicate: predicate,
      anchor: queryAnchor,
      limit: getQueryLimit(limit)
    ) {
      (
        _: HKAnchoredObjectQuery, samples: [HKSample]?, deletedObjects: [HKDeletedObject]?,
        newAnchor: HKQueryAnchor?, error: Error?
      ) in
      DispatchQueue.main.async {
        if let error = error {
          return continuation.resume(throwing: error)
        }

        if let samples = samples, let deletedObjects = deletedObjects,
          let newAnchor = serializeAnchor(anchor: newAnchor) {
          return continuation.resume(
            returning: AnchoredQueryResponse(
              samples: samples,
              deletedObjects: deletedObjects,
              newAnchor: newAnchor
            )
          )
        }

        return continuation.resume(throwing: makeRuntimeError("Unexpected empty response"))
      }
    }

    healthStore.execute(query)
  }
}

public func saveAsync(sample: HKObject) async throws -> Bool {
  return try await withCheckedThrowingContinuation { continuation in
    healthStore.save(sample) { (success: Bool, error: Error?) in
      DispatchQueue.main.async {
        if let error = error {
          continuation.resume(throwing: error)
        } else {
          continuation.resume(returning: success)
        }
      }
    }
  }
}

private let storeReopenRetryDelay: UInt64 = 1_000_000_000

/// HealthKit seals its store the moment the device locks and re-opens it a beat
/// after it unlocks, and iOS can resume the app inside that beat. A query that
/// hits the gap fails with `errorDatabaseInaccessible` although protected data is
/// reported available — the store is re-opening, not sealed. Runs `operation`
/// and, on exactly that refusal, gives it one more attempt after a short delay.
/// A refusal while protected data is unavailable is the sealed store itself and
/// is thrown as-is, as is every other error.
public func retryingWhileStoreReopens<T>(
  _ operation: () async throws -> T
) async throws -> T {
  do {
    return try await operation()
  } catch {
    let nsError = error as NSError
    guard nsError.domain == HKError.errorDomain,
      nsError.code == HKError.Code.errorDatabaseInaccessible.rawValue
    else { throw error }
    let protectedDataAvailable = await MainActor.run {
      UIApplication.shared.isProtectedDataAvailable
    }
    guard protectedDataAvailable else { throw error }
    try await Task.sleep(nanoseconds: storeReopenRetryDelay)
    return try await operation()
  }
}
