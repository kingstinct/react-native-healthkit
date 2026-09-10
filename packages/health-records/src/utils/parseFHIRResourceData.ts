import type { ClinicalRecord, FHIRResource } from '../types'

/**
 * Parses the JSON payload of a FHIR resource. Accepts either a resource or a
 * whole clinical record; returns `undefined` for records without FHIR data.
 *
 * The generic parameter lets you assert the FHIR shape you expect, for
 * example a `Patient` or `Observation` type from a FHIR typings package.
 */
export function parseFHIRResourceData<T = Record<string, unknown>>(
  source: ClinicalRecord | FHIRResource | undefined,
): T | undefined {
  if (!source) {
    return undefined
  }
  const resource = 'clinicalType' in source ? source.fhirResource : source
  if (!resource) {
    return undefined
  }
  return JSON.parse(resource.data) as T
}
