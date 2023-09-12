"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** See https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization */
const requestAuthorization = async function (read) {
  let write = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const readPermissions = read.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  const writePermissions = write.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  return _nativeTypes.default.requestAuthorization(writePermissions, readPermissions);
};
var _default = requestAuthorization;
exports.default = _default;
//# sourceMappingURL=requestAuthorization.js.map