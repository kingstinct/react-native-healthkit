import { useCallback, useState } from 'react'

import type { CategorySampleTyped } from '../types/CategoryType'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import getMostRecentCategorySample from '../utils/getMostRecentCategorySample'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent sample for the given category type.
 */
export function useMostRecentCategorySample<T extends CategoryTypeIdentifier>(
  identifier: T,
) {
  const [category, setCategory] = useState<CategorySampleTyped<T>>()

  const updater = useCallback(() => {
    void getMostRecentCategorySample(identifier).then(setCategory)
  }, [identifier])

  useSubscribeToChanges(identifier, updater)

  return category
}

export default useMostRecentCategorySample
