import queryWorkouts from './queryWorkouts'

import type { EnergyUnit, LengthUnit } from '../native-types'
import type { HKWorkout, QueryWorkoutsOptions } from '../types'

export type GetMostRecentWorkoutFn = <
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
>(
  options?: Pick<
  QueryWorkoutsOptions<TEnergy, TDistance>,
  'distanceUnit' | 'energyUnit'
  >
) => Promise<HKWorkout<TEnergy, TDistance> | null>;

const getMostRecentWorkout: GetMostRecentWorkoutFn = async (options) => {
  const workouts = await queryWorkouts({
    limit: 1,
    ascending: false,
    energyUnit: options?.energyUnit,
    distanceUnit: options?.distanceUnit,
  })

  return workouts[0] || null
}

export default getMostRecentWorkout
