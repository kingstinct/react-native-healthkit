import type {
  DateFilter,
  PredicateWithMetadataKey,
  StrictUnion,
} from '@react-native-healthkit/core'
import type { SourceProxy } from '../specs/SourceProxy.nitro'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'

export { ComparisonPredicateOperator } from '@react-native-healthkit/core'
export type { DateFilter, PredicateWithMetadataKey, StrictUnion }

export interface FilterForSamplesBase {
  readonly uuid?: string
  readonly uuids?: string[]
  readonly metadata?: PredicateWithMetadataKey
  readonly date?: DateFilter
  readonly workout?: WorkoutProxy
  sources?: SourceProxy[]
}

export interface FilterForSamples extends FilterForSamplesBase {
  sources?: SourceProxy[]
  OR?: FilterForSamplesBase[]
  NOT?: FilterForSamplesBase[]
  AND?: FilterForSamplesBase[]
}

/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
  filter?: FilterForSamples
  /**
   * Specify -1, 0 or any non-positive number for fetching all samples
   * */
  readonly limit: number
}

export interface QueryOptionsWithAnchor extends GenericQueryOptions {
  readonly anchor?: string
}

export interface QueryOptionsWithSortOrder extends GenericQueryOptions {
  readonly ascending?: boolean
}

export interface QueryOptionsWithSortOrderAndUnit<TUnit extends string = string>
  extends QueryOptionsWithSortOrder {
  readonly unit?: TUnit
}

export interface QueryOptionsWithAnchorAndUnit<TUnit extends string = string>
  extends QueryOptionsWithAnchor {
  readonly unit?: TUnit
}

export interface QueryOptionsWithSortOrderAndStringUnit
  extends QueryOptionsWithSortOrderAndUnit<string> {}

export interface QueryOptionsWithAnchorAndStringUnit
  extends QueryOptionsWithAnchorAndUnit<string> {}
