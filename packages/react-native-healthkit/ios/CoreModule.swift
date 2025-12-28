import HealthKit
import NitroModules

//
//  Core.swift
//  Pods
//
//  Created by Robert Herber on 2025-05-28.
//

var store = HKHealthStore.init()

// Thread-safe cache with concurrent read/exclusive write access
private let quantityTypeCacheQueue = DispatchQueue(
  label: "com.kingstinct.healthkit.cache",
  attributes: .concurrent
)
private var quantityTypeUnitCache = [HKQuantityType: HKUnit]()

func getUnitToUse(unitOverride: String?, quantityType: HKQuantityType) async throws -> HKUnit {
  if let unitOverride = unitOverride {
    let unit = try parseUnitStringSafe(unitOverride)

    if !quantityType.is(compatibleWith: unit) {
      throw runtimeErrorWithPrefix(
        "Unit \(unitOverride) is incompatible with quantityType \(quantityType.identifier)")
    }

    return unit
  }

  if let preferredUnit = try await getPreferredUnitsInternal(quantityTypes: [quantityType]).first?
    .value {
    return preferredUnit
  }

  throw runtimeErrorWithPrefix("getUnitToUse: Must specify a unit for \(quantityType.identifier)")
}

func getPreferredUnitsInternal(quantityTypes: [HKQuantityType], forceUpdate: Bool? = false)
async throws -> [HKQuantityType: HKUnit] {

  if quantityTypes.count == 0 {
    return [:]
  }

  if forceUpdate != true {
    // Thread-safe read: concurrent reads are allowed
    let itemsInCache = quantityTypeCacheQueue.sync {
      return quantityTypeUnitCache.filter {
        quantityTypes.contains($0.key)
      }
    }
    if itemsInCache.count == quantityTypes.count {
      return itemsInCache
    }
  }

  return try await withCheckedThrowingContinuation { continuation in
    store.preferredUnits(for: Set(quantityTypes)) {
      (typePerUnits: [HKQuantityType: HKUnit], error: Error?) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      // Thread-safe write: barrier ensures exclusive access
      quantityTypeCacheQueue.sync(flags: .barrier) {
        typePerUnits.forEach { (type: HKQuantityType, unit: HKUnit) in
          quantityTypeUnitCache.updateValue(unit, forKey: type)
        }
      }

      return continuation.resume(returning: typePerUnits)
    }
  }
}

class CoreModule: HybridCoreModuleSpec {
  func requestPerObjectReadAuthorization(typeIdentifier: PerObjectTypeIdentifier) -> Promise<Void> {
    return Promise.async {
      let objectType = try perObjectTypeFrom(objectTypeIdentifier: typeIdentifier)
      if #available(iOS 16.0, *) {
        try await store.requestPerObjectReadAuthorization(
          for: objectType,
          predicate: nil
        )
      } else {
        warnWithPrefix("Per-object read authorization is only available on iOS 16.0 and above")
      }
    }
  }

  func currentAppSource() -> any HybridSourceProxySpec {
    return SourceProxy(source: HKSource.default())
  }

  func areObjectTypesAvailable(objectTypeIdentifiers: [ObjectTypeIdentifier]) -> [String: Bool] {
    var dict = [String: Bool]()

    for objectTypeIdentifier in objectTypeIdentifiers {
      dict[objectTypeIdentifier.stringValue] = isObjectTypeAvailable(
        objectTypeIdentifier: objectTypeIdentifier)
    }

    return dict
  }

  func areObjectTypesAvailableAsync(objectTypeIdentifiers: [ObjectTypeIdentifier]) -> Promise<
    [String: Bool]
  > {
    return Promise.resolved(
      withResult: areObjectTypesAvailable(objectTypeIdentifiers: objectTypeIdentifiers))
  }

  func isObjectTypeAvailable(objectTypeIdentifier: ObjectTypeIdentifier) -> Bool {
    do {
      _ = try objectTypeFrom(objectTypeIdentifier: objectTypeIdentifier)
      return true
    } catch {
      return false
    }
  }

  func isObjectTypeAvailableAsync(objectTypeIdentifier: ObjectTypeIdentifier) -> Promise<Bool> {
    return Promise.resolved(
      withResult: isObjectTypeAvailable(objectTypeIdentifier: objectTypeIdentifier))
  }

  func authorizationStatusFor(
    type: ObjectTypeIdentifier
  ) throws -> AuthorizationStatus {
    let objectType = try objectTypeFrom(objectTypeIdentifier: type)

    let authStatus = store.authorizationStatus(for: objectType)

    if let authStatus = AuthorizationStatus(rawValue: Int32(authStatus.rawValue)) {
      return authStatus
    }

    throw runtimeErrorWithPrefix(
      "Got unrecognized AuthorizationStatus rawValue: \(authStatus.rawValue)")
  }

  func getRequestStatusForAuthorization(toCheck: AuthDataTypes) -> Promise<
    AuthorizationRequestStatus
  > {
    return Promise.async {
      let toShare = sampleTypesFromArray(typeIdentifiersWriteable: toCheck.toShare ?? [])
      let toRead = objectTypesFromArray(typeIdentifiers: toCheck.toRead ?? [])

      return try await withCheckedThrowingContinuation { continuation in
        if toShare.isEmpty && toRead.isEmpty {
          warnWithPrefix("Both toRead and toShare are empty, returning 'unnecessary' status")
          return continuation.resume(
            returning: .unnecessary
          )
        }
        return store.getRequestStatusForAuthorization(toShare: toShare, read: toRead) {
          status, error in
          if let error = error {
            continuation.resume(throwing: error)
          } else {
            if let authStatus = AuthorizationRequestStatus(rawValue: Int32(status.rawValue)) {
              continuation.resume(returning: authStatus)
            } else {
              continuation.resume(
                throwing: runtimeErrorWithPrefix(
                  "Unrecognized authStatus returned: \(status.rawValue)"))
            }

          }
        }
      }
    }
  }

  func requestAuthorization(toRequest: AuthDataTypes) -> Promise<Bool> {
    return Promise.async {
      let share = sampleTypesFromArray(typeIdentifiersWriteable: toRequest.toShare ?? [])
      let toRead = objectTypesFromArray(typeIdentifiers: toRequest.toRead ?? [])

      return try await withCheckedThrowingContinuation { continuation in
        store.requestAuthorization(toShare: share, read: toRead) { status, error in
          if let error = error {
            continuation.resume(throwing: error)
          } else {
            continuation.resume(returning: status)
          }
        }
      }
    }
  }

  func querySources(identifier: SampleTypeIdentifier, filter: FilterForSamples?) -> Promise<
    [HybridSourceProxySpec]
  > {
    return Promise.async {
      let sampleType = try sampleTypeFrom(sampleTypeIdentifier: identifier)
      let predicate = createPredicateForSamples(filter)

      return try await withCheckedThrowingContinuation { continuation in
        let query = HKSourceQuery(
          sampleType: sampleType,
          samplePredicate: predicate
        ) { (_: HKSourceQuery, sources: Set<HKSource>?, error: Error?) in
          if let error = error {
            continuation.resume(throwing: error)
            return
          }

          guard let sources = sources else {
            return continuation.resume(
              throwing: runtimeErrorWithPrefix(
                "Empty response for sample type \(identifier.stringValue)"))
          }

          let serializedSources = sources.map { source -> SourceProxy in

            return SourceProxy(
              source: source
            )
          }

          continuation.resume(returning: serializedSources)
        }

        store.execute(query)
      }
    }
  }

  func enableBackgroundDelivery(
    typeIdentifier: ObjectTypeIdentifier, updateFrequency: UpdateFrequency
  ) -> Promise<Bool> {
    return Promise.async {
      if let frequency = HKUpdateFrequency(rawValue: Int(updateFrequency.rawValue)) {
        let type = try objectTypeFrom(objectTypeIdentifier: typeIdentifier)
        return try await withCheckedThrowingContinuation { continuation in
          store.enableBackgroundDelivery(
            for: type,
            frequency: frequency
          ) { (success, error) in
            if let err = error {
              return continuation.resume(throwing: err)
            }
            return continuation.resume(returning: success)
          }
        }
      } else {
        throw runtimeErrorWithPrefix("Invalid update frequency rawValue: \(updateFrequency)")
      }
    }

  }

  func disableBackgroundDelivery(
    typeIdentifier: ObjectTypeIdentifier
  ) -> Promise<Bool> {
    return Promise.async {
      let type = try objectTypeFrom(objectTypeIdentifier: typeIdentifier)
      return try await withCheckedThrowingContinuation { continuation in
        store.disableBackgroundDelivery(
          for: type
        ) { (success, error) in
          if let err = error {
            return continuation.resume(throwing: err)
          }
          return continuation.resume(returning: success)
        }
      }
    }
  }

  func disableAllBackgroundDelivery() -> Promise<Bool> {
    return Promise.async {
      try await withCheckedThrowingContinuation { continuation in
        store.disableAllBackgroundDelivery(completion: { (success, error) in
          guard let err = error else {
            return continuation.resume(returning: success)
          }
          return continuation.resume(throwing: err)
        })
      }
    }
  }

  func unsubscribeQueryAsync(queryId: String) -> Promise<Bool> {
    return Promise.async {
      return try self.unsubscribeQuery(queryId: queryId)
    }
  }

  func isHealthDataAvailableAsync() -> Promise<Bool> {
    return Promise.resolved(withResult: HKHealthStore.isHealthDataAvailable())
  }

  func isProtectedDataAvailableAsync() -> Promise<Bool> {
    return Promise.resolved(withResult: UIApplication.shared.isProtectedDataAvailable)
  }

  func isHealthDataAvailable() -> Bool {
    return HKHealthStore.isHealthDataAvailable()
  }

  func isProtectedDataAvailable() -> Bool {
    return UIApplication.shared.isProtectedDataAvailable
  }

  func getPreferredUnits(identifiers: [QuantityTypeIdentifier], forceUpdate: Bool?) -> Promise<
    [IdentifierWithUnit]
  > {
    return Promise.async {
      let quantityTypes = identifiers.compactMap { identifier in
        do {
          let quantityType = try initializeQuantityType(identifier.stringValue)

          return quantityType
        } catch {
          warnWithPrefix("getPreferredUnits: \(error.localizedDescription)")
          return nil
        }
      }

      let typePerUnits = try await getPreferredUnitsInternal(
        quantityTypes: quantityTypes, forceUpdate: forceUpdate)

      let dic = typePerUnits.map { typePerUnit in
        return IdentifierWithUnit(
          typeIdentifier: typePerUnit.key.identifier,
          unit: typePerUnit.value.unitString
        )
      }

      return dic
    }
  }

  var _runningQueries: [String: HKQuery] = [:]

  func deleteObjects(objectTypeIdentifier: SampleTypeIdentifierWriteable, filter: FilterForSamples)
    -> Promise<Double> {
    return Promise.async {
      if let predicate = createPredicateForSamples(filter) {

        let of = try sampleTypeFrom(sampleTypeIdentifierWriteable: objectTypeIdentifier)
        return try await withCheckedThrowingContinuation { continuation in
          store.deleteObjects(of: of, predicate: predicate) { (_, count, error) in
            if let error = error {
              continuation.resume(throwing: error)
            } else {
              continuation.resume(returning: Double(count))
            }
          }
        }
      }
      throw runtimeErrorWithPrefix("Unable to create predicate for deleting objects")
    }

  }

  func subscribeToObserverQuery(
    typeIdentifier: SampleTypeIdentifier,
    callback: @escaping (OnChangeCallbackArgs) -> Void
  ) throws -> String {
    let sampleType = try sampleTypeFrom(sampleTypeIdentifier: typeIdentifier)

    let predicate = HKQuery.predicateForSamples(
      withStart: Date.init(),
      end: nil,
      options: HKQueryOptions.strictStartDate
    )

    let queryId = UUID().uuidString

    let query = HKObserverQuery(
      sampleType: sampleType,
      predicate: predicate
    ) {
      (_: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?)
      in

      DispatchQueue.main.async {
        callback(
          OnChangeCallbackArgs(
            typeIdentifier: typeIdentifier, errorMessage: error?.localizedDescription))
        handler()
      }

    }

    store.execute(query)

    self._runningQueries.updateValue(query, forKey: queryId)

    return queryId
  }

  func unsubscribeQuery(queryId: String) throws -> Bool {
    guard let query = self._runningQueries[queryId] else {
      warnWithPrefix("unsubscribeQuery: Query with id \(queryId) not found")

      return false
    }

    store.stop(query)

    self._runningQueries.removeValue(forKey: queryId)

    return true
  }

  func unsubscribeQueriesAsync(queryIds: [String]) -> Promise<Double> {
    return Promise.async {
      return self.unsubscribeQueries(queryIds: queryIds)
    }
  }

  func unsubscribeQueries(queryIds: [String]) -> Double {
    let successCounts = queryIds.map { queryId in
      if let query = self._runningQueries[queryId] {
        store.stop(query)

        self._runningQueries.removeValue(forKey: queryId)

        return true
      }

      warnWithPrefix("unsubscribeQueries: Query with id \(queryId) not found, skipping unsubscribe")

      return false
    }

    return Double(successCounts.filter { $0 }.count)
  }

}
