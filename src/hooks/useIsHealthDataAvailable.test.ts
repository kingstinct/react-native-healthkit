import { renderHook } from '@testing-library/react-native'

import waitForNextUpdate from '../test-utils'

describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    const useIsHealthDataAvailable = (await import('./useIsHealthDataAvailable')).default
    const { default: Native } = await import('../native-types')
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(false))

    const { result } = renderHook(useIsHealthDataAvailable)

    await waitForNextUpdate()

    expect(result.current).toBe(false)
  })

  test('should return true', async () => {
    const useIsHealthDataAvailable = (await import('./useIsHealthDataAvailable')).default
    const { default: Native } = await import('../native-types')
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(true))

    const { result } = renderHook(useIsHealthDataAvailable)

    await waitForNextUpdate()

    expect(result.current).toBe(true)
  })

  test('should return null before initalizing', async () => {
    const useIsHealthDataAvailable = (await import('./useIsHealthDataAvailable')).default
    const { result } = renderHook(useIsHealthDataAvailable)

    expect(result.current).toBe(null)

    await waitForNextUpdate()
  })
})
