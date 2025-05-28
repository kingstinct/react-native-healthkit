import type { HybridObject } from "react-native-nitro-modules";
import type { SampleTypeIdentifier } from "./Shared";
/*import type { CharacteristicTypeIdentifier } from "./Characteristic.nitro";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";*/

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

export interface Auth extends HybridObject<{ ios: 'swift' }> {
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