import useHealthkitAuthorization from './hooks/useHealthkitAuthorization'
import useIsHealthDataAvailable from './hooks/useIsHealthDataAvailable'
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample'
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from './hooks/useMostRecentWorkout'
import useSubscribeToChanges from './hooks/useSubscribeToChanges'
import Native from './native-types'
import deleteQuantitySample from './utils/deleteQuantitySample'
import getDateOfBirth from './utils/getDateOfBirth'
import getMostRecentCategorySample from './utils/getMostRecentCategorySample'
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample'
import getMostRecentWorkout from './utils/getMostRecentWorkout'
import getPreferredUnit from './utils/getPreferredUnit'
import getPreferredUnits from './utils/getPreferredUnits'
import getRequestStatusForAuthorization from './utils/getRequestStatusForAuthorization'
import queryCategorySamples from './utils/queryCategorySamples'
import queryCorrelationSamples from './utils/queryCorrelationSamples'
import queryQuantitySamples from './utils/queryQuantitySamples'
import queryStatisticsForQuantity from './utils/queryStatisticsForQuantity'
import queryWorkouts from './utils/queryWorkouts'
import requestAuthorization from './utils/requestAuthorization'
import saveCategorySample from './utils/saveCategorySample'
import saveCorrelationSample from './utils/saveCorrelationSample'
import saveQuantitySample from './utils/saveQuantitySample'
import saveWorkoutSample from './utils/saveWorkoutSample'
import subscribeToChanges from './utils/subscribeToChanges'

const Healthkit = {
  authorizationStatusFor: Native.authorizationStatusFor.bind(Native),

  isHealthDataAvailable: Native.isHealthDataAvailable.bind(Native),
  canAccessProtectedData: Native.canAccessProtectedData.bind(Native),

  disableAllBackgroundDelivery:
    Native.disableAllBackgroundDelivery.bind(Native),
  disableBackgroundDelivery: Native.disableBackgroundDelivery.bind(Native),
  enableBackgroundDelivery: Native.enableBackgroundDelivery.bind(Native),

  // simple convenience getters
  getBiologicalSex: Native.getBiologicalSex.bind(Native),
  getFitzpatrickSkinType: Native.getFitzpatrickSkinType.bind(Native),
  getWheelchairUse: Native.getWheelchairUse.bind(Native),
  getBloodType: Native.getBloodType.bind(Native),

  getWorkoutRoutes: Native.getWorkoutRoutes.bind(Native),

  getDateOfBirth,

  getMostRecentQuantitySample,
  getMostRecentCategorySample,
  getMostRecentWorkout,

  getPreferredUnit,
  getPreferredUnits,
  getRequestStatusForAuthorization,

  // query methods
  queryCategorySamples,
  queryCorrelationSamples,
  queryQuantitySamples,
  queryStatisticsForQuantity,
  queryWorkouts,

  requestAuthorization,

  // delete methods
  deleteQuantitySample,

  // save methods
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,

  // subscriptions
  subscribeToChanges,

  // hooks
  useMostRecentCategorySample,

  useMostRecentQuantitySample,
  useMostRecentWorkout,

  useSubscribeToChanges,

  useIsHealthDataAvailable,
  useHealthkitAuthorization,
}

export * from './types'

export default Healthkit
