import type { HybridObject } from "react-native-nitro-modules";
import type { HKCharacteristicTypeIdentifier } from "./Characteristic.nitro";
import type { HKSampleTypeIdentifier } from "./Shared";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKCategoryTypeIdentifier } from "../types/HKCategoryTypeIdentifier";

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

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
export enum HKAuthorizationStatus {
    notDetermined = 0,
    sharingDenied = 1,
    sharingAuthorized = 2,
}

export type WritePermissions = Record<
    HKCategoryTypeIdentifier | HKCharacteristicTypeIdentifier | HKQuantityTypeIdentifier,
    boolean
>;
  
export type ReadPermissions = Record<
    HKCategoryTypeIdentifier | HKCharacteristicTypeIdentifier | HKQuantityTypeIdentifier,
    boolean
>;

export interface Auth extends HybridObject<{ ios: 'swift' }> {
    /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
    authorizationStatusFor(
        type: Record<string, boolean>
    ): Promise<HKAuthorizationStatus>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
     */
    getRequestStatusForAuthorization(
        write: Record<string, boolean>,
        read: Record<string, boolean>
    ): Promise<HKAuthorizationRequestStatus>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
     */
    requestAuthorization(
        write: Record<string, boolean>,
        read: Record<string, boolean>
    ): Promise<boolean>;
}