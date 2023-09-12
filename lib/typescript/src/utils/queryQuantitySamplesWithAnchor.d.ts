import type { HKQuantityTypeIdentifier, UnitForIdentifier, DeletedQuantitySampleRaw } from '../native-types';
import type { GenericQueryOptions, HKQuantitySample } from '../types';
export type QueryQuantitySamplesWithAnchorResponse<T extends HKQuantityTypeIdentifier> = {
    readonly samples: readonly HKQuantitySample<T>[];
    readonly deletedSamples: readonly DeletedQuantitySampleRaw<T>[];
    readonly newAnchor: string;
};
export type QueryQuantitySamplesWithAnchorFn = <TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, options: Omit<GenericQueryOptions, 'ascending'> & {
    readonly unit?: TUnit;
}) => Promise<QueryQuantitySamplesWithAnchorResponse<TIdentifier>>;
declare const queryQuantitySamplesWithAnchor: QueryQuantitySamplesWithAnchorFn;
export default queryQuantitySamplesWithAnchor;
