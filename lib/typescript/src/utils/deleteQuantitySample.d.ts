import type { HKQuantityTypeIdentifier } from '../native-types';
export type DeleteQuantitySampleFn = <TIdentifier extends HKQuantityTypeIdentifier>(identifier: TIdentifier, uuid: string) => Promise<boolean>;
declare const deleteQuantitySample: DeleteQuantitySampleFn;
export default deleteQuantitySample;
