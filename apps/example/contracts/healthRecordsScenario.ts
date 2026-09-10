import {
  AllClinicalTypeIdentifiers,
  AuthorizationRequestStatus,
  authorizationStatusFor,
  type ClinicalRecord,
  type ClinicalTypeIdentifier,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  parseFHIRResourceData,
  queryClinicalRecords,
  queryClinicalRecordsWithAnchor,
  requestAuthorization,
  subscribeToClinicalRecordChanges,
  supportsHealthRecords,
} from '@react-native-healthkit/health-records'
import {
  type ContractScenario,
  failure,
  success,
} from '@/contracts/scenarioResult'

export type HealthRecordsScenarioId = 'health-records-smoke'

const AUTH_PROMPT_TIMEOUT_MS = 20_000

function assertRecordShape(
  record: ClinicalRecord,
  expected: ClinicalTypeIdentifier,
) {
  const where = `record ${record.uuid}`
  if (typeof record.uuid !== 'string' || record.uuid.length === 0) {
    throw new Error(`${where}: uuid missing`)
  }
  if (record.clinicalType !== expected) {
    throw new Error(
      `${where}: clinicalType ${record.clinicalType} !== queried ${expected}`,
    )
  }
  if (typeof record.displayName !== 'string') {
    throw new Error(`${where}: displayName is not a string`)
  }
  if (
    !(record.startDate instanceof Date) ||
    !(record.endDate instanceof Date) ||
    Number.isNaN(record.startDate.getTime())
  ) {
    throw new Error(`${where}: startDate/endDate are not valid Dates`)
  }
  if (typeof record.sourceRevision?.source?.bundleIdentifier !== 'string') {
    throw new Error(`${where}: sourceRevision.source missing`)
  }
  if (record.fhirResource) {
    const { fhirResource } = record
    if (typeof fhirResource.resourceType !== 'string') {
      throw new Error(`${where}: fhirResource.resourceType is not a string`)
    }
    if (typeof fhirResource.identifier !== 'string') {
      throw new Error(`${where}: fhirResource.identifier is not a string`)
    }
    if (typeof fhirResource.fhirVersion?.stringRepresentation !== 'string') {
      throw new Error(`${where}: fhirResource.fhirVersion missing`)
    }
    const parsed = parseFHIRResourceData(record)
    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`${where}: fhirResource.data did not parse to an object`)
    }
    if (parsed.resourceType !== fhirResource.resourceType) {
      throw new Error(
        `${where}: FHIR JSON resourceType ${String(parsed.resourceType)} !== ${fhirResource.resourceType}`,
      )
    }
  }
}

export const healthRecordsScenario: ContractScenario<HealthRecordsScenarioId> =
  {
    id: 'health-records-smoke',
    title: 'Health Records smoke test',
    run: async () => {
      const id = healthRecordsScenario.id
      const title = healthRecordsScenario.title
      const details: string[] = []
      const payload: Record<string, unknown> = {}

      try {
        payload.isHealthDataAvailable = isHealthDataAvailable()
        payload.supportsHealthRecords = supportsHealthRecords()
        details.push(`supportsHealthRecords: ${payload.supportsHealthRecords}`)

        const before = await getRequestStatusForAuthorization(
          AllClinicalTypeIdentifiers,
        )
        payload.requestStatusBefore = AuthorizationRequestStatus[before]

        if (before === AuthorizationRequestStatus.shouldRequest) {
          // A system prompt may appear; do not hang the run forever on it.
          const granted = await Promise.race([
            requestAuthorization(AllClinicalTypeIdentifiers),
            new Promise<'timeout'>((resolve) =>
              setTimeout(() => resolve('timeout'), AUTH_PROMPT_TIMEOUT_MS),
            ),
          ])
          payload.requestAuthorization = granted
          details.push(`requestAuthorization: ${String(granted)}`)
        }

        payload.requestStatusAfter =
          AuthorizationRequestStatus[
            await getRequestStatusForAuthorization(AllClinicalTypeIdentifiers)
          ]

        payload.authorizationStatus = Object.fromEntries(
          AllClinicalTypeIdentifiers.map((type) => [
            type,
            authorizationStatusFor(type),
          ]),
        )

        const counts: Record<string, number> = {}
        const errors: Record<string, string> = {}
        const fhirResourceTypes = new Set<string>()
        let total = 0
        for (const type of AllClinicalTypeIdentifiers) {
          try {
            const records = await queryClinicalRecords(type, {
              limit: 0,
              ascending: false,
            })
            counts[type] = records.length
            total += records.length
            for (const record of records) {
              assertRecordShape(record, type)
              if (record.fhirResource) {
                fhirResourceTypes.add(record.fhirResource.resourceType)
              }
            }
          } catch (error) {
            // HealthKit throws "Authorization not determined" for types the
            // user was never asked about (the simulator does not support every
            // clinical type). Record it and keep going.
            errors[type] =
              error instanceof Error ? error.message : String(error)
          }
        }
        payload.counts = counts
        payload.queryErrors = errors
        payload.fhirResourceTypes = [...fhirResourceTypes]
        const queried = Object.keys(counts)
        details.push(
          `records: ${total} across ${queried.length}/${AllClinicalTypeIdentifiers.length} queryable types`,
        )
        if (total === 0) {
          details.push(
            'no clinical records on this device; shape checks were skipped',
          )
        }
        if (queried.length === 0) {
          throw new Error(
            `no clinical type could be queried: ${JSON.stringify(errors)}`,
          )
        }

        // Anchored query: first page returns an anchor, replaying it yields nothing new.
        const anchorType = (Object.entries(counts).find(
          ([, count]) => count > 0,
        )?.[0] ?? queried[0]) as ClinicalTypeIdentifier
        const first = await queryClinicalRecordsWithAnchor(anchorType, {
          limit: 0,
        })
        if (
          typeof first.newAnchor !== 'string' ||
          first.newAnchor.length === 0
        ) {
          throw new Error('anchored query did not return an anchor')
        }
        if (first.records.length !== counts[anchorType]) {
          throw new Error(
            `anchored query returned ${first.records.length} records, sample query returned ${counts[anchorType]}`,
          )
        }
        const replay = await queryClinicalRecordsWithAnchor(anchorType, {
          limit: 0,
          anchor: first.newAnchor,
        })
        if (replay.records.length !== 0 || replay.deletedRecords.length !== 0) {
          throw new Error(
            `replaying the anchor returned ${replay.records.length} records and ${replay.deletedRecords.length} deletions`,
          )
        }
        payload.anchored = {
          type: anchorType,
          firstPage: first.records.length,
          anchorLength: first.newAnchor.length,
        }

        // Filters: fhirResourceType and date predicates must at least be accepted.
        const filtered = await queryClinicalRecords(anchorType, {
          limit: 0,
          filter: {
            fhirResourceType: 'Observation',
            date: { startDate: new Date(2000, 0, 1) },
          },
        })
        const byUuid = first.records[0]
          ? await queryClinicalRecords(anchorType, {
              limit: 0,
              filter: { uuid: first.records[0].uuid },
            })
          : []
        if (first.records[0] && byUuid.length !== 1) {
          throw new Error(
            `uuid filter returned ${byUuid.length} records, expected 1`,
          )
        }
        payload.filters = {
          observationSince2000: filtered.length,
          byUuid: byUuid.length,
        }

        // Observer query lifecycle.
        const subscription = subscribeToClinicalRecordChanges(
          anchorType,
          () => {},
        )
        const removed = subscription.remove()
        if (removed !== true) {
          throw new Error('unsubscribing the observer query returned false')
        }
        const removedAgain = subscription.remove()
        if (removedAgain !== false) {
          throw new Error('unsubscribing twice should return false')
        }
        payload.subscription = 'ok'

        return success(id, title, payload, details)
      } catch (error) {
        return failure(id, title, error, payload)
      }
    },
  }
