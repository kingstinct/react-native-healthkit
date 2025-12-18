import HealthKit
import NitroModules

func emptyStatisticsResponse(from: Date, to: Date) -> QueryStatisticsResponse {
  var response = QueryStatisticsResponse()

  response.startDate = from
  response.endDate = to

  return response
}

func queryStatisticsForQuantityInternal(
  quantityType: HKQuantityType,
  statistics: [StatisticsOptions],
  options: StatisticsQueryOptions?
) async throws -> HKStatistics {
  let predicate = createPredicateForSamples(options?.filter)

  return try await withCheckedThrowingContinuation { continuation in
    let query = HKStatisticsQuery.init(
      quantityType: quantityType,
      quantitySamplePredicate: predicate,
      options: buildStatisticsOptions(statistics: statistics)
    ) { (_, stats: HKStatistics?, error: Error?) in
      DispatchQueue.main.async {
        if let error = error {
          return continuation.resume(throwing: error)
        }

        if let stats = stats {
          return continuation.resume(returning: stats)
        } else {
          return continuation.resume(
            throwing: runtimeErrorWithPrefix(
              "queryStatisticsForQuantityInternal: unexpected empty response"))
        }

      }
    }

    store.execute(query)
  }
}

func serializeStatistics(gottenStats: HKStatistics, unit: HKUnit) -> QueryStatisticsResponse {
  var response = QueryStatisticsResponse()

  response.startDate = gottenStats.startDate
  response.endDate = gottenStats.endDate

  if let averageQuantity = gottenStats.averageQuantity() {
    response.averageQuantity = Quantity(
      unit: unit.unitString,
      quantity: averageQuantity.doubleValue(for: unit)
    )
  }
  if let maximumQuantity = gottenStats.maximumQuantity() {
    response.maximumQuantity = Quantity(
      unit: unit.unitString,
      quantity: maximumQuantity.doubleValue(for: unit)
    )
  }
  if let minimumQuantity = gottenStats.minimumQuantity() {
    response.minimumQuantity = Quantity(
      unit: unit.unitString,
      quantity: minimumQuantity.doubleValue(for: unit)
    )
  }
  if let sumQuantity = gottenStats.sumQuantity() {
    response.sumQuantity = Quantity(
      unit: unit.unitString,
      quantity: sumQuantity.doubleValue(for: unit)
    )
  }

  if #available(iOS 12, *) {
    if let mostRecent = gottenStats.mostRecentQuantity() {
      response.mostRecentQuantity = Quantity(
        unit: unit.unitString,
        quantity: mostRecent.doubleValue(for: unit)
      )
    }

    if let mostRecentDateInterval = gottenStats.mostRecentQuantityDateInterval() {
      response.mostRecentQuantityDateInterval = QuantityDateInterval(
        from: mostRecentDateInterval.start,
        to: mostRecentDateInterval.end
      )
    }
  }

  if #available(iOS 13, *) {
    if let duration = gottenStats.duration() {
      let durationUnit = HKUnit.second()
      response.duration = Quantity(
        unit: durationUnit.unitString,
        quantity: duration.doubleValue(for: durationUnit)
      )
    }
  }

  return response
}

func queryStatisticsCollectionForQuantityInternal(
  quantityType: HKQuantityType,
  statistics: [StatisticsOptions],
  anchorDate: Date,
  intervalComponents: IntervalComponents,
  options: StatisticsQueryOptions?
) async throws -> HKStatisticsCollection {
  let predicate = createPredicateForSamples(options?.filter)

  // Create date components from interval
  var dateComponents = DateComponents()
  if let minute = intervalComponents.minute {
    dateComponents.minute = Int(minute)
  }
  if let hour = intervalComponents.hour {
    dateComponents.hour = Int(hour)
  }
  if let day = intervalComponents.day {
    dateComponents.day = Int(day)
  }
  if let month = intervalComponents.month {
    dateComponents.month = Int(month)
  }
  if let year = intervalComponents.year {
    dateComponents.year = Int(year)
  }

  // Build statistics options
  let opts = buildStatisticsOptions(statistics: statistics)

  let unit = try await getUnitToUse(unitOverride: options?.unit, quantityType: quantityType)

  return try await withCheckedThrowingContinuation { continuation in
    let query = HKStatisticsCollectionQuery.init(
      quantityType: quantityType,
      quantitySamplePredicate: predicate,
      options: opts,
      anchorDate: anchorDate,
      intervalComponents: dateComponents
    )

    query.initialResultsHandler = { (_, results: HKStatisticsCollection?, error: Error?) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      guard let statistics = results else {
        return continuation.resume(throwing: runtimeErrorWithPrefix("queryStatisticsCollectionForQuantityInternal: unexpected empty results"))
      }

      return continuation.resume(returning: statistics)
    }

    store.execute(query)
  }
}

func serializeStatisticsPerSource(gottenStats: HKStatistics, unit: HKUnit)
  -> [QueryStatisticsResponseFromSingleSource] {
  if let sources = gottenStats.sources {
    return sources.map { source in
      var response = QueryStatisticsResponseFromSingleSource()

      response.startDate = gottenStats.startDate
      response.endDate = gottenStats.endDate

      if let averageQuantity = gottenStats.averageQuantity(for: source) {
        response.averageQuantity = Quantity(
          unit: unit.unitString,
          quantity: averageQuantity.doubleValue(for: unit)
        )
      }
      if let maximumQuantity = gottenStats.maximumQuantity(for: source) {
        response.maximumQuantity = Quantity(
          unit: unit.unitString,
          quantity: maximumQuantity.doubleValue(for: unit)
        )
      }
      if let minimumQuantity = gottenStats.minimumQuantity(for: source) {
        response.minimumQuantity = Quantity(
          unit: unit.unitString,
          quantity: minimumQuantity.doubleValue(for: unit)
        )
      }
      if let sumQuantity = gottenStats.sumQuantity(for: source) {
        response.sumQuantity = Quantity(
          unit: unit.unitString,
          quantity: sumQuantity.doubleValue(for: unit)
        )
      }

      if #available(iOS 12, *) {
        if let mostRecent = gottenStats.mostRecentQuantity(for: source) {
          response.mostRecentQuantity = Quantity(
            unit: unit.unitString,
            quantity: mostRecent.doubleValue(for: unit)
          )
        }

        if let mostRecentDateInterval = gottenStats.mostRecentQuantityDateInterval(for: source) {
          response.mostRecentQuantityDateInterval = QuantityDateInterval(
            from: mostRecentDateInterval.start,
            to: mostRecentDateInterval.end
          )
        }
      }

      if #available(iOS 13, *) {
        if let duration = gottenStats.duration(for: source) {
          let durationUnit = HKUnit.second()
          response.duration = Quantity(
            unit: durationUnit.unitString,
            quantity: duration.doubleValue(for: durationUnit)
          )
        }
      }
      return response
    }
  }
  return []
}

func getAnyMapValue(_ anyMap: AnyMap, key: String) -> Any? {
  if anyMap.isBool(key: key) {
    return anyMap.getBoolean(key: key)
  }
  if anyMap.isArray(key: key) {
    return anyMap.getArray(key: key)
  }
  if anyMap.isDouble(key: key) {
    return anyMap.getDouble(key: key)
  }
  if anyMap.isObject(key: key) {
    return anyMap.getObject(key: key)
  }
  if anyMap.isString(key: key) {
    return anyMap.getString(key: key)
  }
  if anyMap.isBigInt(key: key) {
    return anyMap.getBigInt(key: key)
  }
  if anyMap.isNull(key: key) {
    return nil
  }
  return nil
}

func buildStatisticsOptions(statistics: [StatisticsOptions]) -> HKStatisticsOptions {
  // Build statistics options
  var opts = HKStatisticsOptions()
  for statistic in statistics {
    if statistic == .cumulativesum {
      opts.insert(HKStatisticsOptions.cumulativeSum)
    } else if statistic == .discreteaverage {
      opts.insert(HKStatisticsOptions.discreteAverage)
    } else if statistic == .discretemax {
      opts.insert(HKStatisticsOptions.discreteMax)
    } else if statistic == .discretemin {
      opts.insert(HKStatisticsOptions.discreteMin)
    }
    if #available(iOS 13, *) {
      if statistic == .duration {
        opts.insert(HKStatisticsOptions.duration)
      }
      if statistic == .mostrecent {
        opts.insert(HKStatisticsOptions.mostRecent)
      }
    }
  }
  return opts
}

/// Handles HealthKit's `errorNoData` by resuming the continuation with a fallback value if provided,
/// otherwise resumes with `nil` for Optional result types. For other errors, resumes by throwing.
/// - Parameters:
///   - error: The error returned by HealthKit.
///   - continuation: The continuation to resume.
///   - noDataFallback: Optional closure producing a fallback value to use when the error is `errorNoData`.
func handleHKNoDataOrThrow<T>(
  error: Error,
  continuation: CheckedContinuation<T, Error>,
  noDataFallback: (() -> T)
) {
  let nsError = error as NSError
  if nsError.domain == HKError.errorDomain,
    nsError.code == HKError.Code.errorNoData.rawValue {
    continuation.resume(returning: noDataFallback())
  } else {
    continuation.resume(throwing: error)
  }
}

class QuantityTypeModule: HybridQuantityTypeModuleSpec {
  func queryStatisticsForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier, statistics: [StatisticsOptions],
    options: StatisticsQueryOptions?
  ) -> Promise<[QueryStatisticsResponseFromSingleSource]> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)

      let gottenStats = try await queryStatisticsForQuantityInternal(
        quantityType: quantityType,
        statistics: statistics,
        options: options
      )

      let unit = try await getUnitToUse(
        unitOverride: options?.unit,
        quantityType: quantityType
      )

      let response = serializeStatisticsPerSource(gottenStats: gottenStats, unit: unit)

      return response
    }
  }

  func queryStatisticsCollectionForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier, statistics: [StatisticsOptions], anchorDate: Date,
    intervalComponents: IntervalComponents, options: StatisticsQueryOptions?
  ) -> Promise<[QueryStatisticsResponseFromSingleSource]> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)

      let statistics = try await queryStatisticsCollectionForQuantityInternal(
        quantityType: quantityType,
        statistics: statistics,
        anchorDate: anchorDate,
        intervalComponents: intervalComponents,
        options: options
      )

      let unit = try await getUnitToUse(
        unitOverride: options?.unit,
        quantityType: quantityType
      )

      return statistics.statistics().flatMap { statistics in
        return serializeStatisticsPerSource(gottenStats: statistics, unit: unit)
      }
    }
  }

  func aggregationStyle(identifier: QuantityTypeIdentifier) throws -> AggregationStyle {
    let sampleType = try initializeQuantityType(identifier.stringValue)

    if let aggregationStyle = AggregationStyle(
      rawValue: Int32(sampleType.aggregationStyle.rawValue)) {
      return aggregationStyle
    }

    throw runtimeErrorWithPrefix(
      "Got unknown aggregation style value: \(sampleType.aggregationStyle.rawValue)")
  }

  func isQuantityCompatibleWithUnit(identifier: QuantityTypeIdentifier, unit: String) throws -> Bool {
    let sampleType = try initializeQuantityType(identifier.stringValue)

    let hkUnit = try parseUnitStringSafe(unit)

    return sampleType.is(compatibleWith: hkUnit)
  }

  func queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier, statistics: [StatisticsOptions],
    options: StatisticsQueryOptions?
  ) -> Promise<QueryStatisticsResponse> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)

      let gottenStats = try await queryStatisticsForQuantityInternal(
        quantityType: quantityType,
        statistics: statistics,
        options: options
      )

      let unit = try await getUnitToUse(
        unitOverride: options?.unit,
        quantityType: quantityType
      )

      let response = serializeStatistics(gottenStats: gottenStats, unit: unit)

      return response
    }
  }

  func queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier, statistics: [StatisticsOptions], anchorDate: Date,
    intervalComponents: IntervalComponents, options: StatisticsQueryOptions?
  ) -> Promise<[QueryStatisticsResponse]> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)

      let statistics = try await queryStatisticsCollectionForQuantityInternal(
        quantityType: quantityType,
        statistics: statistics,
        anchorDate: anchorDate,
        intervalComponents: intervalComponents,
        options: options
      )

      let unit = try await getUnitToUse(
        unitOverride: options?.unit,
        quantityType: quantityType
      )

      return statistics.statistics().map { statistics in
        return serializeStatistics(gottenStats: statistics, unit: unit)
      }
    }
  }

  func queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier, options: QueryOptionsWithAnchorAndUnit
  ) -> Promise<QuantitySamplesWithAnchorResponse> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)
      let predicate = createPredicateForSamples(options.filter)

      let unit = try await getUnitToUse(
        unitOverride: options.unit,
        quantityType: quantityType
      )

      let response = try await sampleAnchoredQueryAsync(
        sampleType: quantityType,
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      let quantitySamples = response.samples.compactMap { sample in
        if let quantitySample = sample as? HKQuantitySample {
          do {
            return try serializeQuantitySample(
              sample: quantitySample,
              unit: unit
            )
          } catch {
            warnWithPrefix("queryQuantitySamplesWithAnchor: \(error.localizedDescription)")
          }
        }
        return nil
      }

      return QuantitySamplesWithAnchorResponse(
        samples: quantitySamples,
        deletedSamples: response.deletedSamples,
        newAnchor: response.newAnchor
      )
    }
  }

  func saveQuantitySample(
    identifier: QuantityTypeIdentifier,
    unit: String,
    value: Double,
    start: Date,
    end: Date,
    metadata: AnyMap?
  ) -> Promise<QuantitySample?> {
    return Promise.async {
      let unit = try parseUnitStringSafe(unit)
      let quantity = HKQuantity.init(unit: unit, doubleValue: value)
      let typeIdentifier = HKQuantityType(
        HKQuantityTypeIdentifier(rawValue: identifier.stringValue)
      )
      let metadata = anyMapToDictionaryOptional(metadata)

      let sample = HKQuantitySample.init(
        type: typeIdentifier,
        quantity: quantity,
        start: start,
        end: end,
        metadata: metadata
      )

      let succeeded = try await saveAsync(sample: sample)

      return succeeded ? try serializeQuantitySample(sample: sample, unit: unit) : nil
    }
  }

  func queryQuantitySamples(
    identifier: QuantityTypeIdentifier, options: QueryOptionsWithSortOrderAndUnit
  ) -> Promise<[QuantitySample]> {
    return Promise.async {
      let quantityType = try initializeQuantityType(identifier.stringValue)
      let unit = try await getUnitToUse(unitOverride: options.unit, quantityType: quantityType)
      let samples = try await sampleQueryAsync(
        sampleType: quantityType,
        limit: options.limit,
        predicate: createPredicateForSamples(options.filter),
        sortDescriptors: getSortDescriptors(ascending: options.ascending)
      )

      return samples.compactMap({ sample in
        if let sample = sample as? HKQuantitySample {
          do {
            let serialized = try serializeQuantitySample(
              sample: sample,
              unit: unit
            )

            return serialized
          } catch {
            warnWithPrefix("Error serializing quantity sample: \(error.localizedDescription)")
          }
        }
        return nil
      })
    }
  }

}
