import { useCallback, useEffect, useRef, useState } from 'react'
import { HealthRecords } from '../modules'
import type { ClinicalRecord } from '../types/ClinicalRecord'
import type { ClinicalTypeIdentifier } from '../types/ClinicalTypeIdentifier'
import type { QueryOptionsWithSortOrder } from '../types/QueryOptions'
import { subscribeToClinicalRecordChanges } from '../utils/subscribeToClinicalRecordChanges'

/**
 * Queries clinical records of one type and keeps the result up to date by
 * re-querying whenever HealthKit reports a change for that type.
 *
 * `options` is read on every fetch but does not retrigger fetching when it
 * changes identity; call the returned `refetch` for that.
 */
export function useClinicalRecords(
  clinicalType: ClinicalTypeIdentifier,
  options: QueryOptionsWithSortOrder = { limit: 0 },
) {
  const [records, setRecords] = useState<readonly ClinicalRecord[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const refetch = useCallback(async () => {
    try {
      const result = await HealthRecords.queryClinicalRecords(
        clinicalType,
        optionsRef.current,
      )
      setRecords(result)
      setError(null)
      return result
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      return null
    }
  }, [clinicalType])

  useEffect(() => {
    void refetch()
    const subscription = subscribeToClinicalRecordChanges(clinicalType, () => {
      void refetch()
    })
    return () => {
      subscription.remove()
    }
  }, [clinicalType, refetch])

  return { records, error, refetch } as const
}

export default useClinicalRecords
