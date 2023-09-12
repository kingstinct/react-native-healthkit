import type { HKQuantityTypeIdentifier, HKUnit } from '../native-types';
export type GetPreferredUnitsFn = (identifiers: readonly HKQuantityTypeIdentifier[]) => Promise<readonly HKUnit[]>;
declare const getPreferredUnits: GetPreferredUnitsFn;
export default getPreferredUnits;
