//
//  Helpers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules
import ReactNativeHealthkitCore

/// Anchored query results come back with raw HKDeletedObjects; this package
/// serializes them into its own DeletedSample struct.
extension AnchoredQueryResponse {
  var deletedSamples: [DeletedSample] {
    return deletedObjects.map { serializeDeletedSample(sample: $0) }
  }
}

func initializeCategoryType(_ identifier: String) throws -> HKCategoryType {
  let identifier = hkCategoryTypeIdentifier(fromIdentifierName: identifier)
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
  return sampleType(fromIdentifier: typeIdentifier)
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

  if typeIdentifier.starts(with: characteristicTypeIdentifierPrefix) {
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

// objectType is wider than sampleType, so it uses it under the hood
func perObjectTypeFrom(objectTypeIdentifier: PerObjectTypeIdentifier) throws -> HKObjectType {
  let typeIdentifier = objectTypeIdentifier.stringValue

  if #available(iOS 16.0, *) {
    if typeIdentifier == HKVisionPrescriptionTypeIdentifier {
      return HKObjectType.visionPrescriptionType()
    }
  }

  #if compiler(>=6.2)
  if #available(iOS 26.0, *) {
    if typeIdentifier == "UserAnnotatedMedicationType" {
      return HKObjectType.userAnnotatedMedicationType()
    }
  }
  #endif

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
  return makeRuntimeError(withMessage, prefix: logPrefix)
}

func warnWithPrefix(_ withMessage: String) {
  logWarning(withMessage, prefix: logPrefix)
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
