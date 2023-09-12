import type { HKCategoryTypeIdentifier, HKQuantityTypeIdentifier, HKSource } from '../native-types';
declare function useSources<TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier>(identifier: TIdentifier): readonly HKSource[] | null;
export default useSources;
