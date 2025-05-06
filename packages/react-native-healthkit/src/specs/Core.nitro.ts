import type { EmitterSubscription } from "react-native";
import type { HybridObject } from "react-native-nitro-modules";
import type { HKSampleTypeIdentifier } from "./Shared";



type QueryId = string;


type OnChangeCallback = ({
    typeIdentifier,
}: {
    readonly typeIdentifier: HKSampleTypeIdentifier;
}) => void;

export interface Core extends HybridObject<{ ios: 'swift' }> {

    /**
       *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
       */
    isHealthDataAvailable(): Promise<boolean>;
    isProtectedDataAvailable(): Promise<boolean>;

    readonly addListener: (
        eventType: 'onChange',
        callback: OnChangeCallback
    ) => EmitterSubscription;

    subscribeToObserverQuery(
        identifier: HKSampleTypeIdentifier
    ): Promise<QueryId>;
    unsubscribeQuery(queryId: QueryId): Promise<boolean>;
}