import { Platform } from 'react-native';
import type { ReactNativeHealthkit } from './types';

const notAvailableError =
  'Platform "' +
  Platform.OS +
  '" not supported, use isHealthDataAvailable to check for availability before using it';

const Healthkit: ReactNativeHealthkit = {
  isHealthDataAvailable: () => Promise.resolve(false),
  observe: () => {
    throw new Error(notAvailableError);
  },
  getRequestStatusForAuthorization: () => {
    throw new Error(notAvailableError);
  },
  getPreferredUnits: () => {
    throw new Error(notAvailableError);
  },
  getFitzpatrickSkinType: () => {
    throw new Error(notAvailableError);
  },
  getBloodType: () => {
    throw new Error(notAvailableError);
  },
  authorizationStatusFor: () => {
    throw new Error(notAvailableError);
  },
  getBiologicalSex: () => {
    throw new Error(notAvailableError);
  },
  requestAuthorization: () => {
    throw new Error(notAvailableError);
  },
  getPreferredUnit: () => {
    throw new Error(notAvailableError);
  },
  getDateOfBirth: () => {
    throw new Error(notAvailableError);
  },
  getSamplesBetween: () => {
    throw new Error(notAvailableError);
  },
  getLastSamples: () => {
    throw new Error(notAvailableError);
  },
  getLastSample: () => {
    throw new Error(notAvailableError);
  },
  on: () => {
    throw new Error(notAvailableError);
  },
  off: () => {
    throw new Error(notAvailableError);
  },
  writeSample: () => {
    throw new Error(notAvailableError);
  },
};

export default Healthkit;
