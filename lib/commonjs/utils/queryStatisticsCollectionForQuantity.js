"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ensureUnit = _interopRequireDefault(require("./ensureUnit"));
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function queryStatisticsCollectionForQuantity(identifier, options, from, to, unit) {
  const actualUnit = await (0, _ensureUnit.default)(identifier, unit);
  const toDate = to || new Date();
  const data = await _nativeTypes.default.queryStatisticsCollectionForQuantity(identifier, actualUnit, from.toISOString(), toDate.toISOString(), options);
  return data.map(record => ({
    ...record,
    startDate: new Date(record.startDate),
    endDate: new Date(record.endDate)
  }));
}
var _default = queryStatisticsCollectionForQuantity;
exports.default = _default;
//# sourceMappingURL=queryStatisticsCollectionForQuantity.js.map