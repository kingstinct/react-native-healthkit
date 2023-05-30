import {
  useState, useEffect, useCallback, useRef,
} from 'react'

import useSubscribeToChanges from './useSubscribeToChanges'
import queryStatisticsForQuantity from '../utils/queryStatisticsForQuantity'

import type { HKQuantityTypeIdentifier, HKStatisticsOptions, UnitForIdentifier } from '../native-types'
import type { QueryStatisticsResponse } from '../types'

function useStatisticsForQuantity<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>>(
  identifier: TIdentifier,
  options: readonly HKStatisticsOptions[],
  from: Date,
  to?: Date,
  unit?: TUnit,
) {
  const [result, setResult] = useState<QueryStatisticsResponse<TIdentifier, TUnit> | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const update = useCallback(async () => {
    const res = await queryStatisticsForQuantity(identifier, optionsRef.current, from, to, unit)
    setResult(res)
  }, [
    identifier, from, to, unit,
  ])

  useEffect(() => {
    void update()
  }, [update])

  useSubscribeToChanges(identifier, update)

  return result
}

export default useStatisticsForQuantity
