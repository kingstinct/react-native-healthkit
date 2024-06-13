import { renderHook, act } from '@testing-library/react-native'

import waitForNextUpdate from '../test-utils'

describe('useHealthkitAuthorization', () => {
  let NativeTypes: typeof import('../native-types')
  let useHealthkitAuthorization: typeof import('./useHealthkitAuthorization').default
  beforeAll(async () => {
    NativeTypes = await import('../native-types')
    useHealthkitAuthorization = (await import('./useHealthkitAuthorization')).default
  })

  test('should return shouldRequest', async () => {
    const { HKAuthorizationRequestStatus, HKCategoryTypeIdentifier, default: Native } = NativeTypes

    jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.shouldRequest))

    const { result } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]))

    await waitForNextUpdate()

    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.shouldRequest)
  })

  test('should request permissions', async () => {
    const { HKAuthorizationRequestStatus, HKCategoryTypeIdentifier, default: Native } = NativeTypes

    const spy = jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.shouldRequest))
    jest.spyOn(Native, 'requestAuthorization').mockReturnValue(Promise.resolve(true))

    const { result } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]))

    await waitForNextUpdate()

    spy.mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.unnecessary))

    let retVal: typeof HKAuthorizationRequestStatus | undefined
    await act(async () => {
      const r = await result.current[1]() as unknown as typeof HKAuthorizationRequestStatus
      retVal = r
    })

    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.unnecessary)
    expect(retVal).toBe(HKAuthorizationRequestStatus.unnecessary)
  })

  test('should return unnecessary', async () => {
    const { HKAuthorizationRequestStatus, HKCategoryTypeIdentifier, default: Native } = NativeTypes

    jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.unnecessary))

    const { result } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]))

    await waitForNextUpdate()

    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.unnecessary)
  })

  test('should return null before initalizing', async () => {
    const { HKCategoryTypeIdentifier } = NativeTypes

    const { result } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]))

    expect(result.current[0]).toBe(null)

    await waitForNextUpdate()
  })
})
