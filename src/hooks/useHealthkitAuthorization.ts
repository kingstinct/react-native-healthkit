import { useCallback, useEffect, useState } from 'react'

import getRequestStatusForAuthorization from '../utils/getRequestStatusForAuthorization'
import requestAuthorization from '../utils/requestAuthorization'

import type { HealthkitReadAuthorization, HealthkitWriteAuthorization, HKAuthorizationRequestStatus } from '../native-types'

const useHealthkitAuthorization = (read: readonly HealthkitReadAuthorization[], write?: readonly HealthkitWriteAuthorization[]) => {
  const [status, setStatus] = useState<HKAuthorizationRequestStatus | null>(null)
  const refreshAuthStatus = useCallback(async () => {
    const auth = await getRequestStatusForAuthorization(read, write)
    setStatus(auth)
    return auth
  }, [])

  const request = useCallback(async () => {
    await requestAuthorization(read, write)
    return refreshAuthStatus()
  }, [])

  useEffect(() => {
    void refreshAuthStatus()
  }, [])

  return [status, request] as const
}

export default useHealthkitAuthorization
