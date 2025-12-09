import type { SourceProxy } from '../specs/SourceProxy.nitro'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'

export enum ComparisonPredicateOperator {
  lessThan = 0,

  lessThanOrEqualTo = 1,

  greaterThan = 2,

  greaterThanOrEqualTo = 3,

  equalTo = 4,

  notEqualTo = 5,

  matches = 6,

  like = 7,

  beginsWith = 8,

  endsWith = 9,

  IN = 10,

  customSelector = 11,

  contains = 99,

  between = 100,
}

type PredicateWithMetadataValue = string | number | Date | boolean

export interface PredicateWithMetadataKey {
  readonly withMetadataKey: string
  readonly operatorType?: ComparisonPredicateOperator
  readonly value?: PredicateWithMetadataValue
}
// Computes and flattens object types
// biome-ignore lint/complexity/noBannedTypes: it works
type ComputeRaw<A> = A extends Function ? A : { [K in keyof A]: A[K] } & {}

// Gets all keys from a union of objects
// biome-ignore lint/suspicious/noExplicitAny: it works
type AllKeys<U> = U extends any ? keyof U : never

// The core: for each member U in the union,
// add `?: never` for any key that exists in other union members.
// biome-ignore lint/suspicious/noExplicitAny: it works
type _Strict<U, UAll extends U = U> = U extends any
  ? ComputeRaw<
      U & {
        [K in Exclude<AllKeys<UAll>, keyof U>]?: never
      }
    >
  : never

// The exported type you can copy into your codebase
export type StrictUnion<U extends object> = _Strict<U>

export interface DateFilter {
  readonly startDate?: Date
  readonly endDate?: Date
  readonly strictEndDate?: boolean
  readonly strictStartDate?: boolean
}

export interface FilterForSamplesBase {
  readonly uuid?: string
  readonly uuids?: string[]
  readonly metadata?: PredicateWithMetadataKey
  readonly date?: DateFilter
  readonly workout?: WorkoutProxy
  readonly sources?: SourceProxy[]
}

export interface FilterForSamples extends FilterForSamplesBase {
  readonly OR?: FilterForSamplesBase[]
  readonly NOT?: FilterForSamplesBase[]
  readonly AND?: FilterForSamplesBase[]
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

export interface QueryOptionsWithSortOrderAndUnit
  extends QueryOptionsWithSortOrder {
  readonly unit?: string
}

export interface QueryOptionsWithAnchorAndUnit extends QueryOptionsWithAnchor {
  readonly unit?: string
}
