import type { AnyMap } from 'react-native-nitro-modules'
import type { Device } from './Device'
import type { SourceRevision } from './Source'

export interface DeletedSample {
  readonly uuid: string
  readonly metadata?: AnyMap
}

export interface SampleType {
  readonly identifier: string
  readonly allowsRecalibrationForEstimates: boolean
  readonly isMinimumDurationRestricted: boolean
  readonly isMaximumDurationRestricted: boolean
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject Apple Docs }
 */
export interface BaseObject {
  readonly uuid: string
  readonly sourceRevision: SourceRevision
  readonly device?: Device
  readonly metadata: AnyMap
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hksample Apple Docs }
 */
export interface BaseSample extends BaseObject {
  readonly sampleType: SampleType
  readonly startDate: Date
  readonly endDate: Date
  readonly hasUndeterminedDuration: boolean
}
