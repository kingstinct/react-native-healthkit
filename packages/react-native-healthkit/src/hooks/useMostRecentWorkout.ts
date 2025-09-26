import { useCallback, useEffect, useState } from 'react'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'
import getMostRecentWorkout from '../utils/getMostRecentWorkout'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent workout sample.
 */
export function useMostRecentWorkout() {
  const [workout, setWorkout] = useState<WorkoutProxy>()

  const update = useCallback(async () => {
    setWorkout(await getMostRecentWorkout())
  }, [])

  useEffect(() => {
    void update()
  }, [update])

  useSubscribeToChanges('HKWorkoutTypeIdentifier', update)

  return workout
}

export default useMostRecentWorkout
