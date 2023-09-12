import type { HKCategoryTypeIdentifier } from '../native-types';
import type { HKCategorySample } from '../types';
declare function getMostRecentCategorySample<T extends HKCategoryTypeIdentifier>(identifier: T): Promise<HKCategorySample<T> | null>;
export default getMostRecentCategorySample;
