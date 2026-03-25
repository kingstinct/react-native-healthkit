import type { UnitForIdentifierGenerated } from '../generated/healthkit.generated'
import {
  HeartRateMotionContext,
  InsulinDeliveryReason,
} from '../generated/healthkit.generated'
import type { SourceProxy } from '../specs/SourceProxy.nitro'
import type { QuantitySample, QuantitySampleTyped } from './QuantitySample'
import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { FilterForSamples } from './QueryOptions'
import type { DeletedSample } from './Shared'

export { HeartRateMotionContext, InsulinDeliveryReason }

interface QuantityDateInterval {
  readonly from: Date
  readonly to: Date
}

export interface QueryStatisticsResponse {
  readonly averageQuantity?: Quantity
  readonly maximumQuantity?: Quantity
  readonly minimumQuantity?: Quantity
  readonly sumQuantity?: Quantity
  readonly mostRecentQuantity?: Quantity
  readonly mostRecentQuantityDateInterval?: QuantityDateInterval
  readonly duration?: Quantity
  readonly startDate?: Date
  readonly endDate?: Date
  sources: SourceProxy[]
}

export interface QueryStatisticsResponseFromSingleSource
  extends Omit<QueryStatisticsResponse, 'sources'> {
  readonly source: SourceProxy
}

export enum AggregationStyle {
  cumulative = 0,
  discreteArithmetic = 1,
  discreteTemporallyWeighted = 2,
  discreteEquivalentContinuousLevel = 3,
}

export interface QuantitySamplesWithAnchorResponse {
  readonly samples: readonly QuantitySample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface QuantitySamplesWithAnchorResponseTyped<
  T extends QuantityTypeIdentifier,
> {
  readonly samples: readonly QuantitySampleTyped<T>[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface Quantity {
  readonly unit: string
  readonly quantity: number
}

export interface IntervalComponents {
  readonly minute?: number
  readonly hour?: number
  readonly day?: number
  readonly month?: number
  readonly year?: number
}

export interface StatisticsQueryOptions {
  filter?: FilterForSamples
  unit?: string
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstatisticsoptions Apple Docs }
 */
export type StatisticsOptions =
  | 'cumulativeSum'
  | 'discreteAverage'
  | 'discreteMax'
  | 'discreteMin'
  | 'duration'
  | 'mostRecent'

export type UnitForIdentifier<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = UnitForIdentifierGenerated<T>
