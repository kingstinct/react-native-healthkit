import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "../types/Shared";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";

export interface EmitterSubscription {
    remove: () => void;
}

export interface OnChangeCallbackArgs {
    readonly typeIdentifier: string;
    readonly errorMessage?: string;
}

interface IdentifierWithUnit {
    typeIdentifier: string;
    unit: string;
}

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
    readonly source?: Source;
    readonly version?: string;
    readonly operatingSystemVersion?: string | null;
    readonly productType?: string | null;
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


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus Apple Docs }
 */
export enum AuthorizationRequestStatus {
    unknown = 0,
    shouldRequest = 1,
    unnecessary = 2,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
export enum AuthorizationStatus {
    notDetermined = 0,
    sharingDenied = 1,
    sharingAuthorized = 2,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
export enum UpdateFrequency {
    immediate = 1,
    hourly = 2,
    daily = 3,
    weekly = 4,
}

export interface CoreModule extends HybridObject<{ ios: 'swift' }> {
/**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
     */
    enableBackgroundDelivery(
        typeIdentifier: string,
        updateFrequency: number
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

    /**
     *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
     */
    isHealthDataAvailable(): boolean;
    isHealthDataAvailableAsync(): Promise<boolean>;

    isProtectedDataAvailable(): boolean;
    isProtectedDataAvailableAsync(): Promise<boolean>;

    getPreferredUnits(
        identifiers: readonly QuantityTypeIdentifier[],
        forceUpdate?: boolean
    ): Promise<IdentifierWithUnit[]>;

    querySources(
        identifier: SampleTypeIdentifier
    ): Promise<readonly Source[]>;

    /** @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-requestauthorizationtoaccess Apple Docs }
     * @param {SampleTypeIdentifier} typeIdentifier - The type identifier of the sample to request authorization for.
     * @param {(args: OnChangeCallbackArgs) => void} callback - An array of type identifiers that the app wants to write.
     * @returns A promise that resolves to a boolean indicating whether the authorization was successful.*/
    subscribeToObserverQuery(
        /**
         * @type {SampleTypeIdentifier}
        */
        typeIdentifier: string,
        callback: (args: OnChangeCallbackArgs) => void
    ): string;

    unsubscribeQuery(queryId: string): boolean;
    unsubscribeQueryAsync(queryId: string): Promise<boolean>;

        /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
    authorizationStatusFor(
        type: SampleTypeIdentifier
    ): AuthorizationStatus;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
     */
    getRequestStatusForAuthorization(
        write: SampleTypeIdentifier[],
        read: SampleTypeIdentifier[]
    ): Promise<AuthorizationRequestStatus>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
     */
    requestAuthorization(
        write: SampleTypeIdentifier[],
        read: SampleTypeIdentifier[]
    ): Promise<boolean>;
}