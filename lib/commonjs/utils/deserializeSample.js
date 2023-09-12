"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function deserializeQuantitySample(sample) {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate)
  };
}
var _default = deserializeQuantitySample;
exports.default = _default;
//# sourceMappingURL=deserializeSample.js.map