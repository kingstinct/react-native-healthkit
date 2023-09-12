"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deserializeCorrelation = _interopRequireDefault(require("./deserializeCorrelation"));
var _prepareOptions = _interopRequireDefault(require("./prepareOptions"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const queryCorrelationSamples = async (typeIdentifier, options) => {
  const opts = (0, _prepareOptions.default)(options);
  const correlations = await _nativeTypes.default.queryCorrelationSamples(typeIdentifier, opts.from, opts.to);
  return correlations.map(_deserializeCorrelation.default);
};
var _default = queryCorrelationSamples;
exports.default = _default;
//# sourceMappingURL=queryCorrelationSamples.js.map