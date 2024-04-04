import {
  useCallback, useEffect, useRef, useState,
} from 'react'

import getRequestStatusForAuthorization from '../utils/getRequestStatusForAuthorization'
import requestAuthorization from '../utils/requestAuthorization'

import type { HealthkitReadAuthorization, HealthkitWriteAuthorization, HKAuthorizationRequestStatus } from '../native-types'

/**
   * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
   * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
   */
const useHealthkitAuthorization = (read: readonly HealthkitReadAuthorization[], write?: readonly HealthkitWriteAuthorization[]) => {
  const [status, setStatus] = useState<HKAuthorizationRequestStatus | null>(null)

  const readMemo = useRef(read)
  const writeMemo = useRef(write)

  useEffect(() => {
    readMemo.current = read
    writeMemo.current = write
  }, [read, write])

  const refreshAuthStatus = useCallback(async () => {
    const auth = await getRequestStatusForAuthorization(readMemo.current, writeMemo.current)

    setStatus(auth)
    return auth
  }, [])

  const request = useCallback(async () => {
    await requestAuthorization(readMemo.current, writeMemo.current)
    return refreshAuthStatus()
  }, [refreshAuthStatus])

  useEffect(() => {
    void refreshAuthStatus()
  }, [refreshAuthStatus])

  return [status, request] as const
}

export default useHealthkitAuthorization
