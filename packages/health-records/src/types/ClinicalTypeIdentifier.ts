/**
 * Identifiers for the clinical record types HealthKit can hold.
 *
 * Clinical records are read-only; apps can never write them. Each identifier
 * maps to a constant on `HKClinicalTypeIdentifier`.
 *
 * @see {@link https://developer.apple.com/documentation/healthkit/hkclinicaltypeidentifier Apple Docs }
 */
export type ClinicalTypeIdentifier =
  /** Records of allergic or intolerant reactions. */
  | 'HKClinicalTypeIdentifierAllergyRecord'
  /** Records of clinical notes (iOS 16.4+). */
  | 'HKClinicalTypeIdentifierClinicalNoteRecord'
  /** Records of a condition, problem, diagnosis, or other event. */
  | 'HKClinicalTypeIdentifierConditionRecord'
  /** Records containing information about the user's insurance coverage (iOS 14+). */
  | 'HKClinicalTypeIdentifierCoverageRecord'
  /** Records of the current or historical administration of vaccines. */
  | 'HKClinicalTypeIdentifierImmunizationRecord'
  /** Records of lab results. */
  | 'HKClinicalTypeIdentifierLabResultRecord'
  /** Records of medication. */
  | 'HKClinicalTypeIdentifierMedicationRecord'
  /** Records of procedures. */
  | 'HKClinicalTypeIdentifierProcedureRecord'
  /** Records of vital signs. */
  | 'HKClinicalTypeIdentifierVitalSignRecord'

export const AllClinicalTypeIdentifiers = [
  'HKClinicalTypeIdentifierAllergyRecord',
  'HKClinicalTypeIdentifierClinicalNoteRecord',
  'HKClinicalTypeIdentifierConditionRecord',
  'HKClinicalTypeIdentifierCoverageRecord',
  'HKClinicalTypeIdentifierImmunizationRecord',
  'HKClinicalTypeIdentifierLabResultRecord',
  'HKClinicalTypeIdentifierMedicationRecord',
  'HKClinicalTypeIdentifierProcedureRecord',
  'HKClinicalTypeIdentifierVitalSignRecord',
] as const satisfies readonly ClinicalTypeIdentifier[]
