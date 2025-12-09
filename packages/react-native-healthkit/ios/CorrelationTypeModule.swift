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
  func queryCorrelationSamplesWithAnchor(typeIdentifier: CorrelationTypeIdentifier, options: QueryOptionsWithAnchor) -> Promise<QueryCorrelationSamplesWithAnchorResponse> {
    return Promise.async {
      let predicate = createPredicateForSamples(options.filter)
      let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)

      let response = try await sampleAnchoredQueryAsync(
        sampleType: correlationType,
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      let correlationSamples = response.samples.compactMap { sample in
        return sample as? HKCorrelation
      }

      let unitMap = try await getUnitMap(correlations: correlationSamples)

      return QueryCorrelationSamplesWithAnchorResponse(
        correlations: correlationSamples.map { sample in
          return serializeCorrelationSample(correlation: sample, unitMap: unitMap)
        },
        deletedSamples: response.deletedSamples,
        newAnchor: response.newAnchor
      )

    }
  }

  func saveCorrelationSample(
    typeIdentifier: CorrelationTypeIdentifier,
    samples: [SampleForSaving],
    start: Date,
    end: Date,
    metadata: AnyMap
  ) -> Promise<Bool> {
    return Promise.async {
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

      return try await saveAsync(sample: correlation)
    }
  }

  func queryCorrelationSamples(typeIdentifier: CorrelationTypeIdentifier, options: QueryOptionsWithSortOrder) -> Promise<[CorrelationSample]> {
    return Promise.async {
      let correlationType = try initializeCorrelationType(typeIdentifier.stringValue)

      let samples = try await sampleQueryAsync(
        sampleType: correlationType,
        limit: options.limit,
        predicate: createPredicateForSamples(options.filter),
        sortDescriptors: getSortDescriptors(ascending: options.ascending)
      )

      let correlationSamples = samples.compactMap({ sample in
        return sample as? HKCorrelation
      })

      let unitMap = try await getUnitMap(correlations: correlationSamples)

      return correlationSamples.map { correlation in
        let serialized = serializeCorrelationSample(correlation: correlation, unitMap: unitMap)

        return serialized
      }
    }
  }
}
