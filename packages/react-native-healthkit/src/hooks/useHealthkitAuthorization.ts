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
export const useHealthkitAuthorization = ({
  toWrite,
  toRead,
}: {
  toRead?: readonly ObjectTypeIdentifier[]
  toWrite?: readonly SampleTypeIdentifierWriteable[]
}) => {
  const [status, setStatus] = useState<AuthorizationRequestStatus | null>(null)

  const readMemo = useRef(toRead)
  const writeMemo = useRef(toWrite)

  useEffect(() => {
    readMemo.current = toRead
    writeMemo.current = toWrite
  }, [toRead, toWrite])

  const refreshAuthStatus = useCallback(async () => {
    const auth = await Core.getRequestStatusForAuthorization({
      toShare: writeMemo.current,
      toRead: readMemo.current,
    })

    setStatus(auth)
    return auth
  }, [])

  const request = useCallback(async () => {
    await Core.requestAuthorization({
      toShare: writeMemo.current,
      toRead: readMemo.current,
    })
    return refreshAuthStatus()
  }, [refreshAuthStatus])

  useEffect(() => {
    void refreshAuthStatus()
  }, [refreshAuthStatus])

  return [status, request] as const
}

export default useHealthkitAuthorization
