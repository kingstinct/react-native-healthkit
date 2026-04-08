/*
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: scripts/generate-healthkit.ts
 */

import type { CategoryTypeIdentifier } from '@kingstinct/react-native-healthkit/types/CategoryTypeIdentifier'
import type { QuantityTypeIdentifier } from '@kingstinct/react-native-healthkit/types/QuantityTypeIdentifier'
import { z } from 'zod'

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

export const contractQuantitySchema = z
  .object({
    unit: z.string(),
    quantity: z.number(),
  })
  .passthrough()

export const contractSourceSchema = z
  .object({
    name: z.string(),
    bundleIdentifier: z.string(),
  })
  .passthrough()

export const contractSourceRevisionSchema = z
  .object({
    source: contractSourceSchema,
    operatingSystemVersion: z.string(),
    version: z.string().optional(),
    productType: z.string().optional(),
  })
  .passthrough()

export const contractDeviceSchema = z
  .object({
    name: z.string().optional(),
    firmwareVersion: z.string().optional(),
    hardwareVersion: z.string().optional(),
    localIdentifier: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    softwareVersion: z.string().optional(),
    udiDeviceIdentifier: z.string().optional(),
  })
  .passthrough()

export const contractSampleTypeSchema = z
  .object({
    identifier: z.string(),
    allowsRecalibrationForEstimates: z.boolean(),
    isMinimumDurationRestricted: z.boolean(),
    isMaximumDurationRestricted: z.boolean(),
  })
  .passthrough()

export const contractWorkoutActivitySchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    uuid: z.string(),
    duration: z.number(),
  })
  .passthrough()

function contractSchemaForMetadataKind(
  kind: ContractMetadataValueKind,
): z.ZodTypeAny {
  switch (kind) {
    case 'string':
      return z.string()
    case 'boolean':
      return z.boolean()
    case 'number':
    case 'enum':
      return z.number()
    case 'quantity':
      return contractQuantitySchema
  }
}

function contractMetadataSchemaFromKinds(
  kinds: Readonly<Record<string, ContractMetadataValueKind>>,
) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const [key, kind] of Object.entries(kinds)) {
    shape[key] = contractSchemaForMetadataKind(kind).optional()
  }

  return z.object(shape).passthrough()
}

function mergeContractMetadataKinds(
  ...sources: ReadonlyArray<Readonly<Record<string, ContractMetadataValueKind>>>
): Record<string, ContractMetadataValueKind> {
  return Object.assign({}, ...sources)
}

export const contractObjectMetadataSchema = contractMetadataSchemaFromKinds(
  KNOWN_OBJECT_METADATA_KIND_BY_KEY,
)
export const contractSampleMetadataSchema = contractMetadataSchemaFromKinds(
  mergeContractMetadataKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
  ),
)
export const contractWorkoutMetadataSchema = contractMetadataSchemaFromKinds(
  mergeContractMetadataKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
    KNOWN_WORKOUT_METADATA_KIND_BY_KEY,
  ),
)
export const contractWorkoutEventMetadataSchema =
  contractMetadataSchemaFromKinds(KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY)

const categoryMetadataSchemaLookup = Object.fromEntries(
  Object.entries(CATEGORY_METADATA_KIND_LOOKUP).map(([identifier, kinds]) => [
    identifier,
    contractMetadataSchemaFromKinds(
      mergeContractMetadataKinds(
        KNOWN_OBJECT_METADATA_KIND_BY_KEY,
        KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
        kinds,
      ),
    ),
  ]),
) as Record<string, z.ZodTypeAny>

const quantityMetadataSchemaLookup = Object.fromEntries(
  Object.entries(QUANTITY_METADATA_KIND_LOOKUP).map(([identifier, kinds]) => [
    identifier,
    contractMetadataSchemaFromKinds(
      mergeContractMetadataKinds(
        KNOWN_OBJECT_METADATA_KIND_BY_KEY,
        KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
        kinds,
      ),
    ),
  ]),
) as Record<string, z.ZodTypeAny>

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

export function getCategoryMetadataContractSchema(
  identifier: CategoryTypeIdentifier,
): z.ZodTypeAny {
  return (
    categoryMetadataSchemaLookup[identifier] ?? contractSampleMetadataSchema
  )
}

export function getQuantityMetadataContractSchema(
  identifier: QuantityTypeIdentifier,
): z.ZodTypeAny {
  return (
    quantityMetadataSchemaLookup[identifier] ?? contractSampleMetadataSchema
  )
}

function createBaseSampleContractSchema(metadataSchema: z.ZodTypeAny) {
  return z
    .object({
      uuid: z.string(),
      sourceRevision: contractSourceRevisionSchema,
      device: contractDeviceSchema.optional(),
      metadata: metadataSchema,
      sampleType: contractSampleTypeSchema,
      startDate: z.date(),
      endDate: z.date(),
      hasUndeterminedDuration: z.boolean(),
    })
    .passthrough()
}

export function getQuantitySampleContractSchema(
  identifier: QuantityTypeIdentifier,
) {
  return createBaseSampleContractSchema(
    getQuantityMetadataContractSchema(identifier),
  )
    .extend({
      quantityType: z.literal(identifier),
      quantity: z.number(),
      unit: z.string(),
    })
    .passthrough()
}

export function getCategorySampleContractSchema(
  identifier: CategoryTypeIdentifier,
) {
  return createBaseSampleContractSchema(
    getCategoryMetadataContractSchema(identifier),
  )
    .extend({
      categoryType: z.literal(identifier),
      value: z.number(),
    })
    .passthrough()
}

export const contractWorkoutEventSchema = z
  .object({
    type: z.number(),
    startDate: z.date(),
    endDate: z.date(),
    metadata: contractWorkoutEventMetadataSchema.optional(),
  })
  .passthrough()

export const contractWorkoutSampleSchema = createBaseSampleContractSchema(
  contractWorkoutMetadataSchema,
)
  .extend({
    workoutActivityType: z.number(),
    duration: contractQuantitySchema,
    totalEnergyBurned: contractQuantitySchema.optional(),
    totalDistance: contractQuantitySchema.optional(),
    totalSwimmingStrokeCount: contractQuantitySchema.optional(),
    totalFlightsClimbed: contractQuantitySchema.optional(),
    events: z.array(contractWorkoutEventSchema).optional(),
    activities: z.array(contractWorkoutActivitySchema).optional(),
  })
  .passthrough()
