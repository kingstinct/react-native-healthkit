import { Platform } from 'react-native'

// This import is crucial for deriving the type of the default export.
// It assumes that healthRecords.ios.ts exports a default object matching the native module structure.
import type ReactNativeHealthRecords from './healthRecords.ios'
import { AuthorizationRequestStatus, AuthorizationStatus } from './types/Auth'
import { parseFHIRResourceData } from './utils/parseFHIRResourceData'

export * from './types'

const notAvailableError = `[@react-native-healthkit/health-records] Platform "${Platform.OS}" not supported. HealthKit is only available on iOS.`

let hasWarned = false

function UnavailableFnFromModule<
  TKey extends keyof typeof ReactNativeHealthRecords,
  // biome-ignore lint/complexity/noBannedTypes: it works
  T extends Function = (typeof ReactNativeHealthRecords)[TKey],
  // @ts-expect-error
>(_fn: TKey, defaultValue: ReturnType<T>): T {
  // @ts-expect-error
  return () => {
    if (Platform.OS !== 'ios' && !hasWarned) {
      console.warn(notAvailableError)
      hasWarned = true
    }
    return defaultValue
  }
}

export const isHealthDataAvailable = UnavailableFnFromModule(
  'isHealthDataAvailable',
  false,
)
export const supportsHealthRecords = UnavailableFnFromModule(
  'supportsHealthRecords',
  false,
)
export const authorizationStatusFor = UnavailableFnFromModule(
  'authorizationStatusFor',
  AuthorizationStatus.notDetermined,
)
export const getRequestStatusForAuthorization = UnavailableFnFromModule(
  'getRequestStatusForAuthorization',
  Promise.resolve(AuthorizationRequestStatus.unknown),
)
export const requestAuthorization = UnavailableFnFromModule(
  'requestAuthorization',
  Promise.resolve(false),
)
export const queryClinicalRecords = UnavailableFnFromModule(
  'queryClinicalRecords',
  Promise.resolve([]),
)
export const queryClinicalRecordsWithAnchor = UnavailableFnFromModule(
  'queryClinicalRecordsWithAnchor',
  Promise.resolve({ records: [], deletedRecords: [], newAnchor: '' }),
)
export const subscribeToClinicalRecordChanges = UnavailableFnFromModule(
  'subscribeToClinicalRecordChanges',
  { remove: () => false },
)
export const configureBackgroundTypes = UnavailableFnFromModule(
  'configureBackgroundTypes',
  Promise.resolve(false),
)
export const clearBackgroundTypes = UnavailableFnFromModule(
  'clearBackgroundTypes',
  Promise.resolve(false),
)
export const enableBackgroundDelivery = UnavailableFnFromModule(
  'enableBackgroundDelivery',
  Promise.resolve(false),
)
export const disableBackgroundDelivery = UnavailableFnFromModule(
  'disableBackgroundDelivery',
  Promise.resolve(false),
)

// Hooks
export const useHealthRecordsAuthorization = UnavailableFnFromModule(
  'useHealthRecordsAuthorization',
  [null, () => Promise.resolve(AuthorizationRequestStatus.unknown)] as const,
)
export const useClinicalRecords = UnavailableFnFromModule(
  'useClinicalRecords',
  {
    records: null,
    error: null,
    refetch: () => Promise.resolve(null),
  } as const,
)
export const useSubscribeToClinicalRecordChanges = UnavailableFnFromModule(
  'useSubscribeToClinicalRecordChanges',
  undefined,
)

export { parseFHIRResourceData }

const HealthRecordsModule = {
  authorizationStatusFor,
  clearBackgroundTypes,
  configureBackgroundTypes,
  disableBackgroundDelivery,
  enableBackgroundDelivery,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  parseFHIRResourceData,
  queryClinicalRecords,
  queryClinicalRecordsWithAnchor,
  requestAuthorization,
  subscribeToClinicalRecordChanges,
  supportsHealthRecords,

  // Hooks
  useClinicalRecords,
  useHealthRecordsAuthorization,
  useSubscribeToClinicalRecordChanges,
} as Omit<typeof ReactNativeHealthRecords, 'default'>

export default {
  ...HealthRecordsModule,
  default: HealthRecordsModule,
} as typeof ReactNativeHealthRecords
