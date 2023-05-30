import { useCallback, useState } from 'react'

import useSubscribeToChanges from './useSubscribeToChanges'
import getMostRecentCategorySample from '../utils/getMostRecentCategorySample'

import type { HKCategorySampleRaw, HKCategoryTypeIdentifier } from '../native-types'
import type { HKCategorySample } from '../types'

function useMostRecentCategorySample<
  TCategory extends HKCategoryTypeIdentifier
>(identifier: TCategory) {
  const [category, setCategory] = useState<HKCategorySampleRaw<TCategory> | null>(
    null,
  )
  const updater = useCallback(() => {
    void getMostRecentCategorySample(identifier).then(setCategory)
  }, [identifier])

  useSubscribeToChanges(identifier, updater)

  return category
}

export default useMostRecentCategorySample
