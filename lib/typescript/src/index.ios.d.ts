import useMostRecentCategorySample from './hooks/useMostRecentCategorySample';
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample';
import useMostRecentWorkout from './hooks/useMostRecentWorkout';
import useSubscribeToChanges from './hooks/useSubscribeToChanges';
import { HKQuantityTypeIdentifier } from './native-types';
import getMostRecentCategorySample from './utils/getMostRecentCategorySample';
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample';
import queryStatisticsForQuantity from './utils/queryStatisticsForQuantity';
import queryWorkouts from './utils/queryWorkouts';
import saveCategorySample from './utils/saveCategorySample';
import saveCorrelationSample from './utils/saveCorrelationSample';
import saveQuantitySample from './utils/saveQuantitySample';
import saveWorkoutSample from './utils/saveWorkoutSample';
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework About the HealthKit Framework (Apple Docs)}
 */
declare const _default: {
    /**
    * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus authorizationStatus(for:) (Apple Docs) }
    * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Authorizing access to health data (Apple Docs) }
    */
    authorizationStatusFor: (type: import("./native-types").HealthkitReadAuthorization) => Promise<import("./native-types").HKAuthorizationStatus>;
    /**
     *
     * @returns All available quantity types for the current iOS version (currently excluding types that are not available before iOS 17)
     */
    availableQuantityTypes: (majorVersionIOS?: number) => HKQuantityTypeIdentifier[];
    /**
      * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
      * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable isHealthDataAvailable() (Apple Docs)}
      * @returns {boolean} true if HealthKit is available; otherwise, false.
      */
    isHealthDataAvailable: () => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614181-isprotecteddataavailable isProtectedDataAvailable() (Apple Docs)}
     * @see {@link https://developer.apple.com/documentation/healthkit/protecting_user_privacy#3705074 Protecting User Privacy - Access encrypted data (Apple Docs)}
     * @returns {boolean} A Boolean value that indicates whether content protection is active.
     */
    isProtectedDataAvailable: () => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614181-isprotecteddataavailable isProtectedDataAvailable() (Apple Docs)}
     * @see {@link https://developer.apple.com/documentation/healthkit/protecting_user_privacy#3705074 Protecting User Privacy - Access encrypted data (Apple Docs)}
     * @deprecated Use {@link isProtectedDataAvailable} instead. Will be removed in next major version.
     * @returns {boolean} A Boolean value that indicates whether content protection is active.
     */
    canAccessProtectedData: () => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery disableAllBackgroundDelivery(completion:) (Apple Docs)}
     */
    disableAllBackgroundDelivery: () => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery disableBackgroundDelivery(for:withCompletion:) (Apple Docs)}
     */
    disableBackgroundDelivery: (typeIdentifier: import("./native-types").HKSampleTypeIdentifier) => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery enableBackgroundDelivery(for:frequency:withCompletion:) (Apple Docs)}
     */
    enableBackgroundDelivery: (typeIdentifier: import("./native-types").HKSampleTypeIdentifier, updateFrequency: import("./native-types").HKUpdateFrequency) => Promise<boolean>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614171-biologicalsex biologicalSex() (Apple Docs)}
     */
    getBiologicalSex: () => Promise<import("./native-types").HKBiologicalSex>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614161-fitzpatrickskintype fitzpatrickSkinType() (Apple Docs)}
     */
    getFitzpatrickSkinType: () => Promise<import("./native-types").HKFitzpatrickSkinType>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648356-wheelchairuse wheelchairUse() (Apple Docs)}
     */
    getWheelchairUse: () => Promise<import("./native-types").HKWheelchairUse>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614164-bloodtype bloodType() (Apple Docs)}
     */
    getBloodType: () => Promise<import("./native-types").HKBloodType>;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648357-dateofbirthcomponents dateOfBirthComponents() (Apple Docs)}
     */
    getDateOfBirth: () => Promise<Date>;
    getMostRecentQuantitySample: typeof getMostRecentQuantitySample;
    getMostRecentCategorySample: typeof getMostRecentCategorySample;
    getMostRecentWorkout: import("./utils/getMostRecentWorkout").GetMostRecentWorkoutFn;
    /**
    * @see {@link https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings/reading_route_data Reading route data (Apple Docs)}
    * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutroutequery HKWorkoutRouteQuery (Apple Docs)}
     */
    getWorkoutRoutes: (workoutUUID: string) => Promise<readonly import("./native-types").WorkoutRoute[]>;
    getPreferredUnit: import("./utils/getPreferredUnit").GetPreferredUnitFn;
    getPreferredUnits: import("./utils/getPreferredUnits").GetPreferredUnitsFn;
    getRequestStatusForAuthorization: (read: readonly import("./native-types").HealthkitReadAuthorization[], write?: readonly import("./native-types").HKSampleTypeIdentifier[]) => Promise<import("./native-types").HKAuthorizationRequestStatus>;
    queryCategorySamples: import("./utils/queryCategorySamples").QueryCategorySamplesFn;
    queryCategorySamplesWithAnchor: import("./utils/queryCategorySamplesWithAnchor").QueryCategorySamplesWithAnchorFn;
    queryCorrelationSamples: import("./utils/queryCorrelationSamples").QueryCorrelationSamplesFn;
    queryHeartbeatSeriesSamples: import("./utils/queryHeartbeatSeriesSamples").QueryHeartbeatSeriesSamplesFn;
    queryHeartbeatSeriesSamplesWithAnchor: import("./utils/queryHeartbeatSeriesSamplesWithAnchor").QueryHeartbeatSeriesSamplesFn;
    queryQuantitySamples: import("./utils/queryQuantitySamples").QueryQuantitySamplesFn;
    queryQuantitySamplesWithAnchor: import("./utils/queryQuantitySamplesWithAnchor").QueryQuantitySamplesWithAnchorFn;
    queryStatisticsForQuantity: typeof queryStatisticsForQuantity;
    queryWorkouts: typeof queryWorkouts;
    querySources: import("./utils/querySources").QuerySourcesFn;
    requestAuthorization: (read: readonly import("./native-types").HealthkitReadAuthorization[], write?: readonly import("./native-types").HKSampleTypeIdentifier[]) => Promise<boolean>;
    deleteQuantitySample: import("./utils/deleteQuantitySample").DeleteQuantitySampleFn;
    deleteSamples: import("./utils/deleteSamples").DeleteSamplesFn;
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614168-savecategorysample save(_:withCompletion:) (Apple Docs)}
     * @see {@link https://developer.apple.com/documentation/healthkit/saving_data_to_healthkit Saving data to HealthKit (Apple Docs)}
     */
    saveCategorySample: typeof saveCategorySample;
    saveCorrelationSample: typeof saveCorrelationSample;
    saveQuantitySample: typeof saveQuantitySample;
    saveWorkoutSample: typeof saveWorkoutSample;
    subscribeToChanges: (identifier: import("./native-types").HKSampleTypeIdentifier, callback: () => void) => Promise<() => Promise<boolean>>;
    /**
     * @returns the most recent sample for the given category type.
     */
    useMostRecentCategorySample: typeof useMostRecentCategorySample;
    /**
     * @returns the most recent sample for the given quantity type.
     */
    useMostRecentQuantitySample: typeof useMostRecentQuantitySample;
    /**
     * @returns the most recent workout sample.
     */
    useMostRecentWorkout: typeof useMostRecentWorkout;
    useSubscribeToChanges: typeof useSubscribeToChanges;
    /**
       * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
      * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs}
      * @returns {boolean | null} true if HealthKit is available; otherwise, false. null while initializing.
      */
    useIsHealthDataAvailable: () => boolean | null;
    /**
     * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
     * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
     */
    useHealthkitAuthorization: (read: readonly import("./native-types").HealthkitReadAuthorization[], write?: readonly import("./native-types").HKSampleTypeIdentifier[] | undefined) => readonly [import("./native-types").HKAuthorizationRequestStatus | null, () => Promise<import("./native-types").HKAuthorizationRequestStatus>];
};
export default _default;
export * from './types';
