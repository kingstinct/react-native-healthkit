import type { HybridObject } from 'react-native-nitro-modules'
import type {
  AuthorizationRequestStatus,
  AuthorizationStatus,
} from '../types/Auth'
import type { UpdateFrequency } from '../types/Background'
import type {
  ClinicalRecord,
  ClinicalRecordsWithAnchorResponse,
} from '../types/ClinicalRecord'
import type { ClinicalTypeIdentifier } from '../types/ClinicalTypeIdentifier'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'
import type { OnChangeCallbackArgs } from '../types/Subscriptions'

/**
 * Access to clinical health records (FHIR data) in HealthKit.
 *
 * @see {@link https://developer.apple.com/documentation/healthkit/accessing-health-records Apple Docs }
 */
export interface HealthRecordsModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
   */
  isHealthDataAvailable(): boolean

  /**
   * Whether the current device supports clinical records. Health Records are
   * only available in some regions.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994970-supportshealthrecords Apple Docs }
   */
  supportsHealthRecords(): boolean

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
  authorizationStatusFor(type: ClinicalTypeIdentifier): AuthorizationStatus

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
   */
  getRequestStatusForAuthorization(
    toRead: readonly ClinicalTypeIdentifier[],
  ): Promise<AuthorizationRequestStatus>

  /**
   * Requests read access to the given clinical record types. Clinical records
   * are read-only, so there is nothing to share.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
   */
  requestAuthorization(
    toRead: readonly ClinicalTypeIdentifier[],
  ): Promise<boolean>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hksamplequery Apple Docs }
   */
  queryClinicalRecords(
    clinicalType: ClinicalTypeIdentifier,
    options: QueryOptionsWithSortOrder,
  ): Promise<readonly ClinicalRecord[]>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery Apple Docs }
   */
  queryClinicalRecordsWithAnchor(
    clinicalType: ClinicalTypeIdentifier,
    options: QueryOptionsWithAnchor,
  ): Promise<ClinicalRecordsWithAnchorResponse>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkobserverquery Apple Docs }
   */
  subscribeToObserverQuery(
    clinicalType: ClinicalTypeIdentifier,
    callback: (args: OnChangeCallbackArgs) => void,
  ): string

  unsubscribeQuery(queryId: string): boolean

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
   */
  enableBackgroundDelivery(
    clinicalType: ClinicalTypeIdentifier,
    updateFrequency: UpdateFrequency,
  ): Promise<boolean>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery Apple Docs }
   */
  disableBackgroundDelivery(
    clinicalType: ClinicalTypeIdentifier,
  ): Promise<boolean>
}
