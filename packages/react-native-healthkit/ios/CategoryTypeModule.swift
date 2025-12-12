import HealthKit
import NitroModules

class CategoryTypeModule: HybridCategoryTypeModuleSpec {
    func saveCategorySample(
        identifier: CategoryTypeIdentifier,
        value: Double,
        startDate: Date,
        endDate: Date,
        metadata: AnyMap
    ) -> Promise<CategorySample> {
        return Promise.async {
          let type = try initializeCategoryType(identifier.stringValue)

          let sample = HKCategorySample(
              type: type,
              value: Int(value),
              start: startDate,
              end: endDate,
              metadata: anyMapToDictionary(metadata)
          )

          let succeeded = try await saveAsync(sample: sample)

          return succeeded ? serializeCategorySample(sample: sample) : nil
        }
    }

    func queryCategorySamples(
        identifier: CategoryTypeIdentifier,
        options: QueryOptionsWithSortOrder
    ) -> Promise<[CategorySample]> {
        return Promise.async {
          let sampleType = try initializeCategoryType(identifier.stringValue)
          let predicate = createPredicateForSamples(options.filter)
          let sortDescriptors = getSortDescriptors(ascending: options.ascending)

          let samples = try await sampleQueryAsync(
            sampleType: sampleType,
            limit: options.limit,
            predicate: predicate,
            sortDescriptors: sortDescriptors
          )

          return samples.compactMap { sample -> CategorySample? in
              guard let categorySample = sample as? HKCategorySample else { return nil }
              return serializeCategorySample(sample: categorySample)
          }
        }
    }

    func queryCategorySamplesWithAnchor(
        identifier: CategoryTypeIdentifier,
        options: QueryOptionsWithAnchor
    ) -> Promise<CategorySamplesWithAnchorResponse> {
        return Promise.async {
          let sampleType = try initializeCategoryType(identifier.stringValue)
          let predicate = createPredicateForSamples(options.filter)

          let response = try await sampleAnchoredQueryAsync(
            sampleType: sampleType,
            limit: options.limit,
            queryAnchor: options.anchor,
            predicate: predicate
          )

          let categorySamples = response.samples.compactMap { sample -> CategorySample? in
              guard let categorySample = sample as? HKCategorySample else { return nil }
              return serializeCategorySample(sample: categorySample)
          }

          return CategorySamplesWithAnchorResponse(
              samples: categorySamples,
              deletedSamples: response.deletedSamples,
              newAnchor: response.newAnchor
          )
        }
    }
}
