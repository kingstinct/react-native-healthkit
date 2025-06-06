import HealthKit
import NitroModules
//
//  Core.swift
//  Pods
//
//  Created by Robert Herber on 2025-05-28.
//

var store = HKHealthStore.init()

var quantityTypeUnitCache = Dictionary<HKQuantityType, HKUnit>()

func getUnitToUse(unitOverride: String?, unitIdentifier: QuantityTypeIdentifier) async throws -> HKUnit {
    if let unitOverride = unitOverride {
        return HKUnit(from: unitOverride)
    }
    
    return try await getPreferredUnitsInternal(identifiers: [unitIdentifier]).first?.value ?? HKUnit.count()
}

func getPreferredUnitsInternal(identifiers: [QuantityTypeIdentifier], forceUpdate: Bool? = false) async throws -> [HKQuantityType: HKUnit] {
    
    let quantityTypes = identifiers.compactMap { identifier in
        let hkIdentifier = HKQuantityTypeIdentifier.init(rawValue: identifier.stringValue)
        return HKSampleType.quantityType(forIdentifier: hkIdentifier)
    }
    
    if(forceUpdate != true){
        let itemsInCache = quantityTypeUnitCache.filter { (quantityType: HKQuantityType, unit: HKUnit) in
            return quantityTypes.contains(where: { $0 == quantityType })
        }
        if(itemsInCache.count == quantityTypes.count){
            return itemsInCache
        }
    }
    
    
    return try await withCheckedThrowingContinuation { continuation in
        store.preferredUnits(for: Set(quantityTypes)) {
            (typePerUnits: [HKQuantityType: HKUnit], error: Error?) in
            if let error = error {
                return continuation.resume(throwing: error)
            }
            
            typePerUnits.forEach { (type: HKQuantityType, unit: HKUnit) in
                quantityTypeUnitCache.updateValue(unit, forKey: type)
            }
            
            return continuation.resume(returning: typePerUnits)
        }
    }
}

class CoreModule : HybridCoreModuleSpec {
    
    
    func authorizationStatusFor(
        type: SampleTypeIdentifier
    ) throws -> AuthorizationStatus {
        guard let objectType = objectTypeFromString(typeIdentifier: type.stringValue) else {
            throw RuntimeError.error(withMessage: "Failed to initialize type with identifier \(type)")
        }
        
        let authStatus = store.authorizationStatus(for: objectType)
        
        if let authStatus = AuthorizationStatus(rawValue: Int32(authStatus.rawValue)){
            return authStatus
        }
        
        throw RuntimeError.error(withMessage: "Failed to recognize AuthorizationStatus with value \(authStatus.rawValue)")
    }
    
    func getRequestStatusForAuthorization(write: [SampleTypeIdentifier], read: [SampleTypeIdentifier]) throws -> Promise<AuthorizationRequestStatus> {
        let share = sampleTypesFromArray(typeIdentifiers: write)
        let toRead = objectTypesFromArray(typeIdentifiers: read)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.getRequestStatusForAuthorization(toShare: share, read: toRead) { status, error in
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
    
    func requestAuthorization(write: [SampleTypeIdentifier], read: [SampleTypeIdentifier]) throws -> Promise<Bool> {
        let share = sampleTypesFromArray(typeIdentifiers: write)
        let toRead = objectTypesFromArray(typeIdentifiers: read)
        
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
    
    func querySources(identifier: SampleTypeIdentifier) throws -> Promise<[Source]> {
        guard let type = objectTypeFromString(typeIdentifier: identifier.stringValue) else {
            throw RuntimeError.error(withMessage: "Failed to initialize type with identifier \(identifier)")
        }
        
        guard let sampleType = type as? HKSampleType else {
            throw RuntimeError.error(withMessage: "Type \(identifier) is not a sample type")
        }
        
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
                        continuation.resume(returning: [])
                        return
                    }
                    
                    let serializedSources = sources.map { source -> Source in
                        return Source(
                            name: source.name,
                            bundleIdentifier: source.bundleIdentifier
                        )
                    }
                    
                    continuation.resume(returning: serializedSources)
                }
                
                store.execute(query)
            }
        }
    }
    
    func enableBackgroundDelivery(typeIdentifier: String, updateFrequency: Double) throws -> Promise<Bool> {
        if let frequency = HKUpdateFrequency(rawValue: Int(updateFrequency)) {
            return Promise.async {
                try await withCheckedThrowingContinuation { continuation in
                    store.enableBackgroundDelivery(
                        for: objectTypeFromString(typeIdentifier: typeIdentifier)!,
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
    
    func disableBackgroundDelivery(typeIdentifier: String) throws -> Promise<Bool> {
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.disableBackgroundDelivery(
                    for: objectTypeFromString(typeIdentifier: typeIdentifier)!
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
            
            let typePerUnits = try await getPreferredUnitsInternal(identifiers: identifiers, forceUpdate: forceUpdate)
            
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
    
    func subscribeToObserverQuery(typeIdentifier: String, callback: @escaping (OnChangeCallbackArgs) -> Void) throws -> String {
        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize " + typeIdentifier)
        }
        
        let predicate = HKQuery.predicateForSamples(
            withStart: Date.init(),
            end: nil,
            options: HKQueryOptions.strictStartDate
        )
        
        let queryId = UUID().uuidString
        
        func responder(
            query: HKObserverQuery,
            handler: @escaping HKObserverQueryCompletionHandler,
            error: Error?
        ) {
            if error == nil {
                DispatchQueue.main.async {
                    callback(OnChangeCallbackArgs(typeIdentifier: typeIdentifier, errorMessage: error?.localizedDescription))
                    handler()
                }
            }
        }
        
        let query = HKObserverQuery(
            sampleType: sampleType,
            predicate: predicate
        ) {
            (query: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?)
            in
            
            return responder(query: query, handler: handler, error: error)
            
        }
        
        store.execute(query)
        
        self._runningQueries.updateValue(query, forKey: queryId)
        
        //resolve(queryId)
        
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
}
