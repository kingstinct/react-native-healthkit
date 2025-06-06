
import type { QuantityTypeIdentifier } from "./QuantityTypeIdentifier";
import type { CategoryTypeIdentifier } from "./CategoryTypeIdentifier";
import type { CorrelationTypeIdentifier } from "./CorrelationTypeIdentifier";
import type { HKWorkoutTypeIdentifier, HKStateOfMindTypeIdentifier, HKDataTypeIdentifierHeartbeatSeries, HKWorkoutRouteTypeIdentifier } from "./Constants";
import type { Unit } from "./Units";
import type { AnyMap } from "react-native-nitro-modules";
import type { CharacteristicTypeIdentifier } from "../specs/CharacteristicTypeModule.nitro";

export interface Quantity {
    readonly unit: Unit;
    readonly quantity: number;
};

export interface GenericMetadata extends Record<string, Quantity | string | number | boolean | undefined> {
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
};

export interface DeletedSample {
    readonly uuid: string;
    readonly metadata: AnyMap;
};

export type SampleTypeIdentifier =
    | CategoryTypeIdentifier
    | CorrelationTypeIdentifier
    | QuantityTypeIdentifier
    | CharacteristicTypeIdentifier
    | typeof HKStateOfMindTypeIdentifier
    | typeof ActivitySummaryTypeIdentifier
    | typeof AudiogramTypeIdentifier
    | typeof HKDataTypeIdentifierHeartbeatSeries
    | typeof HKWorkoutRouteTypeIdentifier
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