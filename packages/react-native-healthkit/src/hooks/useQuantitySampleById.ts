import { useCallback, useState } from 'react'
import type { QuantitySample } from '../types/QuantitySample'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import getQuantitySampleById from '../utils/getQuantitySampleById'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent sample for the given quantity type.
 */
export function useQuantitySampleById(
  identifier: QuantityTypeIdentifier,
  uuid: string,
  options: {
    /** The unit to use for the sample. */
    unit?: string
  } = {},
) {
  const [sample, setSample] = useState<QuantitySample>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMostRecentSample = useCallback(async () => {
    setIsLoading(true)
    try {
      const sample = await getQuantitySampleById(
        identifier,
        uuid,
        options?.unit,
      )
      setSample(sample)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [identifier, uuid, options.unit])

  useSubscribeToChanges(identifier, fetchMostRecentSample)

  return { sample, isLoading, error }
}

export default useQuantitySampleById
