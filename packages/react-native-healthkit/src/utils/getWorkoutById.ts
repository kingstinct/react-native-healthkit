import { Workouts } from '../modules'
import type { WorkoutQueryOptions } from '../types/Workouts'

const getWorkoutById = async (uuid: string) => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    filter: {
      uuid: uuid,
    },
  })

  return workouts[0]
}

export default getWorkoutById
