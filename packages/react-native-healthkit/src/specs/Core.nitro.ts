import type { HybridObject } from "react-native-nitro-modules";
import type { HKSampleTypeIdentifier } from "./Shared";

interface EmitterSubscription {
    remove: () => void;
}

type OnChangeCallbackArgs = {
    readonly typeIdentifier: HKSampleTypeIdentifier;
}

type OnChangeCallback = (args: OnChangeCallbackArgs) => void;

export interface Core extends HybridObject<{ ios: 'swift' }> {
    /**
       *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
       */
    isHealthDataAvailable(): Promise<boolean>;
    isProtectedDataAvailable(): Promise<boolean>;

    readonly addListener: (
        callback: OnChangeCallback
    ) => EmitterSubscription;

    subscribeToObserverQuery(
        identifier: HKSampleTypeIdentifier
    ): Promise<string>;
    unsubscribeQuery(queryId: string): Promise<boolean>;
}