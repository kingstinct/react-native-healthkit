import HealthKit
import NitroModules
//
//  Core.swift
//  Pods
//
//  Created by Robert Herber on 2025-05-28.
//

class Core : HybridCoreSpec {
    func isHealthDataAvailable() throws -> Bool {
        return HKHealthStore.isHealthDataAvailable()
    }
    
    func isProtectedDataAvailable() throws -> Bool {
        return UIApplication.shared.isProtectedDataAvailable
    }
    
    func getPreferredUnits(identifiers: [QuantityTypeIdentifier]) throws -> Promise<Dictionary<String, String>> {
        return Promise.resolved(withResult: [:])
    }
    
    func addListener(callback: @escaping (OnChangeCallbackArgs) -> Void) throws -> EmitterSubscription {
        return EmitterSubscription()
    }
    
    func subscribeToObserverQuery(identifier: String) throws -> Promise<String> {
        return Promise.resolved(withResult: "")
    }
    
    func unsubscribeQuery(queryId: String) throws -> NitroModulesPromise<Bool> {
        return Promise.resolved(withResult: false)
    }
    
    
}
