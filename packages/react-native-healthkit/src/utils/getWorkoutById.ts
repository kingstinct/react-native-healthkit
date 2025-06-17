import { Workouts } from '../modules'
import type { WorkoutQueryOptions } from '../types/Workouts'

const getWorkoutById = async (
  uuid: string,
  options: Pick<WorkoutQueryOptions, 'distanceUnit' | 'energyUnit'>,
) => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    filter: {
      uuid: uuid,
    },
    energyUnit: options?.energyUnit,
    distanceUnit: options?.distanceUnit,
  })

  return workouts[0]
}

export default getWorkoutById
