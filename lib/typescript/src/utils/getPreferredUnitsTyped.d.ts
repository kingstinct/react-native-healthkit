import type { HKUnit } from '../native-types';
declare function getPreferredUnitsTyped<TEnergy extends HKUnit, TDistance extends HKUnit>(options?: {
    readonly energyUnit?: TEnergy;
    readonly distanceUnit?: TDistance;
}): Promise<{
    energyUnit: TEnergy;
    distanceUnit: TDistance;
}>;
export default getPreferredUnitsTyped;
