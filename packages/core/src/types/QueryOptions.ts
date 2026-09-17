/**
 * Raw values match `NSComparisonPredicate.Operator`.
 * @see {@link https://developer.apple.com/documentation/foundation/nscomparisonpredicate/operator Apple Docs }
 */
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

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquery/1614771-predicateforsamples Apple Docs }
 */
export interface DateFilter {
  readonly startDate?: Date
  readonly endDate?: Date
  readonly strictEndDate?: boolean
  readonly strictStartDate?: boolean
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

/**
 * A union whose members cannot be mixed: keys of the other members are `never`.
 */
export type StrictUnion<U extends object> = _Strict<U>
