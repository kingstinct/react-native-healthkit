"use strict";

var _reactNative = require("@testing-library/react-native");
var _useHealthkitAuthorization = _interopRequireDefault(require("./useHealthkitAuthorization"));
var _nativeTypes = _interopRequireWildcard(require("../native-types"));
var _testUtils = _interopRequireDefault(require("../test-utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('useHealthkitAuthorization', () => {
  test('should return shouldRequest', async () => {
    jest.spyOn(_nativeTypes.default, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.shouldRequest));
    const {
      result
    } = (0, _reactNative.renderHook)(() => (0, _useHealthkitAuthorization.default)([_nativeTypes.HKCategoryTypeIdentifier.abdominalCramps]));
    await (0, _testUtils.default)();
    expect(result.current[0]).toBe(_nativeTypes.HKAuthorizationRequestStatus.shouldRequest);
  });
  test('should request permissions', async () => {
    const spy = jest.spyOn(_nativeTypes.default, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.shouldRequest));
    jest.spyOn(_nativeTypes.default, 'requestAuthorization').mockReturnValue(Promise.resolve(true));
    const {
      result
    } = (0, _reactNative.renderHook)(() => (0, _useHealthkitAuthorization.default)([_nativeTypes.HKCategoryTypeIdentifier.abdominalCramps]));
    await (0, _testUtils.default)();
    spy.mockReturnValue(Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.unnecessary));
    let retVal;
    await (0, _reactNative.act)(async () => {
      retVal = await result.current[1]();
    });
    expect(result.current[0]).toBe(_nativeTypes.HKAuthorizationRequestStatus.unnecessary);
    expect(retVal).toBe(_nativeTypes.HKAuthorizationRequestStatus.unnecessary);
  });
  test('should return unnecessary', async () => {
    jest.spyOn(_nativeTypes.default, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(_nativeTypes.HKAuthorizationRequestStatus.unnecessary));
    const {
      result
    } = (0, _reactNative.renderHook)(() => (0, _useHealthkitAuthorization.default)([_nativeTypes.HKCategoryTypeIdentifier.abdominalCramps]));
    await (0, _testUtils.default)();
    expect(result.current[0]).toBe(_nativeTypes.HKAuthorizationRequestStatus.unnecessary);
  });
  test('should return null before initalizing', async () => {
    const {
      result
    } = (0, _reactNative.renderHook)(() => (0, _useHealthkitAuthorization.default)([_nativeTypes.HKCategoryTypeIdentifier.abdominalCramps]));
    expect(result.current[0]).toBe(null);
    await (0, _testUtils.default)();
  });
});
//# sourceMappingURL=useHealthkitAuthorization.test.js.map