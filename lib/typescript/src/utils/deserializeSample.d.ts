import type { HKQuantitySampleRaw, HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
import type { HKQuantitySample } from '../types';
declare function deserializeQuantitySample<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(sample: HKQuantitySampleRaw<TIdentifier, TUnit>): HKQuantitySample<TIdentifier, TUnit>;
export default deserializeQuantitySample;
