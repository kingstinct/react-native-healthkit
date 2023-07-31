import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
declare function getMostRecentQuantitySample<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, unit: TUnit): Promise<import("..").HKQuantitySample<TIdentifier, UnitForIdentifier<TIdentifier>> | null>;
export default getMostRecentQuantitySample;
