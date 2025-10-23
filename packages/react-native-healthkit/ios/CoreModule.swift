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
        let unit = HKUnit(from: unitOverride)

        if !quantityType.is(compatibleWith: unit) {
            throw RuntimeError.error(withMessage: "[react-native-healthkit] Unit \(unitOverride) is incompatible with \(quantityType.identifier)")
        }

        return unit
    }

    if let preferredUnit = try await getPreferredUnitsInternal(quantityTypes: [quantityType]).first?.value {
        return preferredUnit
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Must specify a unit for \(quantityType.identifier)")
}

func getPreferredUnitsInternal(quantityTypes: [HKQuantityType], forceUpdate: Bool? = false) async throws -> [HKQuantityType: HKUnit] {

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
    func areObjectTypesAvailable(objectTypeIdentifiers: [ObjectTypeIdentifier]) -> [String: Bool] {
        var dict = [String: Bool]()

        for objectTypeIdentifier in objectTypeIdentifiers {
            dict[objectTypeIdentifier.stringValue] = isObjectTypeAvailable(objectTypeIdentifier: objectTypeIdentifier)
        }

        return dict
    }

    func areObjectTypesAvailableAsync(objectTypeIdentifiers: [ObjectTypeIdentifier]) -> Promise<[String: Bool]> {
        return Promise.resolved(withResult: areObjectTypesAvailable(objectTypeIdentifiers: objectTypeIdentifiers))
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
        return Promise.resolved(withResult: isObjectTypeAvailable(objectTypeIdentifier: objectTypeIdentifier))
    }

    func authorizationStatusFor(
        type: ObjectTypeIdentifier
    ) throws -> AuthorizationStatus {
        let objectType = try objectTypeFrom(objectTypeIdentifier: type)

        let authStatus = store.authorizationStatus(for: objectType)

        if let authStatus = AuthorizationStatus(rawValue: Int32(authStatus.rawValue)) {
            return authStatus
        }

        throw RuntimeError.error(withMessage: "[react-native-healthkit] got unrecognized AuthorizationStatus with value \(authStatus.rawValue)")
    }

    func getRequestStatusForAuthorization(toShare: [SampleTypeIdentifierWriteable], toRead: [ObjectTypeIdentifier]) throws -> Promise<AuthorizationRequestStatus> {
        let toShare = sampleTypesFromArray(typeIdentifiersWriteable: toShare)
        let toRead = objectTypesFromArray(typeIdentifiers: toRead)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.getRequestStatusForAuthorization(toShare: toShare, read: toRead) { status, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        if let authStatus = AuthorizationRequestStatus(rawValue: Int32(status.rawValue)) {
                            continuation.resume(returning: authStatus)
                        } else {
                            continuation.resume(throwing: RuntimeError.error(withMessage: "Unrecognized authStatus returned: \(status.rawValue)"))
                        }

                    }
                }
            }
        }
    }

    func requestAuthorization(toShare: [SampleTypeIdentifierWriteable], toRead: [ObjectTypeIdentifier]) throws -> Promise<Bool> {
        let share = sampleTypesFromArray(typeIdentifiersWriteable: toShare)
        let toRead = objectTypesFromArray(typeIdentifiers: toRead)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
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

    func querySources(identifier: SampleTypeIdentifier) throws -> Promise<[HybridSourceProxySpec]> {
        let sampleType = try sampleTypeFrom(sampleTypeIdentifier: identifier)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSourceQuery(
                    sampleType: sampleType,
                    samplePredicate: nil
                ) { (_: HKSourceQuery, sources: Set<HKSource>?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }

                    guard let sources = sources else {
                      return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response for sample type \(identifier.stringValue)"))
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

    func enableBackgroundDelivery(typeIdentifier: ObjectTypeIdentifier, updateFrequency: UpdateFrequency) throws -> Promise<Bool> {
        if let frequency = HKUpdateFrequency(rawValue: Int(updateFrequency.rawValue)) {
            let type = try objectTypeFrom(objectTypeIdentifier: typeIdentifier)
            return Promise.async {
                try await withCheckedThrowingContinuation { continuation in
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
            }
        } else {
            throw RuntimeError.error(withMessage: "Invalid update frequency value: \(updateFrequency)")
        }
    }

    func disableBackgroundDelivery(
        typeIdentifier: ObjectTypeIdentifier
    ) throws -> Promise<Bool> {
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

    func disableAllBackgroundDelivery() throws -> Promise<Bool> {
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

    func unsubscribeQueryAsync(queryId: String) throws -> Promise<Bool> {
        let result = try self.unsubscribeQuery(queryId: queryId)

        return Promise.resolved(withResult: result)
    }

    func isHealthDataAvailableAsync() -> Promise<Bool> {
        return Promise.resolved(withResult: HKHealthStore.isHealthDataAvailable())
    }

    func isProtectedDataAvailableAsync() -> Promise<Bool> {
        return Promise.resolved(withResult: UIApplication.shared.isProtectedDataAvailable)
    }

    func isHealthDataAvailable() throws -> Bool {
        return HKHealthStore.isHealthDataAvailable()
    }

    func isProtectedDataAvailable() throws -> Bool {
        return UIApplication.shared.isProtectedDataAvailable
    }

    func getPreferredUnits(identifiers: [QuantityTypeIdentifier], forceUpdate: Bool?) throws -> Promise<[IdentifierWithUnit]> {
        return Promise.async {

            let quantityTypes = identifiers.compactMap { identifier in
                do {
                    let quantityType = try initializeQuantityType(identifier.stringValue)

                    return quantityType
                } catch {
                    print(error.localizedDescription)
                    return nil
                }
            }

            let typePerUnits = try await getPreferredUnitsInternal(quantityTypes: quantityTypes, forceUpdate: forceUpdate)

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

    func deleteObjects(objectTypeIdentifier: ObjectTypeIdentifier, filter: FilterForSamples) throws -> Promise<Double> {
        let predicate = try createPredicateForSamples(filter: filter)
        let of = try objectTypeFrom(objectTypeIdentifier: objectTypeIdentifier)

        return Promise.async {
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
                callback(OnChangeCallbackArgs(typeIdentifier: typeIdentifier, errorMessage: error?.localizedDescription))
                handler()
            }

        }

        store.execute(query)

        self._runningQueries.updateValue(query, forKey: queryId)

        return queryId
    }

    func unsubscribeQuery(queryId: String) throws -> Bool {
        guard let query = self._runningQueries[queryId] else {
            throw RuntimeError.error(withMessage: "Query with id \(queryId) not found")
        }

        store.stop(query)

        self._runningQueries.removeValue(forKey: queryId)

        return true
    }

    func unsubscribeQueriesAsync(queryIds: [String]) throws -> Promise<Double> {
        let successCount = self.unsubscribeQueries(queryIds: queryIds)

        return Promise.resolved(withResult: successCount)
    }

    func unsubscribeQueries(queryIds: [String]) -> Double {
        let successCounts = queryIds.map { queryId in
            if let query = self._runningQueries[queryId] {
                store.stop(query)

                self._runningQueries.removeValue(forKey: queryId)

                return true
            }

            print("Query with id \(queryId) not found, skipping unsubscribe")

            return false
        }

        return Double(successCounts.filter { $0 }.count)
    }

}
