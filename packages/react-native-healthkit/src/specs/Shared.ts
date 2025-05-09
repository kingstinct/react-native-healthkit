import type { HKQuantity } from "./QuantityType.nitro";
import type { HKWorkoutTypeIdentifier } from "./Workout.nitro";
import type { HKStateOfMindTypeIdentifier } from "./StateOfMind.nitro";
import type { HKWorkoutRouteTypeIdentifier } from "./Workout.nitro";
import type { HKDataTypeIdentifierHeartbeatSeries } from "./HeartbeatSeries.nitro";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKCategoryTypeIdentifier } from "../types/HKCategoryTypeIdentifier";
import type { HKCorrelationTypeIdentifier } from "../types/HKCorrelationTypeIdentifier";

export interface HKGenericMetadata {
    readonly [key: string]: HKQuantity | boolean | number | string | undefined;
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