/**
 * The FHIR resource types HealthKit exposes for clinical records. The values
 * are the raw `HKFHIRResourceType` strings, which equal the FHIR resource
 * names.
 *
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfhirresourcetype Apple Docs }
 */
export type FHIRResourceType =
  | 'AllergyIntolerance'
  | 'Condition'
  | 'Coverage'
  | 'DiagnosticReport'
  | 'DocumentReference'
  | 'Immunization'
  | 'MedicationDispense'
  | 'MedicationOrder'
  | 'MedicationRequest'
  | 'MedicationStatement'
  | 'Observation'
  | 'Procedure'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfhirrelease Apple Docs }
 */
export type FHIRRelease = 'DSTU2' | 'R4' | 'unknown'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfhirversion Apple Docs }
 */
export interface FHIRVersion {
  readonly release: FHIRRelease
  readonly majorVersion: number
  readonly minorVersion: number
  readonly patchVersion: number
  /** The version as a string, for example `"4.0.1"`. */
  readonly stringRepresentation: string
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfhirresource Apple Docs }
 */
export interface FHIRResource {
  /**
   * The FHIR resource type, see {@link FHIRResourceType} for the known values.
   * Kept as a plain string so records with resource types added in future OS
   * versions are still returned.
   */
  readonly resourceType: string
  /** The identifier of the resource, unique for its source. */
  readonly identifier: string
  /** The full URL of the FHIR resource on the issuing server, if known. */
  readonly sourceURL?: string
  /**
   * The FHIR resource as a JSON string. Parse it with `JSON.parse` or
   * `parseFHIRResourceData` from this package.
   */
  readonly data: string
  /** The FHIR version of the resource. */
  readonly fhirVersion: FHIRVersion
}
