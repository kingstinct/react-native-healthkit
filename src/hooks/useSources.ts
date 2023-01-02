import { useCallback, useEffect, useState } from 'react'

import querySources from '../utils/querySources'

import type {
  HKCategoryTypeIdentifier,
  HKQuantityTypeIdentifier,
  HKSource,
} from '../native-types'

function useSources<
  TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier
>(identifier: TIdentifier) {
  const [result, setResult] = useState<readonly HKSource[] | null>(null)

  const update = useCallback(async () => {
    const res = await querySources(identifier)
    setResult(res)
  }, [identifier])

  useEffect(() => {
    void update()
  }, [update])

  return result
}

export default useSources
