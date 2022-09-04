import { act, renderHook } from '@testing-library/react-hooks'

import Native from '../native-types'
import useIsHealthDataAvailable from './useIsHealthDataAvailable'

describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(false))

    const { result, waitForNextUpdate } = renderHook(useIsHealthDataAvailable)

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current).toBe(false)
  })

  test('should return true', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(true))

    const { result, waitForNextUpdate } = renderHook(useIsHealthDataAvailable)

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current).toBe(true)
  })

  test('should return null before initalizing', () => {
    const { result } = renderHook(useIsHealthDataAvailable)

    expect(result.current).toBe(null)
  })
})
