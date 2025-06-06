import HealthKit
import NitroModules

class CorrelationTypeModule : HybridCorrelationTypeModuleSpec {
    func saveCorrelationSample(
        typeIdentifier: CorrelationTypeIdentifier,
        samples: [SampleForSaving],
        start: Date,
        end: Date,
        metadata: AnyMapHolder
    ) throws -> Promise<Bool> {
        let identifier = HKCorrelationTypeIdentifier(rawValue: typeIdentifier.stringValue)
        
        guard let type = HKObjectType.correlationType(forIdentifier: identifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize correlation type with identifier \(typeIdentifier)")
        }
        
        var initializedSamples = Set<HKSample>()
        
        for sample in samples {
            if let quantitySample = sample as? QuantitySampleForSaving {
                let quantityTypeId = HKQuantityTypeIdentifier(rawValue: quantitySample.quantityType.stringValue)
                guard let quantityType = HKSampleType.quantityType(forIdentifier: quantityTypeId) else {
                    continue
                }
                
                let unit = HKUnit(from: quantitySample.unit)
                let quantity = HKQuantity(unit: unit, doubleValue: quantitySample.quantity)
                let hkQuantitySample = HKQuantitySample(
                    type: quantityType,
                    quantity: quantity,
                    start: start,
                    end: end,
                    metadata: anyMapToDictionary(quantitySample.metadata)
                )
                initializedSamples.insert(hkQuantitySample)
                
            } else if let categorySample = sample as? CategorySampleForSaving {
                let categoryTypeId = HKCategoryTypeIdentifier(rawValue: categorySample.categoryType.stringValue)
                guard let categoryType = HKSampleType.categoryType(forIdentifier: categoryTypeId) else {
                    continue
                }
                
                let hkCategorySample = HKCategorySample(
                    type: categoryType,
                    value: Int(categorySample.value),
                    start: categorySample.start,
                    end: categorySample.end,
                    metadata: anyMapToDictionary(categorySample.metadata)
                )
                initializedSamples.insert(hkCategorySample)
            }
        }
        
        let correlation = HKCorrelation(
            type: type,
            start: start,
            end: end,
            objects: initializedSamples,
            metadata: anyMapToDictionary(metadata)
        )
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.save(correlation) { (success: Bool, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: success)
                    }
                }
            }
        }
    }
    
    func queryCorrelationSamples(
        typeIdentifier: CorrelationTypeIdentifier,
        from: Date,
        to: Date
    ) throws -> Promise<[CorrelationSample]> {
        let identifier = HKCorrelationTypeIdentifier(rawValue: typeIdentifier.stringValue)
        
        guard let sampleType = HKSampleType.correlationType(forIdentifier: identifier) else {
            throw RuntimeError.error(withMessage: "Failed to initialize correlation type with identifier \(typeIdentifier)")
        }
    
        let predicate = createPredicate(from: from, to: to)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKCorrelationQuery(
                    type: sampleType,
                    predicate: predicate,
                    samplePredicates: nil
                ) { (_: HKCorrelationQuery, correlations: [HKCorrelation]?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }
                    
                    guard let correlations = correlations else {
                        continuation.resume(returning: [])
                        return
                    }
                    
                    // Collect all quantity types to get preferred units
                    var quantityTypes = Set<HKQuantityType>()
                    for correlation in correlations {
                        for object in correlation.objects {
                            if let quantitySample = object as? HKQuantitySample {
                                quantityTypes.insert(quantitySample.quantityType)
                            }
                        }
                    }
                    
                    store.preferredUnits(for: quantityTypes) { (unitMap: [HKQuantityType: HKUnit], error: Error?) in
                        if let error = error {
                            continuation.resume(throwing: error)
                            return
                        }
                        
                        let serializedCorrelations = correlations.map { correlation -> CorrelationSample in
                            let objects = correlation.objects.compactMap { object -> CorrelationObject? in
                                if let quantitySample = object as? HKQuantitySample,
                                   let unit = unitMap[quantitySample.quantityType] {
                                    return CorrelationObject.second(serializeQuantitySample(sample: quantitySample, unit: unit))
                                } else if let categorySample = object as? HKCategorySample {
                                    return CorrelationObject.first(serializeCategorySample(sample: categorySample))
                                }
                                return nil
                            }
                            
                            return CorrelationSample(
                                correlationType: CorrelationTypeIdentifier(fromString: correlation.correlationType.identifier)!,
                                objects: objects,
                                metadata: serializeMetadata(correlation.metadata),
                                start: correlation.startDate,
                                end: correlation.endDate
                            )
                        }
                        
                        continuation.resume(returning: serializedCorrelations)
                    }
                }
                
                store.execute(query)
            }
        }
    }
}
