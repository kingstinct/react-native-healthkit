import HealthKit
import NitroModules

func serializeCorrelationSample(correlation: HKCorrelation, unitMap: [HKQuantityType: HKUnit]) -> CorrelationSample {
  let objects = correlation.objects.compactMap { object -> CorrelationObject? in
    if let quantitySample = object as? HKQuantitySample,
       let unit = unitMap[quantitySample.quantityType] {
      do {
        let quantitySample = try serializeQuantitySample(
          sample: quantitySample,
          unit: unit
        )
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

func getUnitMap(correlations: [HKCorrelation]) async throws -> [HKQuantityType: HKUnit] {
  // Collect all quantity types to get preferred units
  var quantityTypes = Set<HKQuantityType>()
  for correlation in correlations {
    for object in correlation.objects {
      if let quantitySample = object as? HKQuantitySample {
        quantityTypes.insert(quantitySample.quantityType)
      }
    }
  }

  let unitMap = try await getPreferredUnitsInternal(quantityTypes: Array(quantityTypes))

  return unitMap
}

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

  /*
    the previous implementation use a specific function for correlationSamples that didn't really fit the use case
   func queryCorrelationSamples(
    typeIdentifier: CorrelationTypeIdentifier,
    options: QueryOptionsWithSortOrder?,
  ) throws -> Promise<[CorrelationSample]> {
    let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)
    let predicate = try createPredicate(filter: options?.filter)
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
          
          Task {
            do {
              let unitMap = try await getUnitMap(correlations: correlations)
              
              let serializedCorrelations = correlations.map { correlation -> CorrelationSample in
                return serializeCorrelationSample(correlation: correlation, unitMap: unitMap)
              }
              
              continuation.resume(returning: serializedCorrelations)
            } catch {
              continuation.resume(throwing: error)
            }
          }
          
        }
        
        store.execute(query)
      }
    }
  }*/

  func queryCorrelationSamples(typeIdentifier: CorrelationTypeIdentifier, options: QueryOptionsWithSortOrder?) throws -> Promise<[CorrelationSample]> {
    let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)
    let predicate = try createPredicate(filter: options?.filter)
    let limit = getQueryLimit(options?.limit)

    return Promise.async {
      return try await withCheckedThrowingContinuation { continuation in
        let q = HKSampleQuery(
          sampleType: correlationType,
          predicate: predicate,
          limit: limit,
          sortDescriptors: getSortDescriptors(ascending: options?.ascending)
        ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
          if let err = error {
            return continuation.resume(throwing: err)
          }

          if let correlationSamples = samples?.compactMap({ sample in
            return sample as? HKCorrelation
          }) {
            Task {
              do {
                let unitMap = try await getUnitMap(correlations: correlationSamples)
                let returnValue = correlationSamples.map { correlation in
                  let serialized = serializeCorrelationSample(correlation: correlation, unitMap: unitMap)

                  return serialized
                }

                return continuation.resume(returning: returnValue)
              } catch {
                return continuation.resume(throwing: error)
              }
            }
          } else {
            return continuation.resume(throwing: RuntimeError.error(withMessage: "[react-native-healthkit] Unexpected empty response"))
          }
        }

        store.execute(q)
      }
    }
  }
}
