import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { InterfaceAssertion } from '../types/InterfaceVerification'
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
  StatisticsQueryOptionsWithStringUnit,
  UnitForIdentifier,
} from '../types/QuantityType'
import type {
  QuantityTypeIdentifier,
  QuantityTypeIdentifierWriteable,
} from '../types/QuantityTypeIdentifier'
import type {
  QueryOptionsWithAnchorAndStringUnit,
  QueryOptionsWithAnchorAndUnit,
  QueryOptionsWithSortOrderAndStringUnit,
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
    options: QueryOptionsWithSortOrderAndStringUnit,
  ): Promise<readonly QuantitySample[]>

  queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptionsWithStringUnit,
  ): Promise<QueryStatisticsResponse>

  queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptionsWithStringUnit,
  ): Promise<readonly QueryStatisticsResponse[]>

  queryStatisticsForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptionsWithStringUnit,
  ): Promise<QueryStatisticsResponseFromSingleSource[]>

  queryStatisticsCollectionForQuantitySeparateBySource(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptionsWithStringUnit,
  ): Promise<readonly QueryStatisticsResponseFromSingleSource[]>

  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithAnchorAndStringUnit,
  ): Promise<QuantitySamplesWithAnchorResponse>
}

const _interfaceVerification: InterfaceAssertion<
  QuantityTypeModule,
  QuantityTypeModuleTyped,
  keyof HybridObject<{ ios: 'swift' }>
> = true

export interface QuantityTypeModuleTyped {
  isQuantityCompatibleWithUnit<T extends QuantityTypeIdentifier>(
    identifier: T,
    unit: UnitForIdentifier<T>,
  ): boolean

  aggregationStyle(identifier: QuantityTypeIdentifier): AggregationStyle

  saveQuantitySample<T extends QuantityTypeIdentifierWriteable>(
    identifier: T,
    unit: UnitForIdentifier<T>,
    value: number,
    start: Date,
    end: Date,
    metadata?: MetadataForQuantityIdentifier<T>,
  ): Promise<QuantitySampleTyped<T> | undefined>

  queryQuantitySamples<T extends QuantityTypeIdentifier>(
    identifier: T,
    options: QueryOptionsWithSortOrderAndUnit<UnitForIdentifier<T>>,
  ): Promise<readonly QuantitySampleTyped<T>[]>

  queryStatisticsForQuantity<T extends QuantityTypeIdentifier>(
    identifier: T,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions<UnitForIdentifier<T>>,
  ): Promise<QueryStatisticsResponse>

  queryStatisticsCollectionForQuantity<T extends QuantityTypeIdentifier>(
    identifier: T,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions<UnitForIdentifier<T>>,
  ): Promise<readonly QueryStatisticsResponse[]>

  queryStatisticsForQuantitySeparateBySource<T extends QuantityTypeIdentifier>(
    identifier: T,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions<UnitForIdentifier<T>>,
  ): Promise<QueryStatisticsResponseFromSingleSource[]>

  queryStatisticsCollectionForQuantitySeparateBySource<
    T extends QuantityTypeIdentifier,
  >(
    identifier: T,
    statistics: readonly StatisticsOptions[],
    anchorDate: Date,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions<UnitForIdentifier<T>>,
  ): Promise<readonly QueryStatisticsResponseFromSingleSource[]>

  queryQuantitySamplesWithAnchor<T extends QuantityTypeIdentifier>(
    identifier: T,
    options: QueryOptionsWithAnchorAndUnit<UnitForIdentifier<T>>,
  ): Promise<QuantitySamplesWithAnchorResponseTyped<T>>
}
