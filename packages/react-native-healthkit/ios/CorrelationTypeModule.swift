import HealthKit
import NitroModules

class CorrelationTypeModule: HybridCorrelationTypeModuleSpec {
    func saveCorrelationSample(
        typeIdentifier: CorrelationTypeIdentifier,
        samples: [SampleForSaving],
        start: Date,
        end: Date,
        metadata: AnyMap
    ) throws -> Promise<Bool> {
        let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)

        var initializedSamples = Set<HKSample>()

        for sample in samples {
            switch sample {
            case .second(let quantitySample):
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

            case .first(let categorySample):
                let categoryType = try initializeCategoryType(categorySample.categoryType.stringValue)

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

      if initializedSamples.isEmpty {
          throw RuntimeError.error(withMessage: "[react-native-healthkit] No valid samples to create correlation sample")
      }

        let correlation = HKCorrelation(
            type: correlationType,
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
        let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)
        let predicate = try createPredicate(
          filter: Variant_PredicateWithUUID_PredicateWithUUIDs_PredicateWithMetadataKey_PredicateWithStartAndEnd_PredicateFromWorkout_FilterForSamplesAnd_FilterForSamplesOr.fourth(
            PredicateWithStartAndEnd(
            startDate: from,
            endDate: to,
            strictEndDate: true,
            strictStartDate: true
            )
          )
        )

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKCorrelationQuery(
                    type: correlationType,
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
                                    do {
                                        let quantitySample = try serializeQuantitySample(sample: quantitySample, unit: unit)
                                        return CorrelationObject.second(quantitySample)
                                    } catch {
                                        print(error.localizedDescription)
                                    }

                                } else if let categorySample = object as? HKCategorySample {
                                    return CorrelationObject.first(serializeCategorySample(sample: categorySample))
                                }
                                return nil
                            }

                            return CorrelationSample(
                                uuid: correlation.uuid.uuidString,
                                correlationType: CorrelationTypeIdentifier(fromString: correlation.correlationType.identifier)!,
                                objects: objects,
                                metadata: serializeMetadata(correlation.metadata),
                                startDate: correlation.startDate,
                                endDate: correlation.endDate
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
