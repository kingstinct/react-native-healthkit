import { act, renderHook } from '@testing-library/react-hooks'

import Native from '../native-types'
import useIsHealthDataAvailable from './useIsHealthDataAvailable'

describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(false))

    const { result, waitForNextUpdate, unmount } = renderHook(useIsHealthDataAvailable)

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current).toBe(false)

    unmount()
  })

  test('should return true', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(true))

    const { result, waitForNextUpdate, unmount } = renderHook(useIsHealthDataAvailable)

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current).toBe(true)

    unmount()
  })

  test('should return null before initalizing', () => {
    const { result } = renderHook(useIsHealthDataAvailable)

    expect(result.current).toBe(null)
  })
})
