import type { MetadataMapperForQuantityIdentifier, HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
declare function saveQuantitySample<TType extends HKQuantityTypeIdentifier>(identifier: TType, unit: UnitForIdentifier<TType>, value: number, options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForQuantityIdentifier<TType>;
}): Promise<boolean>;
export default saveQuantitySample;
