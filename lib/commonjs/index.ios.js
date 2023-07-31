"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _useHealthkitAuthorization = _interopRequireDefault(require("./hooks/useHealthkitAuthorization"));
var _useIsHealthDataAvailable = _interopRequireDefault(require("./hooks/useIsHealthDataAvailable"));
var _useMostRecentCategorySample = _interopRequireDefault(require("./hooks/useMostRecentCategorySample"));
var _useMostRecentQuantitySample = _interopRequireDefault(require("./hooks/useMostRecentQuantitySample"));
var _useMostRecentWorkout = _interopRequireDefault(require("./hooks/useMostRecentWorkout"));
var _useSubscribeToChanges = _interopRequireDefault(require("./hooks/useSubscribeToChanges"));
var _nativeTypes = _interopRequireDefault(require("./native-types"));
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Healthkit = {
  authorizationStatusFor: _nativeTypes.default.authorizationStatusFor.bind(_nativeTypes.default),
  isHealthDataAvailable: _nativeTypes.default.isHealthDataAvailable.bind(_nativeTypes.default),
  canAccessProtectedData: _nativeTypes.default.canAccessProtectedData.bind(_nativeTypes.default),
  disableAllBackgroundDelivery: _nativeTypes.default.disableAllBackgroundDelivery.bind(_nativeTypes.default),
  disableBackgroundDelivery: _nativeTypes.default.disableBackgroundDelivery.bind(_nativeTypes.default),
  enableBackgroundDelivery: _nativeTypes.default.enableBackgroundDelivery.bind(_nativeTypes.default),
  // simple convenience getters
  getBiologicalSex: _nativeTypes.default.getBiologicalSex.bind(_nativeTypes.default),
  getFitzpatrickSkinType: _nativeTypes.default.getFitzpatrickSkinType.bind(_nativeTypes.default),
  getWheelchairUse: _nativeTypes.default.getWheelchairUse.bind(_nativeTypes.default),
  getBloodType: _nativeTypes.default.getBloodType.bind(_nativeTypes.default),
  getWorkoutRoutes: _nativeTypes.default.getWorkoutRoutes.bind(_nativeTypes.default),
  getDateOfBirth: _getDateOfBirth.default,
  getMostRecentQuantitySample: _getMostRecentQuantitySample.default,
  getMostRecentCategorySample: _getMostRecentCategorySample.default,
  getMostRecentWorkout: _getMostRecentWorkout.default,
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
  saveCategorySample: _saveCategorySample.default,
  saveCorrelationSample: _saveCorrelationSample.default,
  saveQuantitySample: _saveQuantitySample.default,
  saveWorkoutSample: _saveWorkoutSample.default,
  // subscriptions
  subscribeToChanges: _subscribeToChanges.default,
  // hooks
  useMostRecentCategorySample: _useMostRecentCategorySample.default,
  useMostRecentQuantitySample: _useMostRecentQuantitySample.default,
  useMostRecentWorkout: _useMostRecentWorkout.default,
  useSubscribeToChanges: _useSubscribeToChanges.default,
  useIsHealthDataAvailable: _useIsHealthDataAvailable.default,
  useHealthkitAuthorization: _useHealthkitAuthorization.default
};
var _default = Healthkit;
exports.default = _default;
//# sourceMappingURL=index.ios.js.map