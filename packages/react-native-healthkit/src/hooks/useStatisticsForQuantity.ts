import { useCallback, useEffect, useRef, useState } from 'react'
import { QuantityTypes } from '../modules'
import type {
  QueryStatisticsResponse,
  StatisticsOptions,
} from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import useSubscribeToChanges from './useSubscribeToChanges'

export function useStatisticsForQuantity<
  TIdentifier extends QuantityTypeIdentifier,
>(
  identifier: TIdentifier,
  options: readonly StatisticsOptions[],
  from: Date,
  to?: Date,
  unit?: string,
) {
  const [result, setResult] = useState<QueryStatisticsResponse | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const update = useCallback(async () => {
    const res = await QuantityTypes.queryStatisticsForQuantity(
      identifier,
      optionsRef.current,
      { filter: { startDate: from, endDate: to }, unit },
    )
    setResult(res)
  }, [identifier, from, to, unit])

  useEffect(() => {
    void update()
  }, [update])

  useSubscribeToChanges(identifier, update)

  return result
}

export default useStatisticsForQuantity
