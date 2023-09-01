"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ensureMetadata = _interopRequireDefault(require("./ensureMetadata"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function saveWorkoutSample(typeIdentifier, quantities, _start, options) {
  const start = _start.toISOString();
  const end = ((options === null || options === void 0 ? void 0 : options.end) || new Date()).toISOString();
  return _nativeTypes.default.saveWorkoutSample(typeIdentifier, quantities.map(quantity => {
    const {
      startDate,
      endDate,
      ...rest
    } = quantity;
    const updatedQuantity = {
      ...rest,
      ...(startDate && {
        startDate: startDate.toISOString()
      }),
      ...(endDate && {
        endDate: endDate.toISOString()
      })
    };
    return {
      ...updatedQuantity,
      metadata: (0, _ensureMetadata.default)(quantity.metadata)
    };
  }), start, end, (0, _ensureMetadata.default)(options === null || options === void 0 ? void 0 : options.metadata));
}
var _default = saveWorkoutSample;
exports.default = _default;
//# sourceMappingURL=saveWorkoutSample.js.map