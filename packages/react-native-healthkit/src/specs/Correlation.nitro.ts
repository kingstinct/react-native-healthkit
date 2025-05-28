
import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { GenericMetadata } from "./Shared";
import type { CategorySampleRaw, CategorySampleRawForSaving } from "./CategoryType.nitro";
import type { CorrelationTypeIdentifier } from "../types/CorrelationTypeIdentifier";
import type { QuantitySampleRaw, QuantitySampleForSaving } from "../types/QuantitySampleRaw";


type HKCorrelationRawObject = CategorySampleRaw | QuantitySampleRaw;

export interface HKCorrelationRaw {
    readonly correlationType: CorrelationTypeIdentifier;
    readonly objects: readonly HKCorrelationRawObject[];
    readonly metadata: GenericMetadata;
    readonly startTimestamp: number;
    readonly endTimestamp: number;
};


export type MetadataMapperForCorrelationIdentifier<
TCorrelationTypeIdentifier = CorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends 'CorrelationTypeIdentifierFood'
? GenericMetadata & {
  readonly HKFoodType?: string;
}
: GenericMetadata;

export type SampleForSaving = CategorySampleRawForSaving | QuantitySampleForSaving;

export interface Correlation extends HybridObject<{ ios: 'swift' }> {
    saveCorrelationSample(
      typeIdentifier: CorrelationTypeIdentifier,
      samples: SampleForSaving[],
      startTimestamp: number,
      endTimestamp: number,
      metadata: AnyMap
    ): Promise<boolean>;

  queryCorrelationSamples(
    typeIdentifier: CorrelationTypeIdentifier,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<readonly HKCorrelationRaw[]>;
}