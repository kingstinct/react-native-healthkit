"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _queryQuantitySamples = _interopRequireDefault(require("./queryQuantitySamples"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function getMostRecentQuantitySample(identifier, unit) {
  const samples = await (0, _queryQuantitySamples.default)(identifier, {
    limit: 1,
    unit
  });
  const lastSample = samples[0];
  if (lastSample) {
    return lastSample;
  }
  return null;
}
var _default = getMostRecentQuantitySample;
exports.default = _default;
//# sourceMappingURL=getMostRecentQuantitySample.js.map