import type { HKCategoryTypeIdentifier } from '../native-types';
declare function getMostRecentCategorySample<T extends HKCategoryTypeIdentifier>(identifier: T): Promise<import("..").HKCategorySample<T> | null>;
export default getMostRecentCategorySample;
