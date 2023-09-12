"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getPreferredUnits = _interopRequireDefault(require("./getPreferredUnits"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getPreferredUnit = async type => {
  const [unit] = await (0, _getPreferredUnits.default)([type]);
  return unit;
};
var _default = getPreferredUnit;
exports.default = _default;
//# sourceMappingURL=getPreferredUnit.js.map