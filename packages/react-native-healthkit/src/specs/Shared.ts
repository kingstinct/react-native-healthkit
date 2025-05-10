
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKCategoryTypeIdentifier } from "../types/HKCategoryTypeIdentifier";
import type { HKCorrelationTypeIdentifier } from "../types/HKCorrelationTypeIdentifier";
import type { HKWorkoutRouteTypeIdentifier, HKWorkoutTypeIdentifier, HKStateOfMindTypeIdentifier, HKDataTypeIdentifierHeartbeatSeries } from "./Constants";
import type { HKUnit } from "../types/Units";

export interface HKQuantity {
    readonly unit: HKUnit;
    readonly quantity: number;
  };

export interface HKGenericMetadata extends Record<string, HKQuantity | boolean | number | string | undefined> {
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

export type HKSampleTypeIdentifier =
| HKCategoryTypeIdentifier
| HKCorrelationTypeIdentifier
| HKQuantityTypeIdentifier
| typeof HKStateOfMindTypeIdentifier
| typeof HKActivitySummaryTypeIdentifier
| typeof HKAudiogramTypeIdentifier
| typeof HKDataTypeIdentifierHeartbeatSeries
| typeof HKWorkoutRouteTypeIdentifier
| typeof HKWorkoutTypeIdentifier
| HKCategoryTypeIdentifier
| HKCorrelationTypeIdentifier
| HKQuantityTypeIdentifier




/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const HKActivitySummaryTypeIdentifier = 'HKActivitySummaryTypeIdentifier' as const

/**
 * Represents an audiogram type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKAudiogramSampleType Apple Docs HKAudiogramSampleType}
 */
export const HKAudiogramTypeIdentifier = 'HKAudiogramSampleType' as const