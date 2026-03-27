import { useCallback, useState } from 'react'
import type { QuantitySampleTyped } from '../types/QuantitySample'
import type { UnitForIdentifier } from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import getMostRecentQuantitySample from '../utils/getMostRecentQuantitySample'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent sample for the given quantity type.
 */
export function useMostRecentQuantitySample<T extends QuantityTypeIdentifier>(
  identifier: T,
  unit?: UnitForIdentifier<T>,
) {
  const [lastSample, setLastSample] = useState<QuantitySampleTyped<T>>()

  const fetchMostRecentSample = useCallback(async () => {
    const value = await getMostRecentQuantitySample(identifier, unit)
    setLastSample(value)
  }, [identifier, unit])

  useSubscribeToChanges(identifier, fetchMostRecentSample)

  return lastSample
}

export default useMostRecentQuantitySample
