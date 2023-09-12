"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getDateOfBirth = async () => {
  const dateOfBirth = await _nativeTypes.default.getDateOfBirth();
  return new Date(dateOfBirth);
};
var _default = getDateOfBirth;
exports.default = _default;
//# sourceMappingURL=getDateOfBirth.js.map