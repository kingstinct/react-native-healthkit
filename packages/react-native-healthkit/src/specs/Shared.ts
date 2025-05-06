
import type { HKCategoryTypeIdentifier } from "./CategoryType.nitro";
import type { HKCorrelationTypeIdentifier } from "./Correlation.nitro";
import type { HKQuantity, HKQuantityTypeIdentifier } from "./QuantityType.nitro";
import type { HKWorkoutTypeIdentifier } from "./Workout.nitro";
import type { HKStateOfMindTypeIdentifier } from "./StateOfMind.nitro";
import type { HKWorkoutRouteTypeIdentifier } from "./Workout.nitro";
import type { HKDataTypeIdentifierHeartbeatSeries } from "./HeartbeatSeries.nitro";

export type HKGenericMetadata = {
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
  
  // documented at https://developer.apple.com/documentation/healthkit/hkweathercondition
  export enum HKWeatherCondition {
    none = 0,
    clear = 1,
    fair = 2,
    partlyCloudy = 3,
    mostlyCloudy = 4,
    cloudy = 5,
    foggy = 6,
    haze = 7,
    windy = 8,
    blustery = 9,
    smoky = 10,
    dust = 11,
    snow = 12,
    hail = 13,
    sleet = 14,
    freezingDrizzle = 15,
    freezingRain = 16,
    mixedRainAndHail = 17,
    mixedRainAndSnow = 18,
    mixedRainAndSleet = 19,
    mixedSnowAndSleet = 20,
    drizzle = 21,
    scatteredShowers = 22,
    showers = 23,
    thunderstorms = 24,
    tropicalStorm = 25,
    hurricane = 26,
    tornado = 27,
  }


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
| `${HKCategoryTypeIdentifier}`
| `${HKCorrelationTypeIdentifier}`
| `${HKQuantityTypeIdentifier}`;




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