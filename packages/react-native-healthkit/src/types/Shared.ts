import type { AnyMap } from 'react-native-nitro-modules'
import type {
  CategoryTypeIdentifier,
  CategoryTypeIdentifierWriteable,
} from './CategoryTypeIdentifier'
import type { CharacteristicTypeIdentifier } from './Characteristics'
import type {
  ElectrocardiogramTypeIdentifier,
  HeartbeatSeriesTypeIdentifier,
  StateOfMindTypeIdentifier,
  WorkoutRouteTypeIdentifier,
  WorkoutTypeIdentifier,
} from './Constants'
import type { CorrelationTypeIdentifier } from './CorrelationType'
import type { Device } from './Device'
import type {
  HeartRateMotionContext,
  InsulinDeliveryReason,
  Quantity,
} from './QuantityType'
import type {
  QuantityTypeIdentifier,
  QuantityTypeIdentifierWriteable,
} from './QuantityTypeIdentifier'
import type { SourceRevision } from './Source'
import type { WeatherCondition } from './WeatherCondition'

export interface DeletedSample {
  readonly uuid: string
  readonly metadata?: AnyMap
}

export type ObjectTypeIdentifier =
  | CharacteristicTypeIdentifier
  | SampleTypeIdentifier
  | typeof ActivitySummaryTypeIdentifier

export type PerObjectTypeIdentifier =
  | typeof HKVisionPrescriptionTypeIdentifier
  | typeof UserAnnotatedMedicationTypeIdentifier

export type SampleTypeIdentifier =
  | CategoryTypeIdentifier
  | CorrelationTypeIdentifier
  | QuantityTypeIdentifier
  | typeof StateOfMindTypeIdentifier
  | typeof AudiogramTypeIdentifier
  | typeof HeartbeatSeriesTypeIdentifier
  | typeof WorkoutRouteTypeIdentifier
  | typeof WorkoutTypeIdentifier
  | typeof ElectrocardiogramTypeIdentifier

export type SampleTypeIdentifierWriteable =
  | CategoryTypeIdentifierWriteable
  | CorrelationTypeIdentifier
  | QuantityTypeIdentifierWriteable
  | typeof StateOfMindTypeIdentifier
  | typeof AudiogramTypeIdentifier
  | typeof HeartbeatSeriesTypeIdentifier
  | typeof WorkoutRouteTypeIdentifier
  | typeof WorkoutTypeIdentifier

export interface GenericMetadata {
  readonly HKExternalUUID?: string
  readonly HKTimeZone?: string
  readonly HKWasUserEntered?: boolean
  readonly HKDeviceSerialNumber?: string
  readonly HKUDIDeviceIdentifier?: string
  readonly HKUDIProductionIdentifier?: string
  readonly HKDigitalSignature?: string
  readonly HKDeviceName?: string
  readonly HKDeviceManufacturerName?: string
  readonly HKSyncIdentifier?: string
  readonly HKSyncVersion?: number
  readonly HKWasTakenInLab?: boolean
  readonly HKReferenceRangeLowerLimit?: number
  readonly HKReferenceRangeUpperLimit?: number
}

/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const ActivitySummaryTypeIdentifier =
  'HKActivitySummaryTypeIdentifier' as const

/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const HKVisionPrescriptionTypeIdentifier =
  'HKVisionPrescriptionTypeIdentifier' as const

export const UserAnnotatedMedicationTypeIdentifier =
  'UserAnnotatedMedicationType' as const

/**
 * Represents an audiogram type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKAudiogramSampleType Apple Docs HKAudiogramSampleType}
 */
export const AudiogramTypeIdentifier = 'HKAudiogramSampleType' as const

export interface BaseObject {
  readonly uuid: string
  readonly sourceRevision: SourceRevision
  readonly device?: Device
  readonly metadata: AnyMap

  // metadata
  readonly metadataExternalUUID?: string
  readonly metadataTimeZone?: string
  readonly metadataWasUserEntered?: boolean
  readonly metadataDeviceSerialNumber?: string
  readonly metadataUdiDeviceIdentifier?: string
  readonly metadataUdiProductionIdentifier?: string
  readonly metadataDigitalSignature?: string
  readonly metadataDeviceName?: string
  readonly metadataDeviceManufacturerName?: string
  readonly metadataSyncIdentifier?: string
  readonly metadataSyncVersion?: number
  readonly metadataWasTakenInLab?: boolean
  readonly metadataReferenceRangeLowerLimit?: number
  readonly metadataReferenceRangeUpperLimit?: number
  readonly metadataAlgorithmVersion?: number
}

export interface SampleType {
  identifier: string
  allowsRecalibrationForEstimates: boolean
  isMinimumDurationRestricted: boolean
  isMaximumDurationRestricted: boolean
}

export interface BaseSample extends BaseObject {
  readonly sampleType: SampleType
  readonly startDate: Date
  readonly endDate: Date
  readonly hasUndeterminedDuration: boolean

  // metadata
  readonly metadataWeatherCondition?: WeatherCondition
  readonly metadataWeatherHumidity?: Quantity
  readonly metadataWeatherTemperature?: Quantity
  readonly metadataInsulinDeliveryReason?: InsulinDeliveryReason
  /**
   * postprandial or preprandial (https://developer.apple.com/documentation/healthkit/hkbloodglucosemealtime)
   */
  // readonly metadataBloodGlucoseMealTime?: number
  readonly metadataHeartRateMotionContext?: HeartRateMotionContext
}
