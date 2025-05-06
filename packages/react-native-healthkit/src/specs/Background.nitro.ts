import type { HybridObject } from "react-native-nitro-modules";
import type { HKSampleTypeIdentifier } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
export enum HKUpdateFrequency {
    immediate = 1,
    hourly = 2,
    daily = 3,
    weekly = 4,
}

export interface Background extends HybridObject<{ ios: 'swift' }> {
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
     */
    readonly enableBackgroundDelivery: (
        typeIdentifier: HKSampleTypeIdentifier,
        updateFrequency: HKUpdateFrequency
    ) => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery Apple Docs }
     */
    readonly disableBackgroundDelivery: (
        typeIdentifier: HKSampleTypeIdentifier
    ) => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery Apple Docs }
     */
    readonly disableAllBackgroundDelivery: () => Promise<boolean>;
}