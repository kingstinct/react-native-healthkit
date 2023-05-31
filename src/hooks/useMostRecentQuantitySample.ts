import { useEffect, useState } from 'react'

import ensureUnit from '../utils/ensureUnit'
import getMostRecentQuantitySample from '../utils/getMostRecentQuantitySample'
import subscribeToChanges from '../utils/subscribeToChanges'

import type { HKQuantitySampleRaw, HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'

function useMostRecentQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(identifier: TIdentifier, unit?: TUnit) {
  const [lastSample, setLastSample] = useState<HKQuantitySampleRaw<
  TIdentifier
  > | null>(null)

  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined

    const init = async () => {
      const actualUnit = await ensureUnit(identifier, unit)

      cancelSubscription = await subscribeToChanges(identifier, async () => {
        const value = await getMostRecentQuantitySample(identifier, actualUnit)
        setLastSample(value)
      })
    }
    void init()

    return () => {
      void cancelSubscription?.()
    }
  }, [identifier, unit])

  return lastSample
}

export default useMostRecentQuantitySample
