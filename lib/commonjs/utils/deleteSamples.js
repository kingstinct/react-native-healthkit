"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const deleteSamples = async sample => {
  const start = sample.startDate || new Date();
  const end = sample.endDate || new Date();
  const {
    identifier
  } = sample;
  return _nativeTypes.default.deleteSamples(identifier, start.toISOString(), end.toISOString());
};
var _default = deleteSamples;
exports.default = _default;
//# sourceMappingURL=deleteSamples.js.map