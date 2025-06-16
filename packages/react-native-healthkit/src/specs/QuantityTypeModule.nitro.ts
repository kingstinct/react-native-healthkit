import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QuantitySample } from '../types/QuantitySample'
import type {
  IntervalComponents,
  QuantitySamplesWithAnchorResponse,
  QueryStatisticsResponse,
  StatisticsOptions,
  StatisticsQueryOptions,
} from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import type {
  FilterForSamples,
  QueryOptionsWithAnchorAndUnit,
  QueryOptionsWithSortOrderAndUnit,
} from '../types/QueryOptions'

export interface QuantityTypeModule extends HybridObject<{ ios: 'swift' }> {
  isQuantityCompatibleWithUnit(
    identifier: QuantityTypeIdentifier,
    unit: string,
  ): boolean

  saveQuantitySample(
    identifier: QuantityTypeIdentifier,
    unit: string,
    value: number,
    start: Date,
    end: Date,
    metadata: AnyMap,
  ): Promise<boolean>

  deleteQuantitySamples(
    identifier: QuantityTypeIdentifier,
    filter: FilterForSamples,
  ): Promise<boolean>

  queryQuantitySamples(
    identifier: QuantityTypeIdentifier,
    options?: QueryOptionsWithSortOrderAndUnit,
  ): Promise<readonly QuantitySample[]>

  queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions,
  ): Promise<QueryStatisticsResponse>

  queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: string,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions,
  ): Promise<readonly QueryStatisticsResponse[]>

  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithAnchorAndUnit,
  ): Promise<QuantitySamplesWithAnchorResponse>
}
