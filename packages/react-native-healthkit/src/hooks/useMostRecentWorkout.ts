import {
  useEffect, useState, useRef, useCallback,
} from 'react'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro';
import getMostRecentWorkout from '../utils/getMostRecentWorkout';
import useSubscribeToChanges from './useSubscribeToChanges';

/**
   * @returns the most recent workout sample.
   */
export function useMostRecentWorkout(options?: { readonly energyUnit?: string; readonly distanceUnit?: string }) {
  const [workout, setWorkout] = useState<WorkoutProxy>()

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const update = useCallback(async () => {
    setWorkout(await getMostRecentWorkout({
      energyUnit: optionsRef.current?.energyUnit,
      distanceUnit: optionsRef.current?.distanceUnit,
    }))
  }, [])

  useEffect(() => {
    void update()
  }, [update])

  useSubscribeToChanges('HKWorkoutTypeIdentifier', update)

  return workout
}

export default useMostRecentWorkout
