import type { HKQuantityTypeIdentifier, HKUnit } from '../native-types';
export type GetPreferredUnitFn = (identifier: HKQuantityTypeIdentifier) => Promise<HKUnit | undefined>;
declare const getPreferredUnit: GetPreferredUnitFn;
export default getPreferredUnit;
