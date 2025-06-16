import { useCallback, useState } from 'react'
import type { QuantitySample } from '../types/QuantitySample'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import getMostRecentQuantitySample from '../utils/getMostRecentQuantitySample'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent sample for the given quantity type.
 */
export function useMostRecentQuantitySample(
  identifier: QuantityTypeIdentifier,
  unit?: string,
) {
  const [lastSample, setLastSample] = useState<QuantitySample>()

  const fetchMostRecentSample = useCallback(async () => {
    const value = await getMostRecentQuantitySample(identifier, unit)
    setLastSample(value)
  }, [identifier, unit])

  useSubscribeToChanges(identifier, fetchMostRecentSample)

  return lastSample
}

export default useMostRecentQuantitySample
