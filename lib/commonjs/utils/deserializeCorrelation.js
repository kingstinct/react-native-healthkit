"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deserializeCategorySample = _interopRequireDefault(require("./deserializeCategorySample"));
var _deserializeSample = _interopRequireDefault(require("./deserializeSample"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function deserializeCorrelation(s) {
  return {
    ...s,
    objects: s.objects.map(o => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (o.quantity !== undefined) {
        return (0, _deserializeSample.default)(o);
      }
      return (0, _deserializeCategorySample.default)(o);
    }),
    endDate: new Date(s.endDate),
    startDate: new Date(s.startDate)
  };
}
var _default = deserializeCorrelation;
exports.default = _default;
//# sourceMappingURL=deserializeCorrelation.js.map