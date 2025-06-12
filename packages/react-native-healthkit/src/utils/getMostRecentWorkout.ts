
import { Workouts } from '@kingstinct/react-native-healthkit';
import type { WorkoutQueryOptions } from '@kingstinct/react-native-healthkit/types/Workouts';

const getMostRecentWorkout = async (options: Pick<WorkoutQueryOptions, 'distanceUnit' | 'energyUnit'>) => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    ascending: false,
    energyUnit: options?.energyUnit,
    distanceUnit: options?.distanceUnit,
  })

  return workouts[0] || null
}

export default getMostRecentWorkout
