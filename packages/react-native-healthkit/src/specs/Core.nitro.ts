import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";

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
    isHealthDataAvailable(): Promise<boolean>;
    isProtectedDataAvailable(): Promise<boolean>;

    addListener(
        callback: (args: OnChangeCallbackArgs) => void
    ): EmitterSubscription;

    subscribeToObserverQuery(
        identifier: string
    ): Promise<string>;
    unsubscribeQuery(queryId: string): Promise<boolean>;
}