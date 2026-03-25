import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type {
  MetadataForQuantityIdentifier,
  QuantitySample,
  QuantitySampleTyped,
} from '../types/QuantitySample'
import type {
  AggregationStyle,
  IntervalComponents,
  QuantitySamplesWithAnchorResponse,
  QuantitySamplesWithAnchorResponseTyped,
  QueryStatisticsResponse,
  QueryStatisticsResponseFromSingleSource,
  StatisticsOptions,
  StatisticsQueryOptions,
} from '../types/QuantityType'
import type {
  QuantityTypeIdentifier,
  QuantityTypeIdentifierWriteable,
} from '../types/QuantityTypeIdentifier'
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
    identifier: QuantityTypeIdentifierWriteable,
    unit: string,
    value: number,
    start: Date,
    end: Date,
    metadata?: AnyMap,
  ): Promise<QuantitySample | undefined>

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

  queryStatisticsForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions,
  ): Promise<QueryStatisticsResponseFromSingleSource[]>

  queryStatisticsCollectionForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions,
  ): Promise<readonly QueryStatisticsResponseFromSingleSource[]>

  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithAnchorAndUnit,
  ): Promise<QuantitySamplesWithAnchorResponse>
}

export interface QuantityTypeModuleTyped {
  isQuantityCompatibleWithUnit(
    identifier: QuantityTypeIdentifier,
    unit: string,
  ): boolean

  aggregationStyle(identifier: QuantityTypeIdentifier): AggregationStyle

  saveQuantitySample<T extends QuantityTypeIdentifierWriteable>(
    identifier: T,
    unit: string,
    value: number,
    start: Date,
    end: Date,
    metadata?: MetadataForQuantityIdentifier<T>,
  ): Promise<QuantitySampleTyped<T> | undefined>

  queryQuantitySamples<T extends QuantityTypeIdentifier>(
    identifier: T,
    options: QueryOptionsWithSortOrderAndUnit,
  ): Promise<readonly QuantitySampleTyped<T>[]>

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

  queryStatisticsForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions,
  ): Promise<QueryStatisticsResponseFromSingleSource[]>

  queryStatisticsCollectionForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions,
  ): Promise<readonly QueryStatisticsResponseFromSingleSource[]>

  queryQuantitySamplesWithAnchor<T extends QuantityTypeIdentifier>(
    identifier: T,
    options: QueryOptionsWithAnchorAndUnit,
  ): Promise<QuantitySamplesWithAnchorResponseTyped<T>>
}
