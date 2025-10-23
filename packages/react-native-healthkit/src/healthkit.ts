import { Platform } from 'react-native'

// Import types for default values and function signatures.
// These types are expected to be available via the './types' export.
// You might need to adjust the import path or ensure these types are correctly exported from './types'

// This import is crucial for deriving the type of the default export `HealthkitModule`
// It assumes that index.ios.ts exports a default object matching the Healthkit native module structure.
import type ReactNativeHealthkit from './healthkit.ios'
import type { WorkoutProxy } from './specs/WorkoutProxy.nitro'
import { AuthorizationRequestStatus, AuthorizationStatus } from './types/Auth'
import type {
  CategorySamplesWithAnchorResponseTyped,
  CategorySampleTyped,
} from './types/CategoryType'
import type { CategoryTypeIdentifier } from './types/CategoryTypeIdentifier'
import {
  BiologicalSex,
  BloodType,
  FitzpatrickSkinType,
  WheelchairUse,
} from './types/Characteristics'
import type { QuantitySample } from './types/QuantitySample'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from './types/QueryOptions'

export * from './types'

const notAvailableError = `[@kingstinct/react-native-healthkit] Platform "${Platform.OS}" not supported. HealthKit is only available on iOS.`

let hasWarned = false

function UnavailableFnFromModule<
  TKey extends keyof typeof ReactNativeHealthkit,
  // biome-ignore lint/complexity/noBannedTypes: it works
  T extends Function = (typeof ReactNativeHealthkit)[TKey],
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

// --- Mock Implementations for exported functions ---

// CoreModule functions
export const authorizationStatusFor = UnavailableFnFromModule(
  'authorizationStatusFor',
  AuthorizationStatus.notDetermined,
)
export const disableAllBackgroundDelivery = UnavailableFnFromModule(
  'disableAllBackgroundDelivery',
  Promise.resolve(false),
)
export const disableBackgroundDelivery = UnavailableFnFromModule(
  'disableBackgroundDelivery',
  Promise.resolve(false),
)
export const enableBackgroundDelivery = UnavailableFnFromModule(
  'enableBackgroundDelivery',
  Promise.resolve(false),
)
export const getPreferredUnits = UnavailableFnFromModule(
  'getPreferredUnits',
  Promise.resolve([]),
)
export const getRequestStatusForAuthorization = UnavailableFnFromModule(
  'getRequestStatusForAuthorization',
  Promise.resolve(AuthorizationRequestStatus.unknown),
)
export const isHealthDataAvailable = UnavailableFnFromModule(
  'isHealthDataAvailable',
  false,
) // Original was synchronous
export const isHealthDataAvailableAsync = UnavailableFnFromModule(
  'isHealthDataAvailableAsync',
  Promise.resolve(false),
) // Added for consistency if needed
export const querySources = UnavailableFnFromModule(
  'querySources',
  Promise.resolve([]),
)
export const requestAuthorization = UnavailableFnFromModule(
  'requestAuthorization',
  Promise.resolve(false),
)
export const deleteObjects = UnavailableFnFromModule(
  'deleteObjects',
  Promise.resolve(0),
)
export const subscribeToChanges = UnavailableFnFromModule(
  'subscribeToChanges',
  'dummy-query-uuid',
) // Mocking the observer query UUID
export const isProtectedDataAvailable = UnavailableFnFromModule(
  'isProtectedDataAvailable',
  false,
)
export const isObjectTypeAvailable = UnavailableFnFromModule(
  'isObjectTypeAvailable',
  false,
)
export const isObjectTypeAvailableAsync = UnavailableFnFromModule(
  'isObjectTypeAvailableAsync',
  Promise.resolve(false),
)
export const areObjectTypesAvailable = UnavailableFnFromModule(
  'areObjectTypesAvailable',
  {},
)
export const areObjectTypesAvailableAsync = UnavailableFnFromModule(
  'areObjectTypesAvailableAsync',
  Promise.resolve({}),
)

// CharacteristicTypeModule functions
export const getBiologicalSex = UnavailableFnFromModule(
  'getBiologicalSex',
  BiologicalSex.notSet,
)
export const getBloodType = UnavailableFnFromModule(
  'getBloodType',
  BloodType.notSet,
)
export const getDateOfBirth = UnavailableFnFromModule(
  'getDateOfBirth',
  new Date(0),
) // Assuming string for date
export const getFitzpatrickSkinType = UnavailableFnFromModule(
  'getFitzpatrickSkinType',
  FitzpatrickSkinType.notSet,
)
export const getWheelchairUse = UnavailableFnFromModule(
  'getWheelchairUse',
  WheelchairUse.notSet,
)

// QuantityTypeModule functions
export const queryQuantitySamples = UnavailableFnFromModule(
  'queryQuantitySamples',
  Promise.resolve([]),
)
export const queryQuantitySamplesWithAnchor = UnavailableFnFromModule(
  'queryQuantitySamplesWithAnchor',
  Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
  }),
)
export const queryStatisticsForQuantity = UnavailableFnFromModule(
  'queryStatisticsForQuantity',
  Promise.resolve({}),
)
export const queryStatisticsCollectionForQuantity = UnavailableFnFromModule(
  'queryStatisticsCollectionForQuantity',
  Promise.resolve([]),
)
export const saveQuantitySample = UnavailableFnFromModule(
  'saveQuantitySample',
  Promise.resolve(false),
)
export const isQuantityCompatibleWithUnit = UnavailableFnFromModule(
  'isQuantityCompatibleWithUnit',
  false,
)

// CategoryTypeModule functions
export function queryCategorySamples<T extends CategoryTypeIdentifier>(
  _categoryTypeIdentifier: T,
  _options?: QueryOptionsWithSortOrder,
): Promise<CategorySampleTyped<T>[]> {
  if (Platform.OS !== 'ios' && !hasWarned) {
    console.warn(notAvailableError)
    hasWarned = true
  }
  return Promise.resolve([])
}

export function queryCategorySamplesWithAnchor<
  T extends CategoryTypeIdentifier,
>(
  _categoryTypeIdentifier: T,
  _options: QueryOptionsWithAnchor,
): Promise<CategorySamplesWithAnchorResponseTyped<T>> {
  if (Platform.OS !== 'ios' && !hasWarned) {
    console.warn(notAvailableError)
    hasWarned = true
  }
  return Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
  })
}
export const saveCategorySample = UnavailableFnFromModule(
  'saveCategorySample',
  Promise.resolve(false),
)

// CorrelationTypeModule functions
export const queryCorrelationSamples = UnavailableFnFromModule(
  'queryCorrelationSamples',
  Promise.resolve([]),
)
export const saveCorrelationSample = UnavailableFnFromModule(
  'saveCorrelationSample',
  Promise.resolve(false),
)

// HeartbeatSeriesModule functions
export const queryHeartbeatSeriesSamples = UnavailableFnFromModule(
  'queryHeartbeatSeriesSamples',
  Promise.resolve([]),
)
export const queryHeartbeatSeriesSamplesWithAnchor = UnavailableFnFromModule(
  'queryHeartbeatSeriesSamplesWithAnchor',
  Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
  }),
)

export const queryElectrocardiogramSamples = UnavailableFnFromModule(
  'queryElectrocardiogramSamples',
  Promise.resolve([]),
)

export const queryElectrocardiogramSamplesWithAnchor = UnavailableFnFromModule(
  'queryElectrocardiogramSamplesWithAnchor',
  Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
  }),
)

// WorkoutsModule functions
export const queryWorkoutSamples = UnavailableFnFromModule(
  'queryWorkoutSamples',
  Promise.resolve([]),
)
export const queryWorkoutSamplesWithAnchor = UnavailableFnFromModule(
  'queryWorkoutSamplesWithAnchor',
  Promise.resolve({
    workouts: [],
    deletedSamples: [],
    newAnchor: '',
  }),
)
export const saveWorkoutSample = UnavailableFnFromModule(
  'saveWorkoutSample',
  // biome-ignore lint/suspicious/noExplicitAny: it works
  Promise.resolve(undefined as any as WorkoutProxy),
)
export const startWatchApp = UnavailableFnFromModule(
  'startWatchApp',
  Promise.resolve(false),
)

// StateOfMindModule functions
export const queryStateOfMindSamples = UnavailableFnFromModule(
  'queryStateOfMindSamples',
  Promise.resolve([]),
)
export const saveStateOfMindSample = UnavailableFnFromModule(
  'saveStateOfMindSample',
  Promise.resolve(false),
)

// Utility functions (from original export list)
export function getMostRecentCategorySample<T extends CategoryTypeIdentifier>(
  _identifier: T,
): Promise<CategorySampleTyped<T> | undefined> {
  if (Platform.OS !== 'ios' && !hasWarned) {
    console.warn(notAvailableError)
    hasWarned = true
  }
  return Promise.resolve(undefined)
}

export const getMostRecentQuantitySample = UnavailableFnFromModule(
  'getMostRecentQuantitySample',
  // biome-ignore lint/suspicious/noExplicitAny: it works
  Promise.resolve(undefined as any as QuantitySample),
)
export const getMostRecentWorkout = UnavailableFnFromModule(
  'getMostRecentWorkout',
  // biome-ignore lint/suspicious/noExplicitAny: it works
  Promise.resolve(undefined as any as WorkoutProxy),
)
export const getPreferredUnit = UnavailableFnFromModule(
  'getPreferredUnit',
  Promise.resolve('count'),
) // Defaulting to 'count'

// Hooks (from original export list)
export function useMostRecentCategorySample<T extends CategoryTypeIdentifier>(
  _categoryTypeIdentifier: T,
): CategorySampleTyped<T> | undefined {
  if (Platform.OS !== 'ios' && !hasWarned) {
    console.warn(notAvailableError)
    hasWarned = true
  }
  return undefined
}

export const useMostRecentQuantitySample = UnavailableFnFromModule(
  'useMostRecentQuantitySample',
  undefined,
)
export const useMostRecentWorkout = UnavailableFnFromModule(
  'useMostRecentWorkout',
  undefined,
)
export const useSubscribeToChanges = UnavailableFnFromModule(
  'useSubscribeToChanges',
  undefined,
) // Mocking callback structure
export const useHealthkitAuthorization = UnavailableFnFromModule(
  'useHealthkitAuthorization',
  [
    AuthorizationRequestStatus.unknown,
    () => Promise.resolve(AuthorizationRequestStatus.unknown),
  ] as const,
)
export const useIsHealthDataAvailable = UnavailableFnFromModule(
  'useIsHealthDataAvailable',
  false,
)
export const useSources = UnavailableFnFromModule('useSources', null)
export const useStatisticsForQuantity = UnavailableFnFromModule(
  'useStatisticsForQuantity',
  null,
)

export const getBiologicalSexAsync = UnavailableFnFromModule(
  'getBiologicalSexAsync',
  Promise.resolve(BiologicalSex.notSet),
)
export const getBloodTypeAsync = UnavailableFnFromModule(
  'getBloodTypeAsync',
  Promise.resolve(BloodType.notSet),
)
export const getDateOfBirthAsync = UnavailableFnFromModule(
  'getDateOfBirthAsync',
  Promise.resolve(new Date(0)),
) // Assuming string for date
export const getFitzpatrickSkinTypeAsync = UnavailableFnFromModule(
  'getFitzpatrickSkinTypeAsync',
  Promise.resolve(FitzpatrickSkinType.notSet),
)
export const getWheelchairUseAsync = UnavailableFnFromModule(
  'getWheelchairUseAsync',
  Promise.resolve(WheelchairUse.notSet),
)

export const unsubscribeQueries = UnavailableFnFromModule(
  'unsubscribeQueries',
  0,
)

// --- Default Export ---
// This attempts to match the structure of the default export from index.ios.ts
const HealthkitModule = {
  // All named exports are also part of the default export object
  authorizationStatusFor,
  isObjectTypeAvailable,
  unsubscribeQueries,
  isObjectTypeAvailableAsync,
  areObjectTypesAvailable,
  areObjectTypesAvailableAsync,
  isQuantityCompatibleWithUnit,
  disableAllBackgroundDelivery,
  disableBackgroundDelivery,
  enableBackgroundDelivery,
  getBiologicalSex,
  getBloodType,
  getDateOfBirth,
  getFitzpatrickSkinType,
  getMostRecentCategorySample,
  getMostRecentQuantitySample,
  getMostRecentWorkout,
  getPreferredUnits,
  getPreferredUnit,
  getRequestStatusForAuthorization,
  getWheelchairUse,
  isHealthDataAvailable,
  isHealthDataAvailableAsync,
  queryCategorySamples,
  queryCategorySamplesWithAnchor,
  queryCorrelationSamples,
  queryHeartbeatSeriesSamples,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryElectrocardiogramSamples,
  queryElectrocardiogramSamplesWithAnchor,
  queryQuantitySamples,
  queryQuantitySamplesWithAnchor,
  queryStatisticsForQuantity,
  queryStatisticsCollectionForQuantity,
  queryWorkoutSamples,
  queryWorkoutSamplesWithAnchor,
  querySources,
  requestAuthorization,
  deleteObjects,
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,
  subscribeToChanges,
  startWatchApp,
  isProtectedDataAvailable,
  queryStateOfMindSamples,
  saveStateOfMindSample,

  // Hooks
  useMostRecentCategorySample,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSubscribeToChanges,
  useHealthkitAuthorization,
  useIsHealthDataAvailable,
  useSources,
  useStatisticsForQuantity,
  getBiologicalSexAsync,
  getBloodTypeAsync,
  getDateOfBirthAsync,
  getFitzpatrickSkinTypeAsync,
  getWheelchairUseAsync,
} as Omit<typeof ReactNativeHealthkit, 'default'>

export default {
  ...HealthkitModule,
  default: HealthkitModule,
} as typeof ReactNativeHealthkit
