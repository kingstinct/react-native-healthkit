"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ensureUnit = async (type, providedUnit) => {
  if (providedUnit) {
    return providedUnit;
  }
  const unit = await _nativeTypes.default.getPreferredUnits([type]);
  return unit[type];
};
var _default = ensureUnit;
exports.default = _default;
//# sourceMappingURL=ensureUnit.js.map