import type { CategorySample, CategorySampleForSaving } from './CategoryType'
import type { QuantitySample, QuantitySampleForSaving } from './QuantitySample'
import type { BaseSample, DeletedSample } from './Shared'

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

  readonly metadataFoodType?: string
}

export type SampleForSaving = CategorySampleForSaving | QuantitySampleForSaving

export interface QueryCorrelationSamplesWithAnchorResponse {
  readonly correlations: readonly CorrelationSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
