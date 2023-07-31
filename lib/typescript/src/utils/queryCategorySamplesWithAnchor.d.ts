import type { HKCategoryTypeIdentifier, DeletedCategorySampleRaw } from '../native-types';
import type { GenericQueryOptions, HKCategorySample } from '../types';
export type QueryCategorySamplesWithAnchorResponse<T extends HKCategoryTypeIdentifier> = {
    readonly samples: readonly HKCategorySample<T>[];
    readonly deletedSamples: readonly DeletedCategorySampleRaw<T>[];
    readonly newAnchor: string;
};
export type QueryCategorySamplesWithAnchorFn = <T extends HKCategoryTypeIdentifier>(identifier: T, options: Omit<GenericQueryOptions, 'ascending'>) => Promise<QueryCategorySamplesWithAnchorResponse<T>>;
declare const queryCategorySamplesWithAnchor: QueryCategorySamplesWithAnchorFn;
export default queryCategorySamplesWithAnchor;
