import type { HKQuantityTypeIdentifier } from '../native-types';
export type DeleteSamplesFn = <TIdentifier extends HKQuantityTypeIdentifier>(sample: {
    readonly identifier: TIdentifier;
    readonly startDate?: Date;
    readonly endDate?: Date;
}) => Promise<boolean>;
declare const deleteSamples: DeleteSamplesFn;
export default deleteSamples;
