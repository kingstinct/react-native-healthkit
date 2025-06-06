import HealthKit
import NitroModules

class CategoryTypeModule : HybridCategoryTypeModuleSpec {
    func saveCategorySample(
        identifier: CategoryTypeIdentifier,
        value: Double,
        start: Date,
        end: Date,
        metadata: AnyMapHolder
    ) throws -> Promise<Bool> {
        let identifier = HKCategoryTypeIdentifier(rawValue: identifier.stringValue)
        
        guard let type = HKObjectType.categoryType(forIdentifier: identifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize category type with identifier \(identifier)")
        }
        
        let sample = HKCategorySample(
            type: type,
            value: Int(value),
            start: start,
            end: end,
            metadata: anyMapToDictionary(metadata)
        )
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.save(sample) { (success: Bool, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: success)
                    }
                }
            }
        }
    }
    
    func queryCategorySamples(
        identifier: CategoryTypeIdentifier,
        options: QueryOptionsWithSortOrder?,
    ) throws -> Promise<[CategorySample]> {
        let identifier = HKCategoryTypeIdentifier(rawValue: identifier.stringValue)
        
        guard let sampleType = HKSampleType.categoryType(forIdentifier: identifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize category type with identifier \(identifier)")
        }
        
        let predicate = createPredicate(from: options?.from, to: options?.to)
        let queryLimit = getQueryLimit(options?.limit)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSampleQuery(
                    sampleType: sampleType,
                    predicate: predicate,
                    limit: queryLimit,
                    sortDescriptors: getSortDescriptors(ascending: options?.ascending)
                ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }
                    
                    guard let samples = samples else {
                        continuation.resume(returning: [])
                        return
                    }
                    
                    let categorySamples = samples.compactMap { sample -> CategorySample? in
                        guard let categorySample = sample as? HKCategorySample else { return nil }
                        return serializeCategorySample(sample: categorySample)
                    }
                    
                    continuation.resume(returning: categorySamples)
                }
                
                store.execute(query)
            }
        }
    }
    
    func queryCategorySamplesWithAnchor(
        identifier: CategoryTypeIdentifier,
        options: QueryOptionsWithAnchor
    ) throws -> Promise<QueryCategorySamplesResponseRaw> {
        let identifier = HKCategoryTypeIdentifier(rawValue: identifier.stringValue)
        
        guard let sampleType = HKSampleType.categoryType(forIdentifier: identifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize category type with identifier \(identifier)")
        }
        
        let predicate = createPredicate(from: options.from, to: options.to)
        let queryLimit = getQueryLimit(options.limit)
        let queryAnchor = deserializeHKQueryAnchor(base64String: options.anchor)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKAnchoredObjectQuery(
                    type: sampleType,
                    predicate: predicate,
                    anchor: queryAnchor,
                    limit: queryLimit
                ) { (_: HKAnchoredObjectQuery, samples: [HKSample]?, deletedSamples: [HKDeletedObject]?, newAnchor: HKQueryAnchor?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }
                    
                    guard let samples = samples else {
                        let response = QueryCategorySamplesResponseRaw(
                            samples: [],
                            deletedSamples: deletedSamples?.map { serializeDeletedSample(sample: $0) } ?? [],
                            newAnchor: serializeAnchor(anchor: newAnchor) ?? ""
                        )
                        continuation.resume(returning: response)
                        return
                    }
                    
                    let categorySamples = samples.compactMap { sample -> CategorySample? in
                        guard let categorySample = sample as? HKCategorySample else { return nil }
                        return serializeCategorySample(sample: categorySample)
                    }
                    
                    let response = QueryCategorySamplesResponseRaw(
                        samples: categorySamples,
                        deletedSamples: deletedSamples?.map { serializeDeletedSample(sample: $0) } ?? [],
                        newAnchor: serializeAnchor(anchor: newAnchor) ?? ""
                    )
                    
                    continuation.resume(returning: response)
                }
                
                store.execute(query)
            }
        }
    }
}
