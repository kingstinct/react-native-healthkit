import {
  useCallback, useEffect, useRef, useState,
} from 'react'

import getRequestStatusForAuthorization from '../utils/getRequestStatusForAuthorization'
import requestAuthorization from '../utils/requestAuthorization'

import type { HealthkitReadAuthorization, HealthkitWriteAuthorization, HKAuthorizationRequestStatus } from '../native-types'

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
