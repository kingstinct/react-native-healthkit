import { describe, expect, test, jest } from 'bun:test'
import { renderHook } from '@testing-library/react-native'

import waitForNextUpdate from '../test-utils'
import { Core } from '..'

describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    const useIsHealthDataAvailable = (await import('./useIsHealthDataAvailable')).default
    jest.spyOn(Core, 'isHealthDataAvailableAsync').mockReturnValue(Promise.resolve(false))

    const { result } = renderHook(useIsHealthDataAvailable)

    await waitForNextUpdate()

    expect(result.current).toBe(false)
  })

  test('should return true', async () => {
    const useIsHealthDataAvailable = (await import('./useIsHealthDataAvailable')).default
    jest.spyOn(Core, 'isHealthDataAvailableAsync').mockReturnValue(Promise.resolve(true))

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
