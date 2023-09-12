"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
* @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple HealthKit isHealthDataAvailable}
* @returns {boolean | null} true if HealthKit is available; otherwise, false. null while initializing.
*/
const useIsHealthDataAvailable = () => {
  const [isAvailable, setIsAvailable] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    const init = async () => {
      const res = await _nativeTypes.default.isHealthDataAvailable();
      setIsAvailable(res);
    };
    void init();
  }, []);
  return isAvailable;
};
var _default = useIsHealthDataAvailable;
exports.default = _default;
//# sourceMappingURL=useIsHealthDataAvailable.js.map