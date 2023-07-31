"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getPreferredUnits = async identifiers => {
  const units = await _nativeTypes.default.getPreferredUnits(identifiers);
  return identifiers.map(i => units[i]);
};
var _default = getPreferredUnits;
exports.default = _default;
//# sourceMappingURL=getPreferredUnits.js.map