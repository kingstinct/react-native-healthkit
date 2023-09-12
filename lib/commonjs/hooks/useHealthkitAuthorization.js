"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _getRequestStatusForAuthorization = _interopRequireDefault(require("../utils/getRequestStatusForAuthorization"));
var _requestAuthorization = _interopRequireDefault(require("../utils/requestAuthorization"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useHealthkitAuthorization = (read, write) => {
  const [status, setStatus] = (0, _react.useState)(null);
  const readMemo = (0, _react.useRef)(read);
  const writeMemo = (0, _react.useRef)(write);
  (0, _react.useEffect)(() => {
    readMemo.current = read;
    writeMemo.current = write;
  }, [read, write]);
  const refreshAuthStatus = (0, _react.useCallback)(async () => {
    const auth = await (0, _getRequestStatusForAuthorization.default)(readMemo.current, writeMemo.current);
    setStatus(auth);
    return auth;
  }, []);
  const request = (0, _react.useCallback)(async () => {
    await (0, _requestAuthorization.default)(readMemo.current, writeMemo.current);
    return refreshAuthStatus();
  }, [refreshAuthStatus]);
  (0, _react.useEffect)(() => {
    void refreshAuthStatus();
  }, [refreshAuthStatus]);
  return [status, request];
};
var _default = useHealthkitAuthorization;
exports.default = _default;
//# sourceMappingURL=useHealthkitAuthorization.js.map