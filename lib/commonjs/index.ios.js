"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _reactNative = require("react-native");
var _useHealthkitAuthorization = _interopRequireDefault(require("./hooks/useHealthkitAuthorization"));
var _useIsHealthDataAvailable = _interopRequireDefault(require("./hooks/useIsHealthDataAvailable"));
var _useMostRecentCategorySample = _interopRequireDefault(require("./hooks/useMostRecentCategorySample"));
var _useMostRecentQuantitySample = _interopRequireDefault(require("./hooks/useMostRecentQuantitySample"));
var _useMostRecentWorkout = _interopRequireDefault(require("./hooks/useMostRecentWorkout"));
var _useSubscribeToChanges = _interopRequireDefault(require("./hooks/useSubscribeToChanges"));
var _nativeTypes = _interopRequireWildcard(require("./native-types"));
var _deleteQuantitySample = _interopRequireDefault(require("./utils/deleteQuantitySample"));
var _deleteSamples = _interopRequireDefault(require("./utils/deleteSamples"));
var _getDateOfBirth = _interopRequireDefault(require("./utils/getDateOfBirth"));
var _getMostRecentCategorySample = _interopRequireDefault(require("./utils/getMostRecentCategorySample"));
var _getMostRecentQuantitySample = _interopRequireDefault(require("./utils/getMostRecentQuantitySample"));
var _getMostRecentWorkout = _interopRequireDefault(require("./utils/getMostRecentWorkout"));
var _getPreferredUnit = _interopRequireDefault(require("./utils/getPreferredUnit"));
var _getPreferredUnits = _interopRequireDefault(require("./utils/getPreferredUnits"));
var _getRequestStatusForAuthorization = _interopRequireDefault(require("./utils/getRequestStatusForAuthorization"));
var _queryCategorySamples = _interopRequireDefault(require("./utils/queryCategorySamples"));
var _queryCategorySamplesWithAnchor = _interopRequireDefault(require("./utils/queryCategorySamplesWithAnchor"));
var _queryCorrelationSamples = _interopRequireDefault(require("./utils/queryCorrelationSamples"));
var _queryHeartbeatSeriesSamples = _interopRequireDefault(require("./utils/queryHeartbeatSeriesSamples"));
var _queryHeartbeatSeriesSamplesWithAnchor = _interopRequireDefault(require("./utils/queryHeartbeatSeriesSamplesWithAnchor"));
var _queryQuantitySamples = _interopRequireDefault(require("./utils/queryQuantitySamples"));
var _queryQuantitySamplesWithAnchor = _interopRequireDefault(require("./utils/queryQuantitySamplesWithAnchor"));
var _querySources = _interopRequireDefault(require("./utils/querySources"));
var _queryStatisticsForQuantity = _interopRequireDefault(require("./utils/queryStatisticsForQuantity"));
var _queryWorkouts = _interopRequireDefault(require("./utils/queryWorkouts"));
var _requestAuthorization = _interopRequireDefault(require("./utils/requestAuthorization"));
var _saveCategorySample = _interopRequireDefault(require("./utils/saveCategorySample"));
var _saveCorrelationSample = _interopRequireDefault(require("./utils/saveCorrelationSample"));
var _saveQuantitySample = _interopRequireDefault(require("./utils/saveQuantitySample"));
var _saveWorkoutSample = _interopRequireDefault(require("./utils/saveWorkoutSample"));
var _subscribeToChanges = _interopRequireDefault(require("./utils/subscribeToChanges"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const currentMajorVersionIOS = _reactNative.Platform.OS === 'ios' ? parseInt(_reactNative.Platform.Version, 10) : 0;
const allQuantityTypesList = [...Object.values(_nativeTypes.HKQuantityTypeIdentifier)];
const availableQuantityTypes = function () {
  let majorVersionIOS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : currentMajorVersionIOS;
  if (majorVersionIOS >= 17) {
    return allQuantityTypesList;
  }

  // remove types that are not available before iOS 17
  return allQuantityTypesList.filter(type => ![_nativeTypes.HKQuantityTypeIdentifier.cyclingCadence, _nativeTypes.HKQuantityTypeIdentifier.cyclingFunctionalThresholdPower, _nativeTypes.HKQuantityTypeIdentifier.cyclingPower, _nativeTypes.HKQuantityTypeIdentifier.cyclingSpeed, _nativeTypes.HKQuantityTypeIdentifier.physicalEffort, _nativeTypes.HKQuantityTypeIdentifier.timeInDaylight].includes(type));
};
const authorizationStatusFor = _nativeTypes.default.authorizationStatusFor.bind(_nativeTypes.default);
const isHealthDataAvailable = _nativeTypes.default.isHealthDataAvailable.bind(_nativeTypes.default);
// Todo [>8]: Rename to align with Apple function name (isProtectedDataAvailable)
const canAccessProtectedData = _nativeTypes.default.canAccessProtectedData.bind(_nativeTypes.default);
const disableBackgroundDelivery = _nativeTypes.default.disableBackgroundDelivery.bind(_nativeTypes.default);
const disableAllBackgroundDelivery = _nativeTypes.default.disableAllBackgroundDelivery.bind(_nativeTypes.default);
const enableBackgroundDelivery = _nativeTypes.default.enableBackgroundDelivery.bind(_nativeTypes.default);
const getBiologicalSex = _nativeTypes.default.getBiologicalSex.bind(_nativeTypes.default);
const getFitzpatrickSkinType = _nativeTypes.default.getFitzpatrickSkinType.bind(_nativeTypes.default);
const getWheelchairUse = _nativeTypes.default.getWheelchairUse.bind(_nativeTypes.default);
const getBloodType = _nativeTypes.default.getBloodType.bind(_nativeTypes.default);
const getWorkoutRoutes = _nativeTypes.default.getWorkoutRoutes.bind(_nativeTypes.default);

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/about_the_healthkit_framework About the HealthKit Framework (Apple Docs)}
 */
var _default = {
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
  getDateOfBirth: _getDateOfBirth.default,
  getMostRecentQuantitySample: _getMostRecentQuantitySample.default,
  getMostRecentCategorySample: _getMostRecentCategorySample.default,
  getMostRecentWorkout: _getMostRecentWorkout.default,
  /**
  * @see {@link https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings/reading_route_data Reading route data (Apple Docs)}
  * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutroutequery HKWorkoutRouteQuery (Apple Docs)}
   */
  getWorkoutRoutes,
  getPreferredUnit: _getPreferredUnit.default,
  getPreferredUnits: _getPreferredUnits.default,
  getRequestStatusForAuthorization: _getRequestStatusForAuthorization.default,
  // query methods
  queryCategorySamples: _queryCategorySamples.default,
  queryCategorySamplesWithAnchor: _queryCategorySamplesWithAnchor.default,
  queryCorrelationSamples: _queryCorrelationSamples.default,
  queryHeartbeatSeriesSamples: _queryHeartbeatSeriesSamples.default,
  queryHeartbeatSeriesSamplesWithAnchor: _queryHeartbeatSeriesSamplesWithAnchor.default,
  queryQuantitySamples: _queryQuantitySamples.default,
  queryQuantitySamplesWithAnchor: _queryQuantitySamplesWithAnchor.default,
  queryStatisticsForQuantity: _queryStatisticsForQuantity.default,
  queryWorkouts: _queryWorkouts.default,
  querySources: _querySources.default,
  requestAuthorization: _requestAuthorization.default,
  // delete methods
  deleteQuantitySample: _deleteQuantitySample.default,
  deleteSamples: _deleteSamples.default,
  // save methods
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614168-savecategorysample save(_:withCompletion:) (Apple Docs)}
   * @see {@link https://developer.apple.com/documentation/healthkit/saving_data_to_healthkit Saving data to HealthKit (Apple Docs)}
   */
  saveCategorySample: _saveCategorySample.default,
  saveCorrelationSample: _saveCorrelationSample.default,
  saveQuantitySample: _saveQuantitySample.default,
  saveWorkoutSample: _saveWorkoutSample.default,
  // subscriptions
  subscribeToChanges: _subscribeToChanges.default,
  /**
   * @returns the most recent sample for the given category type.
   */
  useMostRecentCategorySample: _useMostRecentCategorySample.default,
  /**
   * @returns the most recent sample for the given quantity type.
   */
  useMostRecentQuantitySample: _useMostRecentQuantitySample.default,
  /**
   * @returns the most recent workout sample.
   */
  useMostRecentWorkout: _useMostRecentWorkout.default,
  useSubscribeToChanges: _useSubscribeToChanges.default,
  /**
     * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
    * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs}
    * @returns {boolean | null} true if HealthKit is available; otherwise, false. null while initializing.
    */
  useIsHealthDataAvailable: _useIsHealthDataAvailable.default,
  /**
   * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
   * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
   */
  useHealthkitAuthorization: _useHealthkitAuthorization.default
};
exports.default = _default;
//# sourceMappingURL=index.ios.js.map