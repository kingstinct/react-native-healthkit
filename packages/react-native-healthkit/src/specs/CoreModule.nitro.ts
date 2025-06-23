import type { HybridObject } from 'react-native-nitro-modules'
import type {
  AuthorizationRequestStatus,
  AuthorizationStatus,
} from '../types/Auth'
import type { UpdateFrequency } from '../types/Background'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import type { FilterForSamples } from '../types/QueryOptions'
import type {
  ObjectTypeIdentifier,
  SampleTypeIdentifier,
  SampleTypeIdentifierWriteable,
} from '../types/Shared'
import type { OnChangeCallbackArgs } from '../types/Subscriptions'
import type { IdentifierWithUnit } from '../types/Units'
import type { SourceProxy } from './SourceProxy.nitro'

export interface CoreModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
   */
  enableBackgroundDelivery(
    typeIdentifier: ObjectTypeIdentifier,
    updateFrequency: UpdateFrequency,
  ): Promise<boolean>
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery Apple Docs }
   */
  disableBackgroundDelivery(
    typeIdentifier: ObjectTypeIdentifier,
  ): Promise<boolean>
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery Apple Docs }
   */
  disableAllBackgroundDelivery(): Promise<boolean>

  /**
   *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
   */
  isHealthDataAvailable(): boolean
  isHealthDataAvailableAsync(): Promise<boolean>

  isProtectedDataAvailable(): boolean
  isProtectedDataAvailableAsync(): Promise<boolean>

  getPreferredUnits(
    identifiers: readonly QuantityTypeIdentifier[],
    forceUpdate?: boolean,
  ): Promise<IdentifierWithUnit[]>

  querySources(
    identifier: SampleTypeIdentifier,
  ): Promise<readonly SourceProxy[]>

  /** @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-requestauthorizationtoaccess Apple Docs }
   * @param {SampleTypeIdentifier} typeIdentifier - The type identifier of the sample to request authorization for.
   * @param {(args: OnChangeCallbackArgs) => void} callback - An array of type identifiers that the app wants to write.
   * @returns A promise that resolves to a boolean indicating whether the authorization was successful.*/
  subscribeToObserverQuery(
    typeIdentifier: SampleTypeIdentifier,
    callback: (args: OnChangeCallbackArgs) => void,
  ): string

  unsubscribeQuery(queryId: string): boolean
  unsubscribeQueryAsync(queryId: string): Promise<boolean>

  unsubscribeQueries(queryIds: string[]): number
  unsubscribeQueriesAsync(queryIds: string[]): Promise<number>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
  authorizationStatusFor(type: ObjectTypeIdentifier): AuthorizationStatus
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
   */
  getRequestStatusForAuthorization(
    toShare: readonly SampleTypeIdentifierWriteable[],
    toRead: readonly ObjectTypeIdentifier[],
  ): Promise<AuthorizationRequestStatus>
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
   */
  requestAuthorization(
    toShare: readonly SampleTypeIdentifierWriteable[],
    toRead: readonly ObjectTypeIdentifier[],
  ): Promise<boolean>

  deleteObjects(
    objectTypeIdentifier: ObjectTypeIdentifier,
    filter: FilterForSamples,
  ): Promise<number>

  isObjectTypeAvailable(objectTypeIdentifier: ObjectTypeIdentifier): boolean

  areObjectTypesAvailable(
    objectTypeIdentifiers: readonly ObjectTypeIdentifier[],
  ): Record<string, boolean>

  areObjectTypesAvailableAsync(
    objectTypeIdentifiers: ObjectTypeIdentifier[],
  ): Promise<Record<string, boolean>>

  isObjectTypeAvailableAsync(
    objectTypeIdentifier: ObjectTypeIdentifier,
  ): Promise<boolean>
}
