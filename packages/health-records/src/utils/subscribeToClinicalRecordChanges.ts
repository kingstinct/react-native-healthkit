import { HealthRecords } from '../modules'
import type { ClinicalTypeIdentifier } from '../types/ClinicalTypeIdentifier'
import type {
  EmitterSubscription,
  OnChangeCallbackArgs,
} from '../types/Subscriptions'

/**
 * Subscribe to changes for a clinical record type. The callback fires whenever
 * HealthKit reports new, updated or deleted records of that type; query again
 * (typically with an anchor) to fetch what changed.
 */
export const subscribeToClinicalRecordChanges = (
  clinicalType: ClinicalTypeIdentifier,
  callback: (args: OnChangeCallbackArgs) => void,
): EmitterSubscription => {
  const queryId = HealthRecords.subscribeToObserverQuery(clinicalType, callback)

  return {
    remove: () => HealthRecords.unsubscribeQuery(queryId),
  }
}
