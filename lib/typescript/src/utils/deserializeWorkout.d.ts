import type { EnergyUnit, HKWorkoutRaw, LengthUnit } from '../native-types';
import type { HKWorkout } from '../types';
declare function deserializeWorkout<TEnergy extends EnergyUnit, TDistance extends LengthUnit>(sample: HKWorkoutRaw<TEnergy, TDistance>): HKWorkout<TEnergy, TDistance>;
export default deserializeWorkout;
