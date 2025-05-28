import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";

export interface EmitterSubscription {
    remove: () => void;
}

export interface OnChangeCallbackArgs {
    readonly typeIdentifier: SampleTypeIdentifier;
}

export interface Core extends HybridObject<{ ios: 'swift' }> {
    /**
       *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
       */
    isHealthDataAvailable(): boolean;
    isProtectedDataAvailable(): boolean;
    getPreferredUnits(
        identifiers: readonly QuantityTypeIdentifier[]
    ): Promise<Record<string, string>>;

    addListener(
        callback: (args: OnChangeCallbackArgs) => void
    ): EmitterSubscription;

    subscribeToObserverQuery(
        identifier: string
    ): Promise<string>;
    unsubscribeQuery(queryId: string): Promise<boolean>;
}