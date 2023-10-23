import { Platform } from 'react-native'

import useHealthkitAuthorization from './hooks/useHealthkitAuthorization'
import useIsHealthDataAvailable from './hooks/useIsHealthDataAvailable'
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample'
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from './hooks/useMostRecentWorkout'
import useSources from './hooks/useSources'
import useStatisticsForQuantity from './hooks/useStatisticsForQuantity'
import useSubscribeToChanges from './hooks/useSubscribeToChanges'
import Native, { HKQuantityTypeIdentifier } from './native-types'
import deleteQuantitySample from './utils/deleteQuantitySample'
import deleteSamples from './utils/deleteSamples'
import getDateOfBirth from './utils/getDateOfBirth'
import getMostRecentCategorySample from './utils/getMostRecentCategorySample'
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample'
import getMostRecentWorkout from './utils/getMostRecentWorkout'
import getPreferredUnit from './utils/getPreferredUnit'
import getPreferredUnits from './utils/getPreferredUnits'
import getRequestStatusForAuthorization from './utils/getRequestStatusForAuthorization'
import getWorkoutPlanById from './utils/getWorkoutPlanById'
import queryCategorySamples from './utils/queryCategorySamples'
import queryCategorySamplesWithAnchor from './utils/queryCategorySamplesWithAnchor'
import queryCorrelationSamples from './utils/queryCorrelationSamples'
import queryHeartbeatSeriesSamples from './utils/queryHeartbeatSeriesSamples'
import queryHeartbeatSeriesSamplesWithAnchor from './utils/queryHeartbeatSeriesSamplesWithAnchor'
import queryQuantitySamples from './utils/queryQuantitySamples'
import queryQuantitySamplesWithAnchor from './utils/queryQuantitySamplesWithAnchor'
import querySources from './utils/querySources'
import queryStatisticsForQuantity from './utils/queryStatisticsForQuantity'
import queryWorkouts from './utils/queryWorkouts'
import requestAuthorization from './utils/requestAuthorization'
import saveCategorySample from './utils/saveCategorySample'
import saveCorrelationSample from './utils/saveCorrelationSample'
import saveQuantitySample from './utils/saveQuantitySample'
import saveWorkoutRoute from './utils/saveWorkoutRoute'
import saveWorkoutSample from './utils/saveWorkoutSample'
import subscribeToChanges from './utils/subscribeToChanges'

const currentMajorVersionIOS = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : 0

const allQuantityTypesList = [...Object.values(HKQuantityTypeIdentifier)]

const availableQuantityTypes = (majorVersionIOS = currentMajorVersionIOS) => {
  if (majorVersionIOS >= 17) {
    return allQuantityTypesList
  }

  // remove types that are not available before iOS 17
  return allQuantityTypesList.filter((type) => ![
    HKQuantityTypeIdentifier.cyclingCadence,
    HKQuantityTypeIdentifier.cyclingFunctionalThresholdPower,
    HKQuantityTypeIdentifier.cyclingPower,
    HKQuantityTypeIdentifier.cyclingSpeed,
    HKQuantityTypeIdentifier.physicalEffort,
    HKQuantityTypeIdentifier.timeInDaylight,
  ].includes(type))
}

const authorizationStatusFor = Native.authorizationStatusFor.bind(Native)
const isHealthDataAvailable = Native.isHealthDataAvailable.bind(Native)
// Todo [>8]: Rename to align with Apple function name (isProtectedDataAvailable)
const canAccessProtectedData = Native.canAccessProtectedData.bind(Native)
const disableBackgroundDelivery = Native.disableBackgroundDelivery.bind(Native)
const disableAllBackgroundDelivery = Native.disableAllBackgroundDelivery.bind(Native)
const enableBackgroundDelivery = Native.enableBackgroundDelivery.bind(Native)
const getBiologicalSex = Native.getBiologicalSex.bind(Native)
const getFitzpatrickSkinType = Native.getFitzpatrickSkinType.bind(Native)
const getWheelchairUse = Native.getWheelchairUse.bind(Native)
const getBloodType = Native.getBloodType.bind(Native)
const getWorkoutRoutes = Native.getWorkoutRoutes.bind(Native)

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework About the HealthKit Framework (Apple Docs)}
 */
export default {
  /**
  * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus authorizationStatus(for:) (Apple Docs) }
  * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Authorizing access to health data (Apple Docs) }
  */
  authorizationStatusFor,

  /**
   *
   * @returns All available quantity types for the current iOS version (currently excluding types that are not available before iOS 17)
   */
  availableQuantityTypes,

  /**
    * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
    * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable isHealthDataAvailable() (Apple Docs)}
    * @returns {boolean} true if HealthKit is available; otherwise, false.
    */
  isHealthDataAvailable,

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614181-isprotecteddataavailable isProtectedDataAvailable() (Apple Docs)}
   * @see {@link https://developer.apple.com/documentation/healthkit/protecting_user_privacy#3705074 Protecting User Privacy - Access encrypted data (Apple Docs)}
   * @returns {boolean} A Boolean value that indicates whether content protection is active.
   */
  isProtectedDataAvailable: canAccessProtectedData,

  // Todo [>8]: Remove to align with Apple function name (isProtectedDataAvailable)
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614181-isprotecteddataavailable isProtectedDataAvailable() (Apple Docs)}
   * @see {@link https://developer.apple.com/documentation/healthkit/protecting_user_privacy#3705074 Protecting User Privacy - Access encrypted data (Apple Docs)}
   * @deprecated Use {@link isProtectedDataAvailable} instead. Will be removed in next major version.
   * @returns {boolean} A Boolean value that indicates whether content protection is active.
   */
  canAccessProtectedData,

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery disableAllBackgroundDelivery(completion:) (Apple Docs)}
   */
  disableAllBackgroundDelivery,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery disableBackgroundDelivery(for:withCompletion:) (Apple Docs)}
   */
  disableBackgroundDelivery,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery enableBackgroundDelivery(for:frequency:withCompletion:) (Apple Docs)}
   */
  enableBackgroundDelivery,

  // simple convenience getters
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614171-biologicalsex biologicalSex() (Apple Docs)}
   */
  getBiologicalSex,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614161-fitzpatrickskintype fitzpatrickSkinType() (Apple Docs)}
   */
  getFitzpatrickSkinType,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648356-wheelchairuse wheelchairUse() (Apple Docs)}
   */
  getWheelchairUse,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614164-bloodtype bloodType() (Apple Docs)}
   */
  getBloodType,
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648357-dateofbirthcomponents dateOfBirthComponents() (Apple Docs)}
   */
  getDateOfBirth,

  getMostRecentQuantitySample,
  getMostRecentCategorySample,
  getMostRecentWorkout,

  /**
  * @see {@link https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings/reading_route_data Reading route data (Apple Docs)}
  * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutroutequery HKWorkoutRouteQuery (Apple Docs)}
   */
  getWorkoutRoutes,
  getWorkoutPlanById,

  getPreferredUnit,
  getPreferredUnits,
  getRequestStatusForAuthorization,

  // query methods
  queryCategorySamples,
  queryCategorySamplesWithAnchor,
  queryCorrelationSamples,
  queryHeartbeatSeriesSamples,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryQuantitySamples,
  queryQuantitySamplesWithAnchor,
  queryStatisticsForQuantity,
  queryWorkouts,
  querySources,

  requestAuthorization,

  // delete methods
  deleteQuantitySample,
  deleteSamples,

  // save methods
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614168-savecategorysample save(_:withCompletion:) (Apple Docs)}
   * @see {@link https://developer.apple.com/documentation/healthkit/saving_data_to_healthkit Saving data to HealthKit (Apple Docs)}
   */
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,
  saveWorkoutRoute,

  // subscriptions
  subscribeToChanges,

  /**
   * @returns the most recent sample for the given category type.
   */
  useMostRecentCategorySample,
  /**
   * @returns the most recent sample for the given quantity type.
   */
  useMostRecentQuantitySample,
  /**
   * @returns the most recent workout sample.
   */
  useMostRecentWorkout,
  useSubscribeToChanges,
  /**
     * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
    * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs}
    * @returns {boolean | null} true if HealthKit is available; otherwise, false. null while initializing.
    */
  useIsHealthDataAvailable,
  /**
   * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
   * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
   */
  useHealthkitAuthorization,
  useSources,
  useStatisticsForQuantity,
}

const isProtectedDataAvailable = canAccessProtectedData

export {
  authorizationStatusFor,
  availableQuantityTypes,
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
  getPreferredUnit,
  getPreferredUnits,
  getRequestStatusForAuthorization,
  getWheelchairUse,
  getWorkoutRoutes,
  isHealthDataAvailable,
  queryCategorySamples,
  queryCategorySamplesWithAnchor,
  queryCorrelationSamples,
  queryHeartbeatSeriesSamples,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryQuantitySamples,
  queryQuantitySamplesWithAnchor,
  queryStatisticsForQuantity,
  queryWorkouts,
  querySources,
  requestAuthorization,
  deleteQuantitySample,
  deleteSamples,
  getWorkoutPlanById,
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,
  saveWorkoutRoute,
  subscribeToChanges,
  useMostRecentCategorySample,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSubscribeToChanges,
  useHealthkitAuthorization,
  useIsHealthDataAvailable,
  useSources,
  useStatisticsForQuantity,
  canAccessProtectedData,
  isProtectedDataAvailable,
}

export * from './types'
