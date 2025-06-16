import { useCallback, useEffect, useState } from 'react'

import { Core } from '../modules'
import type { SourceProxy } from '../specs/SourceProxy.nitro'
import type { SampleTypeIdentifier } from '../types/Shared'

export function useSources<TIdentifier extends SampleTypeIdentifier>(
  identifier: TIdentifier,
) {
  const [result, setResult] = useState<readonly SourceProxy[] | null>(null)

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
