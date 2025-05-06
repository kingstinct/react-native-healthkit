import type { HybridObject } from "react-native-nitro-modules";
import type { HKQuantityTypeIdentifier } from "./QuantityType.nitro";
import type { HKCategoryTypeIdentifier } from "./CategoryType.nitro";



/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export type HKSource = {
    readonly name: string;
    readonly bundleIdentifier: string;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export type HKSourceRevision = {
    readonly source: HKSource;
    readonly version: string;
    readonly operatingSystemVersion?: string;
    readonly productType?: string;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export type HKDevice = {
    readonly name: string; // ex: "Apple Watch"
    readonly firmwareVersion: string | null;
    readonly hardwareVersion: string; // ex: "Watch6,2",
    readonly localIdentifier: string | null;
    readonly manufacturer: string; // ex: "Apple Inc."
    readonly model: string; // ex: "Watch"
    readonly softwareVersion: string; // ex: "9.0"
    readonly udiDeviceIdentifier: string | null;
};



export interface Source extends HybridObject<{ ios: 'swift' }> {
    readonly querySources: <
        TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier
    >(
        identifier: TIdentifier
    ) => Promise<readonly HKSource[]>;
}