"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const querySources = async identifier => {
  const quantitySamples = await _nativeTypes.default.querySources(identifier);
  return quantitySamples;
};
var _default = querySources;
exports.default = _default;
//# sourceMappingURL=querySources.js.map