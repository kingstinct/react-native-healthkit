import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
import type { HKQuantitySample } from '../types';
declare function getMostRecentQuantitySample<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, unit: TUnit): Promise<HKQuantitySample<TIdentifier, TUnit> | null>;
export default getMostRecentQuantitySample;
