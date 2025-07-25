import HealthKit
import NitroModules

class CategoryTypeModule: HybridCategoryTypeModuleSpec {
    func saveCategorySample(
        identifier: CategoryTypeIdentifier,
        value: Double,
        startDate: Date,
        endDate: Date,
        metadata: AnyMap
    ) throws -> Promise<Bool> {
        let type = try initializeCategoryType(identifier.stringValue)

        let sample = HKCategorySample(
            type: type,
            value: Int(value),
            start: startDate,
            end: endDate,
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
        options: QueryOptionsWithSortOrder?
    ) throws -> Promise<[CategorySample]> {
        let sampleType = try initializeCategoryType(identifier.stringValue)
        let predicate = try createPredicate(filter: options?.filter)
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
    ) throws -> Promise<CategorySamplesWithAnchorResponse> {
        let sampleType = try initializeCategoryType(identifier.stringValue)

        let predicate = try createPredicate(filter: options.filter)
        let queryLimit = getQueryLimit(options.limit)
        let queryAnchor = try deserializeHKQueryAnchor(base64String: options.anchor)

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
                        let response = CategorySamplesWithAnchorResponse(
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

                    let response = CategorySamplesWithAnchorResponse(
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
