import { useCallback, useEffect, useRef, useState } from 'react'

import { Core } from '../modules'
import type { AuthorizationRequestStatus } from '../types/Auth'
import type {
  ObjectTypeIdentifier,
  SampleTypeIdentifierWriteable,
} from '../types/Shared'

/**
 * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
 * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
 */
export const useHealthkitAuthorization = (
  read: readonly ObjectTypeIdentifier[],
  write?: readonly SampleTypeIdentifierWriteable[],
) => {
  const [status, setStatus] = useState<AuthorizationRequestStatus | null>(null)

  const readMemo = useRef(read)
  const writeMemo = useRef(write)

  useEffect(() => {
    readMemo.current = read
    writeMemo.current = write
  }, [read, write])

  const refreshAuthStatus = useCallback(async () => {
    const auth = await Core.getRequestStatusForAuthorization(
      writeMemo.current ?? [],
      readMemo.current,
    )

    setStatus(auth)
    return auth
  }, [])

  const request = useCallback(async () => {
    await Core.requestAuthorization(writeMemo.current ?? [], readMemo.current)
    return refreshAuthStatus()
  }, [refreshAuthStatus])

  useEffect(() => {
    void refreshAuthStatus()
  }, [refreshAuthStatus])

  return [status, request] as const
}

export default useHealthkitAuthorization
