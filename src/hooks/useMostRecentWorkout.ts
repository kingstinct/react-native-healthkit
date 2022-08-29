import { useEffect, useState } from 'react'

import getMostRecentWorkout from '../utils/getMostRecentWorkout'
import getPreferredUnitsTyped from '../utils/getPreferredUnitsTyped'
import subscribeToChanges from '../utils/subscribeToChanges'

import type { EnergyUnit, LengthUnit } from '../native-types'
import type { HKWorkout } from '../types'

function useMostRecentWorkout<
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
>(options?: { readonly energyUnit?: TEnergy; readonly distanceUnit?: TDistance }) {
  const [workout, setWorkout] = useState<HKWorkout<TEnergy, TDistance> | null>(
    null,
  )
  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined

    const init = async () => {
      const { energyUnit, distanceUnit } = await getPreferredUnitsTyped(
        options,
      )

      cancelSubscription = await subscribeToChanges(
        'HKWorkoutTypeIdentifier',
        async () => {
          const w = await getMostRecentWorkout({ energyUnit, distanceUnit })
          setWorkout(w)
        },
      )
    }
    void init()
    return () => {
      void cancelSubscription?.()
    }
  }, [options])
  return workout
}

export default useMostRecentWorkout
