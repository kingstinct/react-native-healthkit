import type { HybridObject } from "react-native-nitro-modules";
import type { HKCharacteristicTypeIdentifier } from "./Characteristic.nitro";
import type { HKCategoryTypeIdentifier } from "./CategoryType.nitro";
import type { HKQuantityTypeIdentifier } from "./QuantityType.nitro";
import type { HKSampleTypeIdentifier } from "./Shared";




/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus Apple Docs }
 */
export enum HKAuthorizationRequestStatus {
    unknown = 0,
    shouldRequest = 1,
    unnecessary = 2,
}


export type HealthkitReadAuthorization =
  | HKCharacteristicTypeIdentifier
  | HKSampleTypeIdentifier
  | `${HKCharacteristicTypeIdentifier}`
  | `${HKSampleTypeIdentifier}`;
  
export type HealthkitWriteAuthorization = HKSampleTypeIdentifier;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
export enum HKAuthorizationStatus {
    notDetermined = 0,
    sharingDenied = 1,
    sharingAuthorized = 2,
}


export type WritePermissions = {
    readonly [key in
    | HKCategoryTypeIdentifier
    | HKCharacteristicTypeIdentifier
    | HKQuantityTypeIdentifier]: boolean;
  };
  
  export type ReadPermissions = {
    readonly [key in
    | HKCategoryTypeIdentifier
    | HKCharacteristicTypeIdentifier
    | HKQuantityTypeIdentifier]: boolean;
  };

export interface Auth extends HybridObject<{ ios: 'swift' }> {
    /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
    authorizationStatusFor(
        type: HealthkitReadAuthorization
    ): Promise<HKAuthorizationStatus>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
     */
    getRequestStatusForAuthorization(
        write: WritePermissions,
        read: ReadPermissions
    ): Promise<HKAuthorizationRequestStatus>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
     */
    requestAuthorization(
        write: WritePermissions,
        read: ReadPermissions
    ): Promise<boolean>;
}