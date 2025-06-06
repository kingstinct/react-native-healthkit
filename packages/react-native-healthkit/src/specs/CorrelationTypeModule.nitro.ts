
import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { GenericMetadata } from "../types/Shared";
import type { CategorySample, CategorySampleForSaving } from "./CategoryTypeModule.nitro";
import type { CorrelationTypeIdentifier } from "../types/CorrelationTypeIdentifier";
import type { QuantitySample, QuantitySampleForSaving } from "../types/QuantitySample";


type CorrelationObject = CategorySample | QuantitySample;

export interface CorrelationSample {
    readonly correlationType: CorrelationTypeIdentifier;
    readonly objects: readonly CorrelationObject[];
    readonly metadata: AnyMap;
    readonly start: Date;
    readonly end: Date;
};


export type MetadataMapperForCorrelationIdentifier<
TCorrelationTypeIdentifier = CorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends 'CorrelationTypeIdentifierFood'
? GenericMetadata & {
  readonly HKFoodType?: string;
}
: GenericMetadata;

export type SampleForSaving = CategorySampleForSaving | QuantitySampleForSaving;

export interface CorrelationTypeModule extends HybridObject<{ ios: 'swift' }> {
    saveCorrelationSample(
      typeIdentifier: CorrelationTypeIdentifier,
      samples: SampleForSaving[],
      start: Date,
      end: Date,
      metadata: AnyMap
    ): Promise<boolean>;

  queryCorrelationSamples(
    typeIdentifier: CorrelationTypeIdentifier,
    from: Date,
    to: Date
  ): Promise<readonly CorrelationSample[]>;
}