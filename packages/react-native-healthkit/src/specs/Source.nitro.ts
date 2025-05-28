import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export interface Source {
    readonly name: string;
    readonly bundleIdentifier: string;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface SourceRevision {
    readonly source: Source;
    readonly version: string;
    readonly operatingSystemVersion?: string;
    readonly productType?: string;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface Device {
    readonly name: string | null; // ex: "Apple Watch"
    readonly firmwareVersion: string | null;
    readonly hardwareVersion: string | null; // ex: "Watch6,2",
    readonly localIdentifier: string | null;
    readonly manufacturer: string | null; // ex: "Apple Inc."
    readonly model: string | null; // ex: "Watch"
    readonly softwareVersion: string | null; // ex: "9.0"
    readonly udiDeviceIdentifier: string | null;
};



export interface Source extends HybridObject<{ ios: 'swift' }> {
    querySources(
        identifier: SampleTypeIdentifier
    ): Promise<readonly Source[]>;
}