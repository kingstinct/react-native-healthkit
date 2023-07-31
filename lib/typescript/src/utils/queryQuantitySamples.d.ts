import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
import type { GenericQueryOptions, HKQuantitySample } from '../types';
export type QueryQuantitySamplesFn = <TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, options: Omit<GenericQueryOptions, 'anchor'> & {
    readonly unit?: TUnit;
}) => Promise<readonly HKQuantitySample<TIdentifier>[]>;
declare const queryQuantitySamples: QueryQuantitySamplesFn;
export default queryQuantitySamples;
