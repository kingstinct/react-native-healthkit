import { jest, mock } from 'bun:test'

const mockModule = {
  queryWorkoutSamplesWithAnchor: jest.fn(),
  isHealthDataAvailable: jest.fn(),
  isHealthDataAvailableAsync: jest.fn(),
  isProtectedDataAvailable: jest.fn(),
  authorizationStatusFor: jest.fn(),
  requestAuthorization: jest.fn(),
  saveQuantitySample: jest.fn(),
  deleteQuantitySample: jest.fn(),
  deleteSamples: jest.fn(),
  deleteWorkoutSample: jest.fn(),
  disableAllBackgroundDelivery: jest.fn(),
  disableBackgroundDelivery: jest.fn(),
  enableBackgroundDelivery: jest.fn(),
  queryCategorySamplesWithAnchor: jest.fn(),
  queryQuantitySamplesWithAnchor: jest.fn(),
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
  queryHeartbeatSeriesSamples: jest.fn(),
  queryHeartbeatSeriesSamplesWithAnchor: jest.fn(),
  queryQuantitySamples: jest.fn(),
  querySources: jest.fn(),
  queryStatisticsForQuantity: jest.fn(),
  queryStatisticsCollectionForQuantity: jest.fn(),
  queryWorkoutSamples: jest.fn(),
  saveStateOfMindSample: jest.fn(),
  saveCategorySample: jest.fn(),
  saveCorrelationSample: jest.fn(),
  saveWorkoutSample: jest.fn(),
  subscribeToObserverQuery: jest.fn(),
  unsubscribeQuery: jest.fn(),
  saveWorkoutRoute: jest.fn(),
  getWorkoutPlanById: jest.fn(),
  startWatchAppWithWorkoutConfiguration: jest.fn(),
  deleteObjects: jest.fn(),
  isQuantityCompatibleWithUnit: jest.fn(),
  isObjectTypeAvailable: jest.fn(),
  isObjectTypeAvailableAsync: jest.fn(),
  areObjectTypesAvailable: jest.fn(),
  areObjectTypesAvailableAsync: jest.fn(),
  queryStateOfMindSamples: jest.fn(),
  workoutSessionMirroringStartHandler: jest.fn(),
}

await mock.module('react-native-nitro-modules', () => ({
  NitroModules: {
    createHybridObject: jest.fn((moduleName: string) => {
      if (moduleName === 'CoreModule') {
        return mockModule
      }
      return mockModule
    }),
  },
}))

await mock.module('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}))
