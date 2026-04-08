import type { KnownSampleMetadata } from '../generated/healthkit.generated'
import type { CategorySample, CategorySampleForSaving } from './CategoryType'
import type { QuantitySample, QuantitySampleForSaving } from './QuantitySample'
import type { BaseSample, DeletedSample, WithTypedMetadata } from './Shared'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcorrelationtypeidentifier Apple Docs }
 */
export type CorrelationTypeIdentifier =
  | 'HKCorrelationTypeIdentifierBloodPressure'
  | 'HKCorrelationTypeIdentifierFood'

type CorrelationObject = CategorySample | QuantitySample

export interface CorrelationSample extends BaseSample {
  readonly correlationType: CorrelationTypeIdentifier
  readonly objects: readonly CorrelationObject[]
}

export type CorrelationSampleTyped = WithTypedMetadata<
  CorrelationSample,
  KnownSampleMetadata
>

export type SampleForSaving = CategorySampleForSaving | QuantitySampleForSaving

export interface QueryCorrelationSamplesWithAnchorResponse {
  readonly correlations: readonly CorrelationSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface QueryCorrelationSamplesWithAnchorResponseTyped {
  readonly correlations: readonly CorrelationSampleTyped[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
