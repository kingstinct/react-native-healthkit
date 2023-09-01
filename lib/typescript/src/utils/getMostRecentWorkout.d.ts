import type { EnergyUnit, LengthUnit } from '../native-types';
import type { HKWorkout, QueryWorkoutsOptions } from '../types';
export type GetMostRecentWorkoutFn = <TEnergy extends EnergyUnit, TDistance extends LengthUnit>(options?: Pick<QueryWorkoutsOptions<TEnergy, TDistance>, 'distanceUnit' | 'energyUnit'>) => Promise<HKWorkout<TEnergy, TDistance> | null>;
declare const getMostRecentWorkout: GetMostRecentWorkoutFn;
export default getMostRecentWorkout;
