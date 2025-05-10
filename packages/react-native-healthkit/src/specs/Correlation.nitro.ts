
import type { HybridObject } from "react-native-nitro-modules";
import type { HKGenericMetadata } from "./Shared";
import type { HKCategorySampleRaw, HKCategorySampleRawForSaving } from "./CategoryType.nitro";
import type { HKCorrelationTypeIdentifier } from "../types/HKCorrelationTypeIdentifier";
import type { HKQuantitySampleRaw, HKQuantitySampleRawForSaving } from "../types/HKQuantitySampleRaw";


type HKCorrelationRawObject = HKCategorySampleRaw | HKQuantitySampleRaw;

export interface HKCorrelationRaw {
    readonly correlationType: HKCorrelationTypeIdentifier;
    readonly objects: readonly HKCorrelationRawObject[];
    readonly metadata: HKGenericMetadata;
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

export type SampleForSaving = HKCategorySampleRawForSaving | HKQuantitySampleRawForSaving;

export interface Correlation extends HybridObject<{ ios: 'swift' }> {
    readonly saveCorrelationSample: (
    typeIdentifier: HKCorrelationTypeIdentifier,
    samples: SampleForSaving[],
    start: string,
    end: string,
    metadata: HKGenericMetadata
  ) => Promise<boolean>;


  readonly queryCorrelationSamples: (
    typeIdentifier: HKCorrelationTypeIdentifier,
    from: string,
    to: string
  ) => Promise<readonly HKCorrelationRaw[]>;
}