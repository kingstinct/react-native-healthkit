import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QuantitySample } from '../types/QuantitySample'
import type {
  AggregationStyle,
  IntervalComponents,
  QuantitySamplesWithAnchorResponse,
  QueryStatisticsResponse,
  StatisticsOptions,
  StatisticsQueryOptions,
} from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import type {
  QueryOptionsWithAnchorAndUnit,
  QueryOptionsWithSortOrderAndUnit,
} from '../types/QueryOptions'

export interface QuantityTypeModule extends HybridObject<{ ios: 'swift' }> {
  isQuantityCompatibleWithUnit(
    identifier: QuantityTypeIdentifier,
    unit: string,
  ): boolean

  aggregationStyle(identifier: QuantityTypeIdentifier): AggregationStyle

  saveQuantitySample(
    identifier: QuantityTypeIdentifier,
    unit: string,
    value: number,
    start: Date,
    end: Date,
    metadata?: AnyMap,
  ): Promise<QuantitySample | null>

  queryQuantitySamples(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithSortOrderAndUnit,
  ): Promise<readonly QuantitySample[]>

  queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions,
  ): Promise<QueryStatisticsResponse>

  queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions,
  ): Promise<readonly QueryStatisticsResponse[]>

  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithAnchorAndUnit,
  ): Promise<QuantitySamplesWithAnchorResponse>
}
