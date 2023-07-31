"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _serializeDate = _interopRequireDefault(require("./serializeDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const prepareOptions = options => {
  const limit = !options.limit || options.limit === Infinity ? 0 : options.limit;
  const ascending = options.ascending ?? limit === 0;
  const from = (0, _serializeDate.default)(options.from ? options.from : limit > 0 ? new Date(0) : undefined);
  const to = (0, _serializeDate.default)(options.to);
  const anchor = options.anchor ?? '';
  return {
    limit,
    ascending,
    from,
    to,
    anchor
  };
};
var _default = prepareOptions;
exports.default = _default;
//# sourceMappingURL=prepareOptions.js.map