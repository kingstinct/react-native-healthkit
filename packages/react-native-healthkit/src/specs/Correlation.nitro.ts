
import type { HybridObject } from "react-native-nitro-modules";
import type { HKGenericMetadata } from "./Shared";
import type { HKCategorySampleRaw, HKCategorySampleRawForSaving } from "./CategoryType.nitro";
import type { HKQuantitySampleRaw, HKQuantitySampleRawForSaving } from "./QuantityType.nitro";


export type HKCorrelationRaw<TIdentifier extends HKCorrelationTypeIdentifier> =
  {
    readonly correlationType: HKCorrelationTypeIdentifier;
    readonly objects: readonly (HKCategorySampleRaw | HKQuantitySampleRaw)[];
    readonly metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>;
    readonly startDate: string;
    readonly endDate: string;
  };


export type MetadataMapperForCorrelationIdentifier<
TCorrelationTypeIdentifier = HKCorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends HKCorrelationTypeIdentifier.food
? HKGenericMetadata & {
  readonly HKFoodType?: string;
}
: HKGenericMetadata;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcorrelationtypeidentifier Apple Docs }
 */
export enum HKCorrelationTypeIdentifier {
    bloodPressure = 'HKCorrelationTypeIdentifierBloodPressure',
    food = 'HKCorrelationTypeIdentifierFood',
  }

  export interface Correlation extends HybridObject<{ ios: 'swift' }> {
    readonly saveCorrelationSample: <
    TIdentifier extends HKCorrelationTypeIdentifier,
    TSamples extends readonly (
      | HKCategorySampleRawForSaving
      | HKQuantitySampleRawForSaving
    )[]
  >(
    typeIdentifier: TIdentifier,
    samples: TSamples,
    start: string,
    end: string,
    metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>
  ) => Promise<boolean>;


  readonly queryCorrelationSamples: <
    TIdentifier extends HKCorrelationTypeIdentifier
  >(
    typeIdentifier: TIdentifier,
    from: string,
    to: string
  ) => Promise<readonly HKCorrelationRaw<TIdentifier>[]>;
}