import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
export enum UpdateFrequency {
    immediate = 1,
    hourly = 2,
    daily = 3,
    weekly = 4,
}

export interface Background extends HybridObject<{ ios: 'swift' }> {
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
     */
    enableBackgroundDelivery(
        typeIdentifier: string,
        updateFrequency: UpdateFrequency
    ): Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery Apple Docs }
     */
    disableBackgroundDelivery(
        typeIdentifier: string
    ): Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery Apple Docs }
     */
    disableAllBackgroundDelivery(): Promise<boolean>;
}