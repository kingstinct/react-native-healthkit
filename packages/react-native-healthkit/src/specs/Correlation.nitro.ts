
import type { HybridObject } from "react-native-nitro-modules";
import type { HKGenericMetadata } from "./Shared";
import type { HKCategorySampleRaw, HKCategorySampleRawForSaving } from "./CategoryType.nitro";
import type { HKQuantitySampleRaw, HKQuantitySampleRawForSaving } from "./QuantityType.nitro";
import type { HKCorrelationTypeIdentifier } from "../types/HKCorrelationTypeIdentifier";


export type HKCorrelationRaw<TIdentifier extends HKCorrelationTypeIdentifier = HKCorrelationTypeIdentifier> =
  {
    readonly correlationType: HKCorrelationTypeIdentifier;
    readonly objects: readonly (HKCategorySampleRaw | HKQuantitySampleRaw)[];
    readonly metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>;
    readonly startDate: string;
    readonly endDate: string;
  };


export type MetadataMapperForCorrelationIdentifier<
TCorrelationTypeIdentifier = HKCorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends 'HKCorrelationTypeIdentifierFood'
? HKGenericMetadata & {
  readonly HKFoodType?: string;
}
: HKGenericMetadata;

export interface Correlation extends HybridObject<{ ios: 'swift' }> {
    readonly saveCorrelationSample: (
    typeIdentifier: HKCorrelationTypeIdentifier,
    samples: (HKCategorySampleRawForSaving | HKQuantitySampleRawForSaving)[],
    start: string,
    end: string,
    metadata: MetadataMapperForCorrelationIdentifier
  ) => Promise<boolean>;


  readonly queryCorrelationSamples: (
    typeIdentifier: HKCorrelationTypeIdentifier,
    from: string,
    to: string
  ) => Promise<readonly HKCorrelationRaw[]>;
}