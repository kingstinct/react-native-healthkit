"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _queryCategorySamples = _interopRequireDefault(require("./queryCategorySamples"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function getMostRecentCategorySample(identifier) {
  const samples = await (0, _queryCategorySamples.default)(identifier, {
    limit: 1,
    ascending: false
  });
  return samples[0] ?? null;
}
var _default = getMostRecentCategorySample;
exports.default = _default;
//# sourceMappingURL=getMostRecentCategorySample.js.map