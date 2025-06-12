import type { AnyMap } from "react-native-nitro-modules";
import type { CategorySample, CategorySampleForSaving } from "./CategoryType";
import type { QuantitySample, QuantitySampleForSaving } from "./QuantitySample";
import type { GenericMetadata } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcorrelationtypeidentifier Apple Docs }
 */
export type CorrelationTypeIdentifier =
	| "HKCorrelationTypeIdentifierBloodPressure"
	| "HKCorrelationTypeIdentifierFood";

type CorrelationObject = CategorySample | QuantitySample;

export interface CorrelationSample {
	readonly correlationType: CorrelationTypeIdentifier;
	readonly objects: readonly CorrelationObject[];
	readonly metadata: AnyMap;
	readonly start: Date;
	readonly end: Date;
}

export type MetadataMapperForCorrelationIdentifier<
	TCorrelationTypeIdentifier = CorrelationTypeIdentifier,
> = TCorrelationTypeIdentifier extends "CorrelationTypeIdentifierFood"
	? GenericMetadata & {
			readonly HKFoodType?: string;
		}
	: GenericMetadata;

export type SampleForSaving = CategorySampleForSaving | QuantitySampleForSaving;
