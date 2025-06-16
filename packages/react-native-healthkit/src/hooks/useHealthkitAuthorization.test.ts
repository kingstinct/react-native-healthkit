import { beforeAll, describe, expect, jest, test } from 'bun:test'

import { act, renderHook } from '@testing-library/react-native'

import { Core } from '../modules'
import waitForNextUpdate from '../test-utils'
import { AuthorizationRequestStatus } from '../types/Auth'
import type UseHealthkitAuthorization from './useHealthkitAuthorization'

describe('useHealthkitAuthorization', () => {
  let useHealthkitAuthorization: typeof UseHealthkitAuthorization

  beforeAll(async () => {
    useHealthkitAuthorization = (await import('./useHealthkitAuthorization'))
      .default
  })

  test('should return shouldRequest', async () => {
    jest
      .spyOn(Core, 'getRequestStatusForAuthorization')
      .mockReturnValue(
        Promise.resolve(AuthorizationRequestStatus.shouldRequest),
      )

    const { result } = renderHook(() =>
      useHealthkitAuthorization(['HKCategoryTypeIdentifierAbdominalCramps']),
    )

    await waitForNextUpdate()

    expect(result.current[0]).toBe(AuthorizationRequestStatus.shouldRequest)
  })

  test('should request permissions', async () => {
    const spy = jest
      .spyOn(Core, 'getRequestStatusForAuthorization')
      .mockReturnValue(
        Promise.resolve(AuthorizationRequestStatus.shouldRequest),
      )
    jest
      .spyOn(Core, 'requestAuthorization')
      .mockReturnValue(Promise.resolve(true))

    const { result } = renderHook(() =>
      useHealthkitAuthorization(['HKCategoryTypeIdentifierAbdominalCramps']),
    )

    await waitForNextUpdate()

    spy.mockReturnValue(Promise.resolve(AuthorizationRequestStatus.unnecessary))

    let retVal: AuthorizationRequestStatus | undefined
    await act(async () => {
      const r =
        (await result.current[1]()) as unknown as AuthorizationRequestStatus
      retVal = r
    })

    expect(result.current[0]).toBe(AuthorizationRequestStatus.unnecessary)
    expect(retVal).toBe(AuthorizationRequestStatus.unnecessary)
  })

  test('should return unnecessary', async () => {
    jest
      .spyOn(Core, 'getRequestStatusForAuthorization')
      .mockReturnValue(Promise.resolve(AuthorizationRequestStatus.unnecessary))

    const { result } = renderHook(() =>
      useHealthkitAuthorization(['HKCategoryTypeIdentifierAbdominalCramps']),
    )

    await waitForNextUpdate()

    expect(result.current[0]).toBe(AuthorizationRequestStatus.unnecessary)
  })

  test('should return null before initalizing', async () => {
    const { result } = renderHook(() =>
      useHealthkitAuthorization(['HKCategoryTypeIdentifierAbdominalCramps']),
    )

    expect(result.current[0]).toBe(null)

    await waitForNextUpdate()
  })
})
