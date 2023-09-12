"use strict";

var _reactNative = require("@testing-library/react-native");
var _useIsHealthDataAvailable = _interopRequireDefault(require("./useIsHealthDataAvailable"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
var _testUtils = _interopRequireDefault(require("../test-utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    jest.spyOn(_nativeTypes.default, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(false));
    const {
      result
    } = (0, _reactNative.renderHook)(_useIsHealthDataAvailable.default);
    await (0, _testUtils.default)();
    expect(result.current).toBe(false);
  });
  test('should return true', async () => {
    jest.spyOn(_nativeTypes.default, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(true));
    const {
      result
    } = (0, _reactNative.renderHook)(_useIsHealthDataAvailable.default);
    await (0, _testUtils.default)();
    expect(result.current).toBe(true);
  });
  test('should return null before initalizing', async () => {
    const {
      result
    } = (0, _reactNative.renderHook)(_useIsHealthDataAvailable.default);
    expect(result.current).toBe(null);
    await (0, _testUtils.default)();
  });
});
//# sourceMappingURL=useIsHealthDataAvailable.test.js.map