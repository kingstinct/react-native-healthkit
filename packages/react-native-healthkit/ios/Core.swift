import HealthKit
import NitroModules
//
//  Core.swift
//  Pods
//
//  Created by Robert Herber on 2025-05-28.
//

class Core : HybridCoreSpec {
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
    
    func getPreferredUnits(identifiers: [String]) throws -> Promise<[IdentifierWithUnit]> {
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                var quantityTypes = Set<HKQuantityType>()
                    for identifierString in identifiers {
                      let identifier = HKQuantityTypeIdentifier.init(rawValue: identifierString)
                      let type = HKSampleType.quantityType(forIdentifier: identifier)
                      if type != nil {
                        quantityTypes.insert(type!)
                      }
                    }

                    store.preferredUnits(for: quantityTypes) {
                      (typePerUnits: [HKQuantityType: HKUnit], error: Error?) in
                        
                        if let error = error {
                            return continuation.resume(throwing: error)
                        }
                        
                        let dic = typePerUnits.map { typePerUnit in
                            return IdentifierWithUnit(
                                typeIdentifier: typePerUnit.key.identifier,
                                unit: typePerUnit.value.unitString
                            )
                        }

                      return continuation.resume(returning: dic)
                    }
                    
                }
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
              /*if self.bridge != nil && self.bridge.isValid {
                self.sendEvent(
                  withName: "onChange",
                  body: [
                    "typeIdentifier": typeIdentifier
                  ])
              }*/

            }
            handler()
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
