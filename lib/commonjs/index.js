"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _reactNative = require("react-native");
var _nativeTypes = require("./native-types");
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
const notAvailableError = `[@kingstinct/react-native-healthkit] Platform "${_reactNative.Platform.OS}" not supported`;
let hasWarned = false;
function UnavailableFn(retVal) {
  return () => {
    if (!hasWarned) {
      // eslint-disable-next-line no-console
      console.warn(notAvailableError);
      hasWarned = true;
    }
    return retVal;
  };
}
const Healthkit = {
  authorizationStatusFor: UnavailableFn(Promise.resolve(_nativeTypes.HKAuthorizationStatus.notDetermined)),
  availableQuantityTypes: UnavailableFn([]),
  disableAllBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  disableBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  enableBackgroundDelivery: UnavailableFn(Promise.resolve(false)),
  getBiologicalSex: UnavailableFn(Promise.resolve(_nativeTypes.HKBiologicalSex.notSet)),
  getBloodType: UnavailableFn(Promise.resolve(_nativeTypes.HKBloodType.notSet)),
  getDateOfBirth: UnavailableFn(Promise.resolve(new Date(0))),
  getFitzpatrickSkinType: UnavailableFn(Promise.resolve(_nativeTypes.HKFitzpatrickSkinType.notSet)),
  getMostRecentCategorySample: UnavailableFn(Promise.resolve(null)),
  getMostRecentQuantitySample: UnavailableFn(Promise.resolve(null)),
  getMostRecentWorkout: UnavailableFn(Promise.resolve(null)),
  getPreferredUnit: UnavailableFn(Promise.resolve(_nativeTypes.HKUnits.Count)),
  getPreferredUnits: UnavailableFn(Promise.resolve([])),
  getRequestStatusForAuthorization: UnavailableFn(Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.unknown)),
  getWheelchairUse: UnavailableFn(Promise.resolve(_nativeTypes.HKWheelchairUse.notSet)),
  getWorkoutRoutes: UnavailableFn(Promise.resolve([])),
  isHealthDataAvailable: async () => Promise.resolve(false),
  queryCategorySamples: UnavailableFn(Promise.resolve([])),
  queryCategorySamplesWithAnchor: UnavailableFn(Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: ''
  })),
  queryCorrelationSamples: UnavailableFn(Promise.resolve([])),
  queryHeartbeatSeriesSamples: UnavailableFn(Promise.resolve([])),
  queryHeartbeatSeriesSamplesWithAnchor: UnavailableFn(Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: ''
  })),
  queryQuantitySamples: UnavailableFn(Promise.resolve([])),
  queryQuantitySamplesWithAnchor: UnavailableFn(Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: ''
  })),
  queryStatisticsForQuantity: UnavailableFn(Promise.resolve({
    averageQuantity: undefined,
    maximumQuantity: undefined,
    minimumQuantity: undefined,
    sumQuantity: undefined,
    mostRecentQuantity: undefined,
    mostRecentQuantityDateInterval: undefined,
    duration: undefined
  })),
  queryWorkouts: UnavailableFn(Promise.resolve([])),
  querySources: UnavailableFn(Promise.resolve([])),
  requestAuthorization: UnavailableFn(Promise.resolve(false)),
  deleteQuantitySample: UnavailableFn(Promise.resolve(false)),
  deleteSamples: UnavailableFn(Promise.resolve(false)),
  saveCategorySample: UnavailableFn(Promise.resolve(false)),
  saveCorrelationSample: UnavailableFn(Promise.resolve(false)),
  saveQuantitySample: UnavailableFn(Promise.resolve(false)),
  saveWorkoutSample: UnavailableFn(Promise.resolve(false)),
  subscribeToChanges: UnavailableFn(Promise.resolve(async () => Promise.resolve(false))),
  useMostRecentCategorySample: UnavailableFn(null),
  useMostRecentQuantitySample: UnavailableFn(null),
  useMostRecentWorkout: UnavailableFn(null),
  useSubscribeToChanges: UnavailableFn([null, () => null]),
  useHealthkitAuthorization: UnavailableFn([null, async () => Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.unknown)]),
  useIsHealthDataAvailable: () => false,
  canAccessProtectedData: async () => Promise.resolve(false),
  isProtectedDataAvailable: async () => Promise.resolve(false)
};
var _default = Healthkit;
exports.default = _default;
//# sourceMappingURL=index.js.map