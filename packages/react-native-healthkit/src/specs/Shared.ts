
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";
import type { CorrelationTypeIdentifier } from "../types/CorrelationTypeIdentifier";
import type { WorkoutRouteTypeIdentifier, HKWorkoutTypeIdentifier, StateOfMindTypeIdentifier, DataTypeIdentifierHeartbeatSeries } from "../types/Constants";
import type { Unit } from "../types/Units";
import type { QuantityRaw } from "./QuantityType.nitro";
import type { AnyMap } from "react-native-nitro-modules";

export interface Quantity {
    readonly unit: Unit;
    readonly quantity: number;
};

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
    [key: string]: QuantityRaw | boolean | number | string | undefined;
};

export interface DeletedSample {
    readonly uuid: string;
    readonly metadata: AnyMap;
};

export type SampleTypeIdentifier =
    | CategoryTypeIdentifier
    | CorrelationTypeIdentifier
    | QuantityTypeIdentifier
    | typeof StateOfMindTypeIdentifier
    | typeof ActivitySummaryTypeIdentifier
    | typeof AudiogramTypeIdentifier
    | typeof DataTypeIdentifierHeartbeatSeries
    | typeof WorkoutRouteTypeIdentifier
    | typeof HKWorkoutTypeIdentifier

/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const ActivitySummaryTypeIdentifier = 'ActivitySummaryTypeIdentifier' as const

/**
 * Represents an audiogram type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKAudiogramSampleType Apple Docs HKAudiogramSampleType}
 */
export const AudiogramTypeIdentifier = 'HKAudiogramSampleType' as const