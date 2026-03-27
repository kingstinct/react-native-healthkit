import { Workouts } from '../modules'
import type { WorkoutProxyTyped } from '../types/Workouts'

const getMostRecentWorkout = async (): Promise<
  WorkoutProxyTyped | undefined
> => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    ascending: false,
  })

  return workouts[0] as WorkoutProxyTyped | undefined
}

export default getMostRecentWorkout
