import { NativeModule, NativeModules } from 'react-native'

import type Native from './native-types'

const mockModule: (NativeModule & typeof Native) = {
  isHealthDataAvailable: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  authorizationStatusFor: jest.fn(),
  requestAuthorization: jest.fn(),
  saveQuantitySample: jest.fn(),
  deleteQuantitySample: jest.fn(),
  disableAllBackgroundDelivery: jest.fn(),
  disableBackgroundDelivery: jest.fn(),
  enableBackgroundDelivery: jest.fn(),
  getBiologicalSex: jest.fn(),
  getBloodType: jest.fn(),
  getDateOfBirth: jest.fn(),
  getFitzpatrickSkinType: jest.fn(),
  getPreferredUnits: jest.fn(),
  getRequestStatusForAuthorization: jest.fn(),
  getWheelchairUse: jest.fn(),
  getWorkoutRoutes: jest.fn(),
  queryCategorySamples: jest.fn(),
  queryCorrelationSamples: jest.fn(),
  queryQuantitySamples: jest.fn(),
  queryStatisticsForQuantity: jest.fn(),
  queryWorkoutSamples: jest.fn(),
  saveCategorySample: jest.fn(),
  saveCorrelationSample: jest.fn(),
  saveWorkoutSample: jest.fn(),
  subscribeToObserverQuery: jest.fn(),
  unsubscribeQuery: jest.fn(),
  canAccessProtectedData: jest.fn(),
}

NativeModules.ReactNativeHealthkit = mockModule
