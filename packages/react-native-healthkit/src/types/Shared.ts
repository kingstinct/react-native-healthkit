import type {
	QuantityTypeIdentifier,
	QuantityTypeIdentifierWriteable,
} from "./QuantityTypeIdentifier";
import type {
	CategoryTypeIdentifier,
	CategoryTypeIdentifierWriteable,
} from "./CategoryTypeIdentifier";

import type {
	WorkoutTypeIdentifier as WorkoutTypeIdentifier,
	StateOfMindTypeIdentifier as StateOfMindTypeIdentifier,
	HeartbeatSeriesTypeIdentifier as HeartbeatSeriesTypeIdentifier,
	WorkoutRouteTypeIdentifier as WorkoutRouteTypeIdentifier,
} from "./Constants";

import type { CorrelationTypeIdentifier } from "./CorrelationType";
import type { CharacteristicTypeIdentifier } from "./Characteristics";
import type { AnyMap } from "react-native-nitro-modules";

export interface GenericMetadata {
	readonly HKExternalUUID?: string;
	readonly HKTimeZone?: string;
	readonly HKWasUserEntered?: boolean;
	readonly HKDeviceSerialNumber?: string;
	readonly HKUDIDeviceIdentifier?: string;
	readonly HKUDIProductionIdentifier?: string;
	readonly HKDigitalSignature?: string;
	readonly HKDeviceName?: string;
	readonly HKDeviceManufacturerName?: string;
	readonly HKSyncIdentifier?: string;
	readonly HKSyncVersion?: number;
	readonly HKWasTakenInLab?: boolean;
	readonly HKReferenceRangeLowerLimit?: number;
	readonly HKReferenceRangeUpperLimit?: number;

	/**
	 *  Additional Metadata, will be merged with the main metadata on the native side
	 * */
	readonly allMetadata?: AnyMap;
}

export interface DeletedSample {
	readonly uuid: string;
	readonly metadata?: AnyMap;
}

export type ObjectTypeIdentifier =
	| CharacteristicTypeIdentifier
	| SampleTypeIdentifier
	| typeof ActivitySummaryTypeIdentifier;

export type SampleTypeIdentifier =
	| CategoryTypeIdentifier
	| CorrelationTypeIdentifier
	| QuantityTypeIdentifier
	| typeof StateOfMindTypeIdentifier
	| typeof AudiogramTypeIdentifier
	| typeof HeartbeatSeriesTypeIdentifier
	| typeof WorkoutRouteTypeIdentifier
	| typeof WorkoutTypeIdentifier;

export type SampleTypeIdentifierWriteable =
	| CategoryTypeIdentifierWriteable
	| CorrelationTypeIdentifier
	| QuantityTypeIdentifierWriteable
	| typeof StateOfMindTypeIdentifier
	| typeof AudiogramTypeIdentifier
	| typeof HeartbeatSeriesTypeIdentifier
	| typeof WorkoutRouteTypeIdentifier
	| typeof WorkoutTypeIdentifier;

/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const ActivitySummaryTypeIdentifier =
	"ActivitySummaryTypeIdentifier" as const;

/**
 * Represents an audiogram type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKAudiogramSampleType Apple Docs HKAudiogramSampleType}
 */
export const AudiogramTypeIdentifier = "HKAudiogramSampleType" as const;
