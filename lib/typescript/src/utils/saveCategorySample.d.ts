import type { HKCategoryTypeIdentifier, HKCategoryValueForIdentifier, MetadataMapperForCategoryIdentifier } from '../native-types';
declare function saveCategorySample<T extends HKCategoryTypeIdentifier>(identifier: T, value: HKCategoryValueForIdentifier<T>, options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCategoryIdentifier<T>;
}): Promise<boolean>;
export default saveCategorySample;
