"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ensureMetadata = _interopRequireDefault(require("./ensureMetadata"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function saveCorrelationSample(typeIdentifier, samples, options) {
  const start = ((options === null || options === void 0 ? void 0 : options.start) || new Date()).toISOString();
  const end = ((options === null || options === void 0 ? void 0 : options.end) || new Date()).toISOString();
  return _nativeTypes.default.saveCorrelationSample(typeIdentifier, samples.map(sample => {
    const {
      startDate,
      endDate,
      ...rest
    } = sample;
    const updatedSample = {
      ...rest,
      ...(startDate && {
        startDate: new Date(startDate).toISOString()
      }),
      ...(endDate && {
        endDate: new Date(endDate).toISOString()
      })
    };
    return {
      ...updatedSample,
      metadata: (0, _ensureMetadata.default)(sample.metadata)
    };
  }), start, end, (0, _ensureMetadata.default)(options === null || options === void 0 ? void 0 : options.metadata));
}
var _default = saveCorrelationSample;
exports.default = _default;
//# sourceMappingURL=saveCorrelationSample.js.map