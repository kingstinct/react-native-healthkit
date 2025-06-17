import { useCallback, useState } from 'react'

import type { CategorySampleTyped } from '../types/CategoryType'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import getCategorySampleById from '../utils/getCategorySampleById'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent sample for the given category type.
 */
export function useCategorySampleById<T extends CategoryTypeIdentifier>(
  identifier: T,
  uuid: string,
) {
  const [sample, setSample] = useState<CategorySampleTyped<T>>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const updater = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedSample = await getCategorySampleById(identifier, uuid)
      setSample(fetchedSample)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Unknown error fetching category sample by ID'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [identifier, uuid])

  useSubscribeToChanges(identifier, updater)

  return { sample, isLoading, error }
}

export default useCategorySampleById
