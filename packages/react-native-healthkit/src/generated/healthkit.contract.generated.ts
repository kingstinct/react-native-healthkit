/*
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: scripts/generate-healthkit.ts
 */

import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

export type ContractMetadataValueKind =
  | 'string'
  | 'boolean'
  | 'number'
  | 'quantity'
  | 'enum'

export const KNOWN_OBJECT_METADATA_KIND_BY_KEY = {
  HKDeviceManufacturerName: 'string',
  HKDeviceName: 'string',
  HKDeviceSerialNumber: 'string',
  HKDigitalSignature: 'string',
  HKExternalUUID: 'string',
  HKFoodType: 'string',
  HKReferenceRangeLowerLimit: 'number',
  HKReferenceRangeUpperLimit: 'number',
  HKSyncIdentifier: 'string',
  HKSyncVersion: 'number',
  HKTimeZone: 'string',
  HKUDIDeviceIdentifier: 'string',
  HKUDIProductionIdentifier: 'string',
  HKWasTakenInLab: 'boolean',
  HKWasUserEntered: 'boolean',
} as const

export const KNOWN_SAMPLE_METADATA_KIND_BY_KEY = {
  HKActivityType: 'enum',
  HKAlgorithmVersion: 'number',
  HKAppleDeviceCalibrated: 'boolean',
  HKAudioExposureDuration: 'quantity',
  HKBarometricPressure: 'quantity',
  HKDateOfEarliestDataUsedForEstimate: 'string',
  HKMaximumLightIntensity: 'quantity',
  HKPhysicalEffortEstimationType: 'enum',
  HKUserMotionContext: 'enum',
  HKWaterSalinity: 'enum',
  HKWeatherCondition: 'enum',
  HKWeatherHumidity: 'quantity',
  HKWeatherTemperature: 'quantity',
} as const

export const KNOWN_WORKOUT_METADATA_KIND_BY_KEY = {
  HKAlpineSlopeGrade: 'quantity',
  HKAppleFitnessPlusCatalogIdentifier: 'string',
  HKAppleFitnessPlusSession: 'boolean',
  HKAverageMETs: 'quantity',
  HKAverageSpeed: 'quantity',
  HKCoachedWorkout: 'boolean',
  HKCrossTrainerDistance: 'quantity',
  HKElevationAscended: 'quantity',
  HKElevationDescended: 'quantity',
  HKFitnessMachineDuration: 'quantity',
  HKGroupFitness: 'boolean',
  HKIndoorBikeDistance: 'quantity',
  HKIndoorWorkout: 'boolean',
  HKLapLength: 'quantity',
  HKMaximumSpeed: 'quantity',
  HKSwimmingLocationType: 'enum',
  HKSWOLFScore: 'number',
  HKWeatherCondition: 'enum',
  HKWeatherHumidity: 'quantity',
  HKWeatherTemperature: 'quantity',
  HKWorkoutBrandName: 'string',
} as const

export const KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY = {
  HKSwimmingStrokeStyle: 'enum',
} as const

export const KNOWN_CATEGORY_METADATA_KIND_BY_IDENTIFIER = {
  HKCategoryTypeIdentifierAudioExposureEvent: {
    HKAudioExposureLevel: 'quantity',
    HKHeadphoneGain: 'quantity',
  },
  HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent: {
    HKAudioExposureLevel: 'quantity',
  },
  HKCategoryTypeIdentifierHeadphoneAudioExposureEvent: {
    HKAudioExposureLevel: 'quantity',
    HKHeadphoneGain: 'quantity',
  },
  HKCategoryTypeIdentifierHighHeartRateEvent: {
    HKHeartRateEventThreshold: 'quantity',
  },
  HKCategoryTypeIdentifierLowCardioFitnessEvent: {
    HKLowCardioFitnessEventThreshold: 'quantity',
    HKVO2MaxValue: 'quantity',
  },
  HKCategoryTypeIdentifierLowHeartRateEvent: {
    HKHeartRateEventThreshold: 'quantity',
  },
  HKCategoryTypeIdentifierMenstrualFlow: {
    HKMenstrualCycleStart: 'boolean',
  },
  HKCategoryTypeIdentifierSexualActivity: {
    HKSexualActivityProtectionUsed: 'boolean',
  },
} as const

export const KNOWN_QUANTITY_METADATA_KIND_BY_IDENTIFIER = {
  HKQuantityTypeIdentifierBasalBodyTemperature: {
    HKBodyTemperatureSensorLocation: 'enum',
  },
  HKQuantityTypeIdentifierBloodGlucose: {
    HKBloodGlucoseMealTime: 'enum',
  },
  HKQuantityTypeIdentifierBodyTemperature: {
    HKBodyTemperatureSensorLocation: 'enum',
  },
  HKQuantityTypeIdentifierInsulinDelivery: {
    HKInsulinDeliveryReason: 'enum',
  },
  HKQuantityTypeIdentifierVO2Max: {
    HKVO2MaxTestType: 'enum',
  },
} as const

const CATEGORY_METADATA_KIND_LOOKUP =
  KNOWN_CATEGORY_METADATA_KIND_BY_IDENTIFIER as Readonly<
    Record<string, Readonly<Record<string, ContractMetadataValueKind>>>
  >
const QUANTITY_METADATA_KIND_LOOKUP =
  KNOWN_QUANTITY_METADATA_KIND_BY_IDENTIFIER as Readonly<
    Record<string, Readonly<Record<string, ContractMetadataValueKind>>>
  >

export function getKnownCategoryMetadataKindMap(
  identifier: CategoryTypeIdentifier,
): Readonly<Record<string, ContractMetadataValueKind>> {
  return CATEGORY_METADATA_KIND_LOOKUP[identifier] ?? {}
}

export function getKnownQuantityMetadataKindMap(
  identifier: QuantityTypeIdentifier,
): Readonly<Record<string, ContractMetadataValueKind>> {
  return QUANTITY_METADATA_KIND_LOOKUP[identifier] ?? {}
}
