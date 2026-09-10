//
//  HealthRecordsModule.swift
//  ReactNativeHealthkitHealthRecords
//
//  Exposes HealthKit clinical records (FHIR) to JS.
//  https://developer.apple.com/documentation/healthkit/accessing-health-records
//

import Foundation
import HealthKit
import NitroModules

class HealthRecordsModule: HybridHealthRecordsModuleSpec {
  var _runningQueries: [String: HKQuery] = [:]

  func isHealthDataAvailable() -> Bool {
    return HKHealthStore.isHealthDataAvailable()
  }

  func supportsHealthRecords() -> Bool {
    return store.supportsHealthRecords()
  }

  func authorizationStatusFor(type: ClinicalTypeIdentifier) throws -> AuthorizationStatus {
    let clinicalType = try clinicalTypeFrom(type)

    let authStatus = store.authorizationStatus(for: clinicalType)

    if let authStatus = AuthorizationStatus(rawValue: Int32(authStatus.rawValue)) {
      return authStatus
    }

    throw runtimeErrorWithPrefix(
      "Got unrecognized AuthorizationStatus rawValue: \(authStatus.rawValue)")
  }

  func getRequestStatusForAuthorization(toRead: [ClinicalTypeIdentifier]) -> Promise<
    AuthorizationRequestStatus
  > {
    return Promise.async {
      let types = clinicalTypesFromArray(toRead)

      if types.isEmpty {
        warnWithPrefix("toRead is empty, returning 'unnecessary' status")
        return .unnecessary
      }

      return try await withCheckedThrowingContinuation { continuation in
        store.getRequestStatusForAuthorization(toShare: [], read: types) { status, error in
          DispatchQueue.main.async {
            if let error = error {
              return continuation.resume(throwing: error)
            }
            if let authStatus = AuthorizationRequestStatus(rawValue: Int32(status.rawValue)) {
              return continuation.resume(returning: authStatus)
            }
            continuation.resume(
              throwing: runtimeErrorWithPrefix(
                "Unrecognized authStatus returned: \(status.rawValue)"))
          }
        }
      }
    }
  }

  func requestAuthorization(toRead: [ClinicalTypeIdentifier]) -> Promise<Bool> {
    return Promise.async {
      let types = clinicalTypesFromArray(toRead)

      if types.isEmpty {
        throw runtimeErrorWithPrefix("requestAuthorization: no valid clinical types to request")
      }

      return try await withCheckedThrowingContinuation { continuation in
        store.requestAuthorization(toShare: nil, read: types) { success, error in
          DispatchQueue.main.async {
            if let error = error {
              return continuation.resume(throwing: error)
            }
            continuation.resume(returning: success)
          }
        }
      }
    }
  }

  func queryClinicalRecords(
    clinicalType: ClinicalTypeIdentifier, options: QueryOptionsWithSortOrder
  ) -> Promise<[ClinicalRecord]> {
    return Promise.async {
      let sampleType = try clinicalTypeFrom(clinicalType)
      let predicate = createPredicateForClinicalRecords(options.filter)

      let samples = try await sampleQueryAsync(
        sampleType: sampleType,
        limit: options.limit,
        predicate: predicate,
        sortDescriptors: getSortDescriptors(ascending: options.ascending)
      )

      return try samples.compactMap { sample in
        if let record = sample as? HKClinicalRecord {
          return try serializeClinicalRecord(record)
        }
        return nil
      }
    }
  }

  func queryClinicalRecordsWithAnchor(
    clinicalType: ClinicalTypeIdentifier, options: QueryOptionsWithAnchor
  ) -> Promise<ClinicalRecordsWithAnchorResponse> {
    return Promise.async {
      let sampleType = try clinicalTypeFrom(clinicalType)
      let predicate = createPredicateForClinicalRecords(options.filter)

      let response = try await sampleAnchoredQueryAsync(
        sampleType: sampleType,
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      let records = try response.samples.compactMap { sample in
        if let record = sample as? HKClinicalRecord {
          return try serializeClinicalRecord(record)
        }
        return nil
      }

      return ClinicalRecordsWithAnchorResponse(
        records: records,
        deletedRecords: response.deletedSamples,
        newAnchor: response.newAnchor
      )
    }
  }

  func subscribeToObserverQuery(
    clinicalType: ClinicalTypeIdentifier,
    callback: @escaping (OnChangeCallbackArgs) -> Void
  ) throws -> String {
    let sampleType = try clinicalTypeFrom(clinicalType)

    let queryId = UUID().uuidString

    let query = HKObserverQuery(sampleType: sampleType, predicate: nil) {
      (_: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
      DispatchQueue.main.async {
        callback(
          OnChangeCallbackArgs(
            typeIdentifier: clinicalType, errorMessage: error?.localizedDescription))
        handler()
      }
    }

    store.execute(query)

    self._runningQueries.updateValue(query, forKey: queryId)

    return queryId
  }

  func unsubscribeQuery(queryId: String) -> Bool {
    guard let query = self._runningQueries[queryId] else {
      warnWithPrefix("unsubscribeQuery: Query with id \(queryId) not found")
      return false
    }

    store.stop(query)

    self._runningQueries.removeValue(forKey: queryId)

    return true
  }

  func enableBackgroundDelivery(
    clinicalType: ClinicalTypeIdentifier, updateFrequency: UpdateFrequency
  ) -> Promise<Bool> {
    return Promise.async {
      guard let frequency = HKUpdateFrequency(rawValue: Int(updateFrequency.rawValue)) else {
        throw runtimeErrorWithPrefix("Invalid update frequency rawValue: \(updateFrequency)")
      }
      let type = try clinicalTypeFrom(clinicalType)

      return try await withCheckedThrowingContinuation { continuation in
        store.enableBackgroundDelivery(for: type, frequency: frequency) { success, error in
          DispatchQueue.main.async {
            if let error = error {
              return continuation.resume(throwing: error)
            }
            continuation.resume(returning: success)
          }
        }
      }
    }
  }

  func disableBackgroundDelivery(clinicalType: ClinicalTypeIdentifier) -> Promise<Bool> {
    return Promise.async {
      let type = try clinicalTypeFrom(clinicalType)

      return try await withCheckedThrowingContinuation { continuation in
        store.disableBackgroundDelivery(for: type) { success, error in
          DispatchQueue.main.async {
            if let error = error {
              return continuation.resume(throwing: error)
            }
            continuation.resume(returning: success)
          }
        }
      }
    }
  }
}
