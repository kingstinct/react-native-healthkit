// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: scripts/generate-healthkit.ts

import Foundation

private let healthkitBooleanMetadataKeys: Set<String> = [
  "HKAppleDeviceCalibrated",
  "HKAppleFitnessPlusSession",
  "HKCoachedWorkout",
  "HKGroupFitness",
  "HKIndoorWorkout",
  "HKMenstrualCycleStart",
  "HKQuantityClampedToLowerBound",
  "HKQuantityClampedToUpperBound",
  "HKSexualActivityProtectionUsed",
  "HKWasTakenInLab",
  "HKWasUserEntered",
]

private let healthkitNumericMetadataKeys: Set<String> = [
  "HKActivityType",
  "HKAlgorithmVersion",
  "HKAppleECGAlgorithmVersion",
  "HKBloodGlucoseMealTime",
  "HKBodyTemperatureSensorLocation",
  "HKCyclingFunctionalThresholdPowerTestType",
  "HKDevicePlacementSide",
  "HKHeartRateMotionContext",
  "HKHeartRateRecoveryActivityType",
  "HKHeartRateRecoveryTestType",
  "HKHeartRateSensorLocation",
  "HKInsulinDeliveryReason",
  "HKPhysicalEffortEstimationType",
  "HKReferenceRangeLowerLimit",
  "HKReferenceRangeUpperLimit",
  "HKSwimmingLocationType",
  "HKSwimmingStrokeStyle",
  "HKSWOLFScore",
  "HKSyncVersion",
  "HKUserMotionContext",
  "HKVO2MaxTestType",
  "HKWaterSalinity",
  "HKWeatherCondition",
]

func isKnownBooleanMetadataKey(_ key: String) -> Bool {
  healthkitBooleanMetadataKeys.contains(key)
}

func isKnownNumericMetadataKey(_ key: String) -> Bool {
  healthkitNumericMetadataKeys.contains(key)
}
