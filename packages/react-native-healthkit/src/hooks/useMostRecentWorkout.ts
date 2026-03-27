import { useCallback, useEffect, useState } from 'react'
import type { WorkoutProxyTyped } from '../types/Workouts'
import getMostRecentWorkout from '../utils/getMostRecentWorkout'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent workout sample.
 */
export function useMostRecentWorkout() {
  const [workout, setWorkout] = useState<WorkoutProxyTyped>()

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
