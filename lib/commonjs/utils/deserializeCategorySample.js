"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const deserializeCategorySample = sample => ({
  ...sample,
  startDate: new Date(sample.startDate),
  endDate: new Date(sample.endDate)
});
var _default = deserializeCategorySample;
exports.default = _default;
//# sourceMappingURL=deserializeCategorySample.js.map