import { useCallback, useEffect, useRef, useState } from 'react'

import { HealthRecords } from '../modules'
import type { AuthorizationRequestStatus } from '../types/Auth'
import type { ClinicalTypeIdentifier } from '../types/ClinicalTypeIdentifier'

/**
 * @description Hook to retrieve the current authorization status for the given clinical record types, and request authorization if needed.
 * @see {@link https://developer.apple.com/documentation/healthkit/accessing-health-records Apple Docs - Accessing Health Records}
 */
export const useHealthRecordsAuthorization = (
  toRead: readonly ClinicalTypeIdentifier[],
) => {
  const [status, setStatus] = useState<AuthorizationRequestStatus | null>(null)

  const readMemo = useRef(toRead)

  useEffect(() => {
    readMemo.current = toRead
  }, [toRead])

  const refreshAuthStatus = useCallback(async () => {
    const auth = await HealthRecords.getRequestStatusForAuthorization(
      readMemo.current,
    )

    setStatus(auth)
    return auth
  }, [])

  const request = useCallback(async () => {
    await HealthRecords.requestAuthorization(readMemo.current)
    return refreshAuthStatus()
  }, [refreshAuthStatus])

  useEffect(() => {
    void refreshAuthStatus()
  }, [refreshAuthStatus])

  return [status, request] as const
}

export default useHealthRecordsAuthorization
