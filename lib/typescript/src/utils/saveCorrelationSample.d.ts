import type { MetadataMapperForCorrelationIdentifier, HKCorrelationTypeIdentifier } from '../native-types';
import type { HKCategorySampleForSaving, HKQuantitySampleForSaving } from '../types';
declare function saveCorrelationSample<TIdentifier extends HKCorrelationTypeIdentifier, TSamples extends readonly (HKCategorySampleForSaving | HKQuantitySampleForSaving)[]>(typeIdentifier: TIdentifier, samples: TSamples, options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCorrelationIdentifier<TIdentifier>;
}): Promise<boolean>;
export default saveCorrelationSample;
