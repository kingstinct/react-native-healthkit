
import { Workouts } from '..';
import type { WorkoutQueryOptions } from '../types/Workouts';

const getMostRecentWorkout = async (options: Pick<WorkoutQueryOptions, 'distanceUnit' | 'energyUnit'>) => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    ascending: false,
    energyUnit: options?.energyUnit,
    distanceUnit: options?.distanceUnit,
  })

  return workouts[0]
}

export default getMostRecentWorkout
