import type { EnergyUnit, HKWorkoutRaw, LengthUnit } from '../native-types'
import type { HKWorkout } from '../types'

function deserializeWorkout<TEnergy extends EnergyUnit, TDistance extends LengthUnit>(
  sample: HKWorkoutRaw<TEnergy, TDistance>,
): HKWorkout<TEnergy, TDistance> {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  }
}

export default deserializeWorkout
