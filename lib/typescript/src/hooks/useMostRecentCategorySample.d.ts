import type { HKCategoryTypeIdentifier } from '../native-types';
import type { HKCategorySample } from '../types';
declare function useMostRecentCategorySample<TCategory extends HKCategoryTypeIdentifier>(identifier: TCategory): HKCategorySample<TCategory> | null;
export default useMostRecentCategorySample;
