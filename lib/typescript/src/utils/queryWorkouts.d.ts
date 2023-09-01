import type { EnergyUnit, LengthUnit } from '../native-types';
import type { QueryWorkoutsOptions } from '../types';
declare function queryWorkouts<TEnergy extends EnergyUnit, TDistance extends LengthUnit>(options: QueryWorkoutsOptions<TEnergy, TDistance>): Promise<import("../types").HKWorkout<TEnergy, TDistance>[]>;
export default queryWorkouts;
