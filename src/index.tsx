import { Platform } from 'react-native'

import {
  HKAuthorizationRequestStatus, HKBiologicalSex, HKBloodType, HKFitzpatrickSkinType, HKUnits, HKWheelchairUse,
} from './native-types'

import type ReactNativeHealthkit from './index.ios'

const notAvailableError = `[@kingstinct/react-native-healthkit] Platform "${
  Platform.OS
}" not supported`

let hasWarned = false

function UnavailableFn<T = unknown>(retVal: T) {
  return () => {
    if (!hasWarned) {
      // eslint-disable-next-line no-console
      console.warn(notAvailableError)
      hasWarned = true
    }
    return retVal
  }
}

const Healthkit: typeof ReactNativeHealthkit = {
  authorizationStatusFor: UnavailableFn(Promise.resolve(false)),
  disableAllBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  disableBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  enableBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  getBiologicalSex: UnavailableFn(Promise.resolve(HKBiologicalSex.notSet)),
  getBloodType: UnavailableFn(Promise.resolve(HKBloodType.notSet)),
  getDateOfBirth: UnavailableFn(Promise.resolve(new Date(0))),
  getFitzpatrickSkinType: UnavailableFn(Promise.resolve(HKFitzpatrickSkinType.notSet)),
  getMostRecentCategorySample: UnavailableFn(Promise.resolve(null)),
  getMostRecentQuantitySample: UnavailableFn(Promise.resolve(null)),
  getMostRecentWorkout: UnavailableFn(Promise.resolve(null)),
  getPreferredUnit: UnavailableFn(Promise.resolve(HKUnits.Count)),
  getPreferredUnits: UnavailableFn(Promise.resolve([])),
  getRequestStatusForAuthorization: UnavailableFn(Promise.resolve(HKAuthorizationRequestStatus.unknown)),
  getWheelchairUse: UnavailableFn(Promise.resolve(HKWheelchairUse.notSet)),
  getWorkoutRoutes: UnavailableFn(Promise.resolve([])),
  isHealthDataAvailable: async () => Promise.resolve(false),
  queryCategorySamples: UnavailableFn(Promise.resolve([])),
  queryCorrelationSamples: UnavailableFn(Promise.resolve([])),
  queryQuantitySamples: UnavailableFn(Promise.resolve([])),
  queryStatisticsForQuantity: UnavailableFn(Promise.resolve({
    averageQuantity: undefined,
    maximumQuantity: undefined,
    minimumQuantity: undefined,
    sumQuantity: undefined,
    mostRecentQuantity: undefined,
    mostRecentQuantityDateInterval: undefined,
    duration: undefined,
  })),
  queryWorkouts: UnavailableFn(Promise.resolve([])),
  requestAuthorization: UnavailableFn(Promise.resolve(false)),
  deleteQuantitySample: UnavailableFn(Promise.resolve(false)),
  saveCategorySample: UnavailableFn(Promise.resolve(false)),
  saveCorrelationSample: UnavailableFn(Promise.resolve(false)),
  saveQuantitySample: UnavailableFn(Promise.resolve(false)),
  saveWorkoutSample: UnavailableFn(Promise.resolve(false)),
  subscribeToChanges: UnavailableFn(Promise.resolve(async () => Promise.resolve(false))),
  useMostRecentCategorySample: UnavailableFn(null),
  useMostRecentQuantitySample: UnavailableFn(null),
  useMostRecentWorkout: UnavailableFn(null),
  useSubscribeToChanges: UnavailableFn([null, () => null]),
  useHealthkitAuthorization: UnavailableFn([null, async () => Promise.resolve(HKAuthorizationRequestStatus.unknown)] as const),
  useIsHealthDataAvailable: () => false,
  canAccessProtectedData: async () => Promise.resolve(false),
}

export * from './types'

export default Healthkit
