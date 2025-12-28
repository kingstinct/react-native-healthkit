//
//  Helpers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules

func parseUnitStringSafe(_ unitString: String) throws -> HKUnit {
  var err: NSError?
  let unitOut = HKUnitFromStringCatchingExceptions(unitString, &err)

  if let hkUnit = unitOut {
    return hkUnit
  }

  throw runtimeErrorWithPrefix("Supplied invalid '\(unitString)' as HKUnit")
}

func getQueryLimit(_ limit: Double) -> Int {
  if limit == .infinity || limit <= 0 || limit == .nan || limit == .signalingNaN {
    return HKObjectQueryNoLimit
  }

  return Int(limit)
}

struct AnchoredQueryResponse {
  var samples: [HKSample]
  var deletedSamples: [DeletedSample]
  var newAnchor: String
}

func sampleAnchoredQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  queryAnchor: String?,
  predicate: NSPredicate?
) async throws -> AnchoredQueryResponse {
  let queryAnchor = try deserializeHKQueryAnchor(base64String: queryAnchor)

  return try await withCheckedThrowingContinuation { continuation in
    let query = HKAnchoredObjectQuery(
      type: sampleType,
      predicate: predicate,
      anchor: queryAnchor,
      limit: getQueryLimit(limit)
    ) {
      (
        _: HKAnchoredObjectQuery, samples: [HKSample]?, deletedSamples: [HKDeletedObject]?,
        newAnchor:
          HKQueryAnchor?, error: Error?
      ) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      if let samples = samples, let deletedSamples = deletedSamples,
        let newAnchor = serializeAnchor(anchor: newAnchor) {
        return continuation.resume(
          returning: AnchoredQueryResponse(
            samples: samples,
            deletedSamples: deletedSamples.map({ deletedSample in
              return serializeDeletedSample(sample: deletedSample)
            }),
            newAnchor: newAnchor
          )
        )
      }

      return continuation.resume(
        throwing: runtimeErrorWithPrefix("Unexpected empty response"))
    }

    store.execute(query)
  }
}

func serializeAnchor(anchor: HKQueryAnchor?) -> String? {
  return toBase64(anchor)
}

func toBase64(_ data: Any?) -> String? {
  if let data = data {
    let data = NSKeyedArchiver.archivedData(withRootObject: data)
    let encoded = data.base64EncodedString()

    return encoded
  }

  return nil
}

func sampleQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  predicate: NSPredicate?,
  sortDescriptors: [NSSortDescriptor]?
) async throws -> [HKSample] {
  let limit = getQueryLimit(limit)
  return try await withCheckedThrowingContinuation { continuation in
    let q = HKSampleQuery(
      sampleType: sampleType,
      predicate: predicate,
      limit: limit,
      sortDescriptors: sortDescriptors,
    ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      if let samples = samples {
        return continuation.resume(returning: samples)
      }

      return continuation.resume(
        throwing: runtimeErrorWithPrefix("Unexpected empty response"))
    }

    store.execute(q)
  }
}

func saveAsync(sample: HKObject) async throws -> Bool {
  return try await withCheckedThrowingContinuation { continuation in
    store.save(sample) { (success: Bool, error: Error?) in
      if let error = error {
        continuation.resume(throwing: error)
      } else {
        continuation.resume(returning: success)
      }
    }
  }
}

func getSortDescriptors(ascending: Bool?) -> [NSSortDescriptor] {
  return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending ?? false)]
}

func fromBase64(base64String: String?) throws -> Any? {
  if let base64String = base64String {
    if base64String.isEmpty {
      return nil
    }

    // Step 1: Decode the base64 string to a Data object
    guard let data = Data(base64Encoded: base64String) else {
      throw runtimeErrorWithPrefix("Invalid base64 string: \(base64String)")
    }

    // Step 2: Use NSKeyedUnarchiver to unarchive the data and create an HKQueryAnchor object
    do {
      let unarchiver = try NSKeyedUnarchiver(forReadingFrom: data)
      unarchiver.requiresSecureCoding = true
      return try? NSKeyedUnarchiver.unarchiveTopLevelObjectWithData(data)
    } catch {
      throw runtimeErrorWithPrefix(
        "Error recreating HKQueryAnchor object: \(error.localizedDescription)")
    }
  }
  return nil
}

func deserializeHKQueryAnchor(base64String: String?) throws -> HKQueryAnchor? {
  return try fromBase64(base64String: base64String) as? HKQueryAnchor
}

func initializeCategoryType(_ identifier: String) throws -> HKCategoryType {
  let identifier = HKCategoryTypeIdentifier(rawValue: identifier)
  if let sampleType = HKSampleType.categoryType(forIdentifier: identifier) {
    return sampleType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized categoryType with identifier \(identifier)")
}

func initializeWorkoutActivityType(_ typeIdentifier: UInt) throws -> HKWorkoutActivityType {
  if let type = HKWorkoutActivityType.init(rawValue: typeIdentifier) {
    return type
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized quantityType with identifier \(typeIdentifier)")
}

func initializeQuantityType(_ identifier: String) throws -> HKQuantityType {
  let identifier = HKQuantityTypeIdentifier(rawValue: identifier)

  if let sampleType = HKSampleType.quantityType(forIdentifier: identifier) {
    return sampleType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized quantityType with identifier \(identifier)")
}

func initializeCorrelationType(_ identifier: String) throws -> HKCorrelationType {
  let identifier = HKCorrelationTypeIdentifier(rawValue: identifier)

  if let sampleType = HKSampleType.correlationType(forIdentifier: identifier) {
    return sampleType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized correlationType with identifier \(identifier)")
}

func initializeSeriesType(_ identifier: String) throws -> HKSeriesType {
  if let seriesType = HKObjectType.seriesType(forIdentifier: identifier) {
    return seriesType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized seriesType with identifier \(identifier)")
}

func sampleTypeFrom(sampleTypeIdentifier: SampleTypeIdentifier) throws -> HKSampleType {
  if let sampleType = try sampleTypeFromStringNullable(
    typeIdentifier: sampleTypeIdentifier.stringValue) {
    return sampleType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized sampleType with identifier \(sampleTypeIdentifier.stringValue)"
  )
}

func sampleTypeFrom(sampleTypeIdentifierWriteable: SampleTypeIdentifierWriteable) throws
  -> HKSampleType {
  if let sampleType = try sampleTypeFromStringNullable(
    typeIdentifier: sampleTypeIdentifierWriteable.stringValue) {
    return sampleType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize unrecognized sampleType with identifier \(sampleTypeIdentifierWriteable.stringValue)"
  )
}

private func sampleTypeFromStringNullable(typeIdentifier: String) throws -> HKSampleType? {
  if typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX) {
    return try initializeQuantityType(typeIdentifier)
  }

  if typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX) {
    return try initializeCategoryType(typeIdentifier)
  }

  if typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX) {
    return try initializeCorrelationType(typeIdentifier)
  }

  if typeIdentifier == HKWorkoutTypeIdentifier {
    return HKSampleType.workoutType()
  }

  if typeIdentifier == HKWorkoutRouteTypeIdentifier {
    return try initializeSeriesType(typeIdentifier)
  }

  if typeIdentifier == HKAudiogramTypeIdentifier {
    return HKObjectType.audiogramSampleType()
  }

  if typeIdentifier == HKDataTypeIdentifierHeartbeatSeries {
    return try initializeSeriesType(typeIdentifier)
  }

  if typeIdentifier == HKAudiogramTypeIdentifier {
    return HKSampleType.audiogramSampleType()
  }

  if typeIdentifier == HKElectrocardiogramType {
    return HKSampleType.electrocardiogramType()
  }

  #if compiler(>=6)
    if #available(iOS 18, *) {
      if typeIdentifier == HKStateOfMindTypeIdentifier {
        return HKObjectType.stateOfMindType()
      }
    }
  #endif

  return nil
}

func objectTypesFromArray(typeIdentifiers: [ObjectTypeIdentifier]) -> Set<HKObjectType> {
  var share = Set<HKObjectType>()
  for typeIdentifier in typeIdentifiers {
    do {
      let objectType = try objectTypeFrom(objectTypeIdentifier: typeIdentifier)
      share.insert(objectType)
    } catch {
      warnWithPrefix("objectTypesFromArray: \(error.localizedDescription)")
    }
  }
  return share
}

func initializeUUID(_ uuidString: String) throws -> UUID {
  if let uuid = UUID(uuidString: uuidString) {
    return uuid
  }

  throw runtimeErrorWithPrefix("Got invalid UUID: \(uuidString)")
}

func sampleTypesFromArray(typeIdentifiers: [SampleTypeIdentifier]) -> Set<HKSampleType> {
  return Set(
    typeIdentifiers.compactMap { typeIdentifier in
      do {
        let sampleType = try sampleTypeFrom(sampleTypeIdentifier: typeIdentifier)
        return sampleType
      } catch {
        warnWithPrefix("sampleTypesFromArray: \(error.localizedDescription)")
      }
      return nil
    })
}

func sampleTypesFromArray(typeIdentifiersWriteable: [SampleTypeIdentifierWriteable]) -> Set<
  HKSampleType
> {
  return Set(
    typeIdentifiersWriteable.compactMap { typeIdentifier in
      do {
        let sampleType = try sampleTypeFrom(sampleTypeIdentifierWriteable: typeIdentifier)
        return sampleType
      } catch {
        warnWithPrefix("sampleTypesFromArray: \(error.localizedDescription)")
      }
      return nil
    })
}

// objectType is wider than sampleType, so it uses it under the hood
func objectTypeFrom(objectTypeIdentifier: ObjectTypeIdentifier) throws -> HKObjectType {
  let typeIdentifier = objectTypeIdentifier.stringValue
  if let sampleType = try sampleTypeFromStringNullable(typeIdentifier: typeIdentifier) {
    return sampleType
  }

  if typeIdentifier.starts(with: HKCharacteristicTypeIdentifier_PREFIX) {
    let identifier = HKCharacteristicTypeIdentifier.init(rawValue: typeIdentifier)
    if let type = HKObjectType.characteristicType(forIdentifier: identifier) as HKObjectType? {
      return type
    }
  }

  if typeIdentifier == HKActivitySummaryTypeIdentifier {
    return HKObjectType.activitySummaryType()
  }

  throw runtimeErrorWithPrefix(
    "Failed initializing unrecognized objectType identifier " + typeIdentifier)
}

func componentsFromInterval(_ interval: NSDictionary) -> DateComponents {
  let componentKeys: [String: WritableKeyPath<DateComponents, Int?>] = [
    "minute": \.minute,
    "hour": \.hour,
    "day": \.day,
    "month": \.month,
    "year": \.year,
  ]

  var intervalComponents = DateComponents()
  for (key, keyPath) in componentKeys {
    if let value = interval[key] as? Int {
      intervalComponents[keyPath: keyPath] = value
    }
  }
  return intervalComponents
}

func parseWorkoutConfiguration(_ config: WorkoutConfiguration) -> HKWorkoutConfiguration {
  let configuration = HKWorkoutConfiguration()

  if let activityType = HKWorkoutActivityType(rawValue: UInt(config.activityType.rawValue)) {
    configuration.activityType = activityType
  }

  if let locationTypeRaw = config.locationType,
    let locationType = HKWorkoutSessionLocationType(rawValue: Int(locationTypeRaw.rawValue)) {
    configuration.locationType = locationType
  }

  return configuration
}

func anyMapToDictionaryOptional(_ anyMap: AnyMap?) -> [String: Any]? {
  if let anyMap = anyMap {
    return anyMapToDictionary(anyMap)
  }
  return nil
}

func anyMapToDictionary(_ anyMap: AnyMap) -> [String: Any] {
  var dict = [String: Any]()
  anyMap.getAllKeys().forEach { key in
    dict[key] = getAnyMapValue(anyMap, key: key)
  }
  return dict
}

func runtimeErrorWithPrefix(_ withMessage: String) -> Error {
  return RuntimeError.error(withMessage: "[react-native-healthkit] \(withMessage)")
}

func warnWithPrefix(_ withMessage: String) {
  print("[react-native-healthkit] \(withMessage)")
}

func buildStatisticsOptions(statistics: [StatisticsOptions], quantityType: HKQuantityType) -> HKStatisticsOptions {

  // Build statistics options
  var opts = HKStatisticsOptions()
  opts.insert(.separateBySource)
  for statistic in statistics {
    if statistic == .cumulativesum {
      if quantityType.aggregationStyle == .cumulative {
        opts.insert(HKStatisticsOptions.cumulativeSum)
      } else {
        warnWithPrefix("buildStatisticsOptions: cumulativesum statistic requested for discrete quantity type \(quantityType.identifier)")
      }

    } else if statistic == .discreteaverage {
      if quantityType.aggregationStyle != .cumulative {
        opts.insert(HKStatisticsOptions.discreteAverage)
      } else {
        warnWithPrefix("buildStatisticsOptions: discreteaverage statistic requested for cumulative quantity type \(quantityType.identifier)")
      }
    } else if statistic == .discretemax {
      if quantityType.aggregationStyle != .cumulative {
        opts.insert(HKStatisticsOptions.discreteMax)
      } else {
        warnWithPrefix("buildStatisticsOptions: discretemax statistic requested for cumulative quantity type \(quantityType.identifier)")
      }
    } else if statistic == .discretemin {
      if quantityType.aggregationStyle != .cumulative {
        opts.insert(HKStatisticsOptions.discreteMin)
      } else {
        warnWithPrefix("buildStatisticsOptions: discretemin statistic requested for cumulative quantity type \(quantityType.identifier)")
      }
    }

    if statistic == .duration {
      opts.insert(HKStatisticsOptions.duration)
    }
    if statistic == .mostrecent {
      opts.insert(HKStatisticsOptions.mostRecent)
    }
  }
  return opts
}
