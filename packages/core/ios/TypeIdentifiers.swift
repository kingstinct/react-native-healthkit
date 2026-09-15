//
//  TypeIdentifiers.swift
//  ReactNativeHealthkitCore
//
//  Maps the string identifiers JS uses to HealthKit sample types.
//

import Foundation
import HealthKit

public let quantityTypeIdentifierPrefix = "HKQuantityTypeIdentifier"
public let categoryTypeIdentifierPrefix = "HKCategoryTypeIdentifier"
public let correlationTypeIdentifierPrefix = "HKCorrelationTypeIdentifier"
public let characteristicTypeIdentifierPrefix = "HKCharacteristicTypeIdentifier"
public let clinicalTypeIdentifierPrefix = "HKClinicalTypeIdentifier"

let workoutTypeIdentifierName = "HKWorkoutTypeIdentifier"
let workoutRouteTypeIdentifierName = "HKWorkoutRouteTypeIdentifier"
let heartbeatSeriesTypeIdentifierName = "HKDataTypeIdentifierHeartbeatSeries"
let audiogramTypeIdentifierName = "HKAudiogramSampleType"
let electrocardiogramTypeIdentifierName = "HKElectrocardiogramType"
let stateOfMindTypeIdentifierName = "HKStateOfMindTypeIdentifier"

/// Apple renamed `HKCategoryTypeIdentifierAudioExposureEvent` to
/// `HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent` in iOS 14, but the new
/// constant still carries the old raw string at runtime. Building the identifier from the
/// modern name as a raw string therefore makes `categoryType(forIdentifier:)` return nil,
/// and samples read back from HealthKit report the legacy name. These helpers translate
/// in both directions so JS only ever sees the modern identifier.
public let environmentalAudioExposureEventIdentifierName =
  "HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent"
public let legacyAudioExposureEventIdentifierName = "HKCategoryTypeIdentifierAudioExposureEvent"

public func hkCategoryTypeIdentifier(fromIdentifierName name: String) -> HKCategoryTypeIdentifier {
  if name == environmentalAudioExposureEventIdentifierName {
    return .environmentalAudioExposureEvent
  }
  return HKCategoryTypeIdentifier(rawValue: name)
}

public func categoryTypeIdentifierName(fromHealthKitIdentifier identifier: String) -> String {
  if identifier == legacyAudioExposureEventIdentifierName {
    return environmentalAudioExposureEventIdentifierName
  }
  return identifier
}

/// Resolves any sample type identifier the packages expose to JS (quantity,
/// category, correlation, clinical, workout, series, audiogram,
/// electrocardiogram and state of mind) to its `HKSampleType`. Returns nil for
/// identifiers HealthKit does not know on this OS version.
public func sampleType(fromIdentifier identifier: String) -> HKSampleType? {
  if identifier.hasPrefix(quantityTypeIdentifierPrefix) {
    return HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: identifier))
  }

  if identifier.hasPrefix(categoryTypeIdentifierPrefix) {
    return HKObjectType.categoryType(
      forIdentifier: hkCategoryTypeIdentifier(fromIdentifierName: identifier))
  }

  if identifier.hasPrefix(correlationTypeIdentifierPrefix) {
    return HKObjectType.correlationType(
      forIdentifier: HKCorrelationTypeIdentifier(rawValue: identifier))
  }

  if identifier.hasPrefix(clinicalTypeIdentifierPrefix) {
    return HKObjectType.clinicalType(forIdentifier: HKClinicalTypeIdentifier(rawValue: identifier))
  }

  if identifier == workoutTypeIdentifierName {
    return HKObjectType.workoutType()
  }

  if identifier == workoutRouteTypeIdentifierName || identifier == heartbeatSeriesTypeIdentifierName {
    return HKObjectType.seriesType(forIdentifier: identifier)
  }

  if identifier == audiogramTypeIdentifierName {
    return HKObjectType.audiogramSampleType()
  }

  if identifier == electrocardiogramTypeIdentifierName {
    return HKObjectType.electrocardiogramType()
  }

  #if compiler(>=6)
    if #available(iOS 18, *) {
      if identifier == stateOfMindTypeIdentifierName {
        return HKObjectType.stateOfMindType()
      }
    }
  #endif

  return nil
}
