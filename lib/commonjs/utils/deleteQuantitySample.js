"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const deleteQuantitySample = async (identifier, uuid) => _nativeTypes.default.deleteQuantitySample(identifier, uuid);
var _default = deleteQuantitySample;
exports.default = _default;
//# sourceMappingURL=deleteQuantitySample.js.map