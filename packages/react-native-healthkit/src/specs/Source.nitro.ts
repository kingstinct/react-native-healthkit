import type { HybridObject } from "react-native-nitro-modules";
import type{ HKSampleTypeIdentifier } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export interface HKSource {
    readonly name: string;
    readonly bundleIdentifier: string;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface HKSourceRevision {
    readonly source: HKSource;
    readonly version: string;
    readonly operatingSystemVersion?: string;
    readonly productType?: string;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface HKDevice {
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
    readonly querySources: (
        identifier: HKSampleTypeIdentifier
    ) => Promise<readonly HKSource[]>;
}