import { useCallback, useEffect, useState } from 'react'

import { Core } from '..'
import type { SampleTypeIdentifier } from '../types/Shared'
import type { Source } from '../types/Source'

export function useSources<
  TIdentifier extends SampleTypeIdentifier
>(identifier: TIdentifier) {
  const [result, setResult] = useState<readonly Source[] | null>(null)

  const update = useCallback(async () => {
    const res = await Core.querySources(identifier)
    setResult(res)
  }, [identifier])

  useEffect(() => {
    void update()
  }, [update])

  return result
}

export default useSources
