import type {
  DateFilter,
  PredicateWithMetadataKey,
} from '@react-native-healthkit/core'
import type { FHIRResourceType } from './FHIR'

export { ComparisonPredicateOperator } from '@react-native-healthkit/core'
export type { DateFilter, PredicateWithMetadataKey }

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
