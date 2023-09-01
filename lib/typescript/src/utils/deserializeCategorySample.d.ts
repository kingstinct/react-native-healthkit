import type { HKCategorySampleRaw, HKCategoryTypeIdentifier } from '../native-types';
import type { HKCategorySample } from '../types';
declare const deserializeCategorySample: <T extends HKCategoryTypeIdentifier>(sample: HKCategorySampleRaw<T>) => HKCategorySample<T>;
export default deserializeCategorySample;
