import type { HKCategoryTypeIdentifier } from '../native-types';
import type { GenericQueryOptions, HKCategorySample } from '../types';
export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(identifier: T, options: Omit<GenericQueryOptions, 'anchor'>) => Promise<readonly HKCategorySample<T>[]>;
declare const queryCategorySamples: QueryCategorySamplesFn;
export default queryCategorySamples;
