import type { AnyMap } from 'react-native-nitro-modules'

export interface DeletedSample {
  readonly uuid: string
  readonly metadata?: AnyMap
}

export interface Source {
  readonly name: string
  readonly bundleIdentifier: string
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface SourceRevision {
  readonly source: Source
  readonly version?: string
  readonly operatingSystemVersion: string
  readonly productType?: string
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface Device {
  readonly name?: string
  readonly firmwareVersion?: string
  readonly hardwareVersion?: string
  readonly localIdentifier?: string
  readonly manufacturer?: string
  readonly model?: string
  readonly softwareVersion?: string
  readonly udiDeviceIdentifier?: string
}

export interface SampleType {
  readonly identifier: string
  readonly allowsRecalibrationForEstimates: boolean
  readonly isMinimumDurationRestricted: boolean
  readonly isMaximumDurationRestricted: boolean
}

export interface BaseObject {
  readonly uuid: string
  readonly sourceRevision: SourceRevision
  readonly device?: Device
  readonly metadata: AnyMap
}

export interface BaseSample extends BaseObject {
  readonly sampleType: SampleType
  readonly startDate: Date
  readonly endDate: Date
  readonly hasUndeterminedDuration: boolean
}
