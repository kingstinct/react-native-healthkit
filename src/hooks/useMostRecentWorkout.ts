import {
  useEffect, useState, useRef, useCallback,
} from 'react'

import getMostRecentWorkout from '../utils/getMostRecentWorkout'
import getPreferredUnitsTyped from '../utils/getPreferredUnitsTyped'
import subscribeToChanges from '../utils/subscribeToChanges'

import type { EnergyUnit, LengthUnit } from '../native-types'
import type { HKWorkout } from '../types'

/**
   * @returns the most recent workout sample.
   */
function useMostRecentWorkout<
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
>(options?: { readonly energyUnit?: TEnergy; readonly distanceUnit?: TDistance }) {
  const [workout, setWorkout] = useState<HKWorkout<TEnergy, TDistance> | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const update = useCallback(async () => {
    const { energyUnit, distanceUnit } = await getPreferredUnitsTyped(
      optionsRef.current,
    )

    setWorkout(await getMostRecentWorkout({
      energyUnit,
      distanceUnit,
    }))
  }, [])

  useEffect(() => {
    void update()
  }, [update])

  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined

    const init = async () => {
      cancelSubscription = await subscribeToChanges(
        'HKWorkoutTypeIdentifier',
        update,
      )
    }
    void init()

    return () => {
      void cancelSubscription?.()
    }
  }, [update])

  return workout
}

export default useMostRecentWorkout
