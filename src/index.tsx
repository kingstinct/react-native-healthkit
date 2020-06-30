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
  isHealthDataAvailable: () => Promise.resolve(false),
  queryCategorySamples: UnavailableFn,
  queryQuantitySamples: UnavailableFn,
  queryStatisticsForQuantity: UnavailableFn,
  queryWorkouts: UnavailableFn,
  requestAuthorization: UnavailableFn,
  saveCategorySample: UnavailableFn,
  saveQuantitySample: UnavailableFn,
  subscribeToChanges: UnavailableFn,
  useMostRecentCategorySample: UnavailableFn,
  useMostRecentQuantitySample: UnavailableFn,
  useMostRecentWorkout: UnavailableFn,
  buildUnitWithPrefix: UnavailableFn,
};

export {
  HKWorkout,
  HKQuantitySample,
  HKCategorySample,
  QueryStatisticsResponse,
} from './types';

export {
  HKCategoryTypeIdentifier,
  HKQuantityTypeIdentifier,
  HKCharacteristicTypeIdentifier,
  HKQuantity,
  HKStatisticsOptions,
  HKUnit,
  HKInsulinDeliveryReason,
} from './native-types';

export default Healthkit;
