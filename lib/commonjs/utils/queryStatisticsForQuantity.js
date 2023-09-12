"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ensureUnit = _interopRequireDefault(require("./ensureUnit"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function queryStatisticsForQuantity(identifier, options, from, to, unit) {
  const actualUnit = await (0, _ensureUnit.default)(identifier, unit);
  const toDate = to || new Date();
  const {
    mostRecentQuantityDateInterval,
    ...rawResponse
  } = await _nativeTypes.default.queryStatisticsForQuantity(identifier, actualUnit, from.toISOString(), toDate.toISOString(), options);
  const response = {
    ...rawResponse,
    ...(mostRecentQuantityDateInterval ? {
      mostRecentQuantityDateInterval: {
        from: new Date(mostRecentQuantityDateInterval.from),
        to: new Date(mostRecentQuantityDateInterval.to)
      }
    } : {})
  };
  return response;
}
var _default = queryStatisticsForQuantity;
exports.default = _default;
//# sourceMappingURL=queryStatisticsForQuantity.js.map