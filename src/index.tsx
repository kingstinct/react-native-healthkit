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
  isHealthDataAvailable: () => Promise.resolve(false),
  useLastSample: UnavailableFn,
  getRequestStatusForAuthorization: UnavailableFn,
  getPreferredUnits: UnavailableFn,
  getFitzpatrickSkinType: UnavailableFn,
  getWheelchairUse: UnavailableFn,
  getStatsBetween: UnavailableFn,
  getBloodType: UnavailableFn,
  authorizationStatusFor: UnavailableFn,
  getBiologicalSex: UnavailableFn,
  requestAuthorization: UnavailableFn,
  getPreferredUnit: UnavailableFn,
  getDateOfBirth: UnavailableFn,
  getSamplesBetween: UnavailableFn,
  getLastSamples: UnavailableFn,
  getLastSample: UnavailableFn,
  on: UnavailableFn,
  save: UnavailableFn,
};

export default Healthkit;
