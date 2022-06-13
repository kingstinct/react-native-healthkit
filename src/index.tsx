import { Platform } from 'react-native';
import type { ReactNativeHealthkit } from './types';

const notAvailableError =
  'Platform "' +
  Platform.OS +
  '" not supported, use isHealthDataAvailable to check for availability before using it';

const UnavailableFn = () => {
  throw new Error(notAvailableError);
};

const Healthkit: ReactNativeHealthkit = {
  authorizationStatusFor: UnavailableFn,
  buildUnitWithPrefix: UnavailableFn,
  disableAllBackgroundDelivery: UnavailableFn,
  disableBackgroundDelivery: UnavailableFn,
  enableBackgroundDelivery: UnavailableFn,
  getBiologicalSex: UnavailableFn,
  getBloodType: UnavailableFn,
  getDateOfBirth: UnavailableFn,
  getFitzpatrickSkinType: UnavailableFn,
  getMostRecentCategorySample: UnavailableFn,
  getMostRecentQuantitySample: UnavailableFn,
  getMostRecentWorkout: UnavailableFn,
  getPreferredUnit: UnavailableFn,
  getPreferredUnits: UnavailableFn,
  getRequestStatusForAuthorization: UnavailableFn,
  getWheelchairUse: UnavailableFn,
  getWorkoutRoutes: UnavailableFn,
  isHealthDataAvailable: () => Promise.resolve(false),
  queryCategorySamples: UnavailableFn,
  queryCorrelationSamples: UnavailableFn,
  queryQuantitySamples: UnavailableFn,
  queryStatisticsForQuantity: UnavailableFn,
  queryWorkouts: UnavailableFn,
  requestAuthorization: UnavailableFn,
  saveCategorySample: UnavailableFn,
  saveCorrelationSample: UnavailableFn,
  saveQuantitySample: UnavailableFn,
  saveWorkoutSample: UnavailableFn,
  subscribeToChanges: UnavailableFn,
  useMostRecentCategorySample: UnavailableFn,
  useMostRecentQuantitySample: UnavailableFn,
  useMostRecentWorkout: UnavailableFn,
  useSubscribeToChanges: UnavailableFn,
};

export * from './native-types';
export * from './types';

export default Healthkit;
