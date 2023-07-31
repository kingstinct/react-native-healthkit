"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deserializeSample = _interopRequireDefault(require("./deserializeSample"));
var _ensureUnit = _interopRequireDefault(require("./ensureUnit"));
var _prepareOptions = _interopRequireDefault(require("./prepareOptions"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const queryQuantitySamplesWithAnchor = async (identifier, options) => {
  const unit = await (0, _ensureUnit.default)(identifier, options.unit);
  const opts = (0, _prepareOptions.default)(options);
  const result = await _nativeTypes.default.queryQuantitySamplesWithAnchor(identifier, unit, opts.from, opts.to, opts.limit, opts.anchor);
  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(_deserializeSample.default)
  };
};
var _default = queryQuantitySamplesWithAnchor;
exports.default = _default;
//# sourceMappingURL=queryQuantitySamplesWithAnchor.js.map