import type { FHIRResourceType } from './FHIR'

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

export interface DateFilter {
  readonly startDate?: Date
  readonly endDate?: Date
  readonly strictEndDate?: boolean
  readonly strictStartDate?: boolean
}

export interface FilterForClinicalRecordsBase {
  readonly uuid?: string
  readonly uuids?: string[]
  readonly metadata?: PredicateWithMetadataKey
  readonly date?: DateFilter
  /**
   * Only match records backed by a FHIR resource of this type.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquery/2994974-predicateforclinicalrecords Apple Docs }
   */
  readonly fhirResourceType?: FHIRResourceType
}

export interface FilterForClinicalRecords extends FilterForClinicalRecordsBase {
  OR?: FilterForClinicalRecordsBase[]
  NOT?: FilterForClinicalRecordsBase[]
  AND?: FilterForClinicalRecordsBase[]
}

/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
  filter?: FilterForClinicalRecords
  /**
   * Specify -1, 0 or any non-positive number for fetching all records
   * */
  readonly limit: number
}

export interface QueryOptionsWithAnchor extends GenericQueryOptions {
  readonly anchor?: string
}

export interface QueryOptionsWithSortOrder extends GenericQueryOptions {
  readonly ascending?: boolean
}
