import type { AnyMap } from 'react-native-nitro-modules'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'
import type { Device } from './Device'
import type { DeletedSample } from './Shared'
import type { SourceRevision } from './Source'

// Enums mirror HealthKit; keep the union literal names stable.
export type ElectrocardiogramClassification =
  | 'notSet'
  | 'sinusRhythm'
  | 'atrialFibrillation'
  | 'inconclusiveLowHeartRate'
  | 'inconclusiveHighHeartRate'
  | 'inconclusivePoorReading'
  | 'inconclusiveOther'

export type ElectrocardiogramSymptomsStatus = 'notSet' | 'none' | 'present'
export type ElectrocardiogramLead = 'appleWatchSimilarToLeadI' | 'unknown'

export interface ElectrocardiogramVoltage {
  readonly timeSinceSampleStart: number // seconds
  readonly voltage: number // volts
  readonly lead: ElectrocardiogramLead
}

export interface ElectrocardiogramSample {
  readonly uuid: string
  readonly device?: Device
  readonly startDate: Date
  readonly endDate: Date

  readonly classification: ElectrocardiogramClassification
  readonly symptomsStatus: ElectrocardiogramSymptomsStatus

  readonly averageHeartRateBpm?: number // HKQuantity (count/min)
  readonly samplingFrequencyHz?: number // HKQuantity (Hz)
  readonly numberOfVoltageMeasurements: number
  readonly algorithmVersion?: string
  readonly voltages?: readonly ElectrocardiogramVoltage[]

  readonly metadata?: AnyMap
  readonly sourceRevision?: SourceRevision
}

export interface ElectrocardiogramSamplesWithAnchorResponse {
  readonly samples: readonly ElectrocardiogramSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface ECGQueryOptionsWithSortOrder
  extends QueryOptionsWithSortOrder {
  readonly includeVoltages?: boolean // default false
}
export interface ECGQueryOptionsWithAnchor extends QueryOptionsWithAnchor {
  readonly includeVoltages: boolean // require explicit choice
}
