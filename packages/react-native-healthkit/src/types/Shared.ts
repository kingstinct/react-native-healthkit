import type { AnyMap } from 'react-native-nitro-modules'
import type {
  KnownObjectMetadata,
  KnownSampleMetadata,
} from '../generated/healthkit.generated'
import type {
  CategoryTypeIdentifier,
  CategoryTypeIdentifierWriteable,
} from './CategoryTypeIdentifier'
import type { CharacteristicTypeIdentifier } from './Characteristics'
import type {
  ActivitySummaryTypeIdentifier,
  AudiogramTypeIdentifier,
  ElectrocardiogramTypeIdentifier,
  HeartbeatSeriesTypeIdentifier,
  HKVisionPrescriptionTypeIdentifier,
  StateOfMindTypeIdentifier,
  UserAnnotatedMedicationTypeIdentifier,
  WorkoutRouteTypeIdentifier,
  WorkoutTypeIdentifier,
} from './Constants'
import type { CorrelationTypeIdentifier } from './CorrelationType'
import type { Device } from './Device'
import type {
  QuantityTypeIdentifier,
  QuantityTypeIdentifierWriteable,
} from './QuantityTypeIdentifier'
import type { SourceRevision } from './Source'

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

export type MetadataWithUnknown<T extends object> = AnyMap & T
export type GenericMetadata = AnyMap & KnownObjectMetadata
export type WithTypedMetadata<T, TMetadata extends object> = Omit<
  T,
  'metadata'
> & {
  readonly metadata: AnyMap & TMetadata
}
export type WithOptionalTypedMetadata<T, TMetadata extends object> = Omit<
  T,
  'metadata'
> & {
  readonly metadata?: AnyMap & TMetadata
}
export type BaseObjectTyped<TMetadata extends object = KnownObjectMetadata> =
  WithTypedMetadata<BaseObject, TMetadata>
export type BaseSampleTyped<TMetadata extends object = KnownSampleMetadata> =
  WithTypedMetadata<BaseSample, TMetadata>

export interface BaseObject {
  readonly uuid: string
  readonly sourceRevision: SourceRevision
  readonly device?: Device
  readonly metadata: AnyMap
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
  readonly metadata: AnyMap
}
