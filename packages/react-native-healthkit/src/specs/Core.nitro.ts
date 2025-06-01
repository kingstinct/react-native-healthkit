import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";
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

export interface Core extends HybridObject<{ ios: 'swift' }> {
    /**
     *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
     */
    isHealthDataAvailable(): boolean;
    isHealthDataAvailableAsync(): Promise<boolean>;

    isProtectedDataAvailable(): boolean;
    isProtectedDataAvailableAsync(): Promise<boolean>;

    getPreferredUnits(
        identifiers: readonly string[]
    ): Promise<IdentifierWithUnit[]>;

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
}