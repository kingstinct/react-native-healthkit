import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'
import type { BaseSample, DeletedSample } from './Shared'

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

export interface ElectrocardiogramSample extends BaseSample {
  readonly classification: ElectrocardiogramClassification
  readonly symptomsStatus: ElectrocardiogramSymptomsStatus

  readonly averageHeartRateBpm?: number // HKQuantity (count/min)
  readonly samplingFrequencyHz?: number // HKQuantity (Hz)
  readonly numberOfVoltageMeasurements: number
  readonly voltages?: readonly ElectrocardiogramVoltage[]
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
