"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function deserializeHeartbeatSeriesSample(sample) {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate)
  };
}
var _default = deserializeHeartbeatSeriesSample;
exports.default = _default;
//# sourceMappingURL=deserializeHeartbeatSeriesSample.js.map