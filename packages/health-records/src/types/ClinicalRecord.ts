import type { ClinicalTypeIdentifier } from './ClinicalTypeIdentifier'
import type { FHIRResource } from './FHIR'
import type { BaseSample, DeletedSample } from './Shared'

/**
 * A clinical record downloaded from a healthcare institution.
 *
 * @see {@link https://developer.apple.com/documentation/healthkit/hkclinicalrecord Apple Docs }
 */
export interface ClinicalRecord extends BaseSample {
  readonly clinicalType: ClinicalTypeIdentifier
  /** The primary display name as shown in the Health app. */
  readonly displayName: string
  /**
   * The FHIR data for the record. Only absent if the record was not backed by
   * a FHIR resource, which should not happen for records synced from a provider.
   */
  readonly fhirResource?: FHIRResource
}

export interface ClinicalRecordsWithAnchorResponse {
  readonly records: readonly ClinicalRecord[]
  readonly deletedRecords: readonly DeletedSample[]
  readonly newAnchor: string
}
