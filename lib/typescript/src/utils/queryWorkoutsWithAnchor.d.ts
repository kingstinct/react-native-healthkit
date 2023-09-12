import type { EnergyUnit, LengthUnit } from '../native-types';
import type { QueryWorkoutsOptions } from '../types';
declare function queryWorkoutsWitAnchor<TEnergy extends EnergyUnit, TDistance extends LengthUnit>(options: QueryWorkoutsOptions<TEnergy, TDistance>): Promise<{
    samples: import("../types").HKWorkout<TEnergy, TDistance>[];
    deletedSamples: readonly import("../native-types").DeletedWorkoutSampleRaw[];
    newAnchor: string;
}>;
export default queryWorkoutsWitAnchor;
