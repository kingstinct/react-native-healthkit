"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function getWorkoutPlanId(workoutUUID) {
  return _nativeTypes.default.getWorkoutPlanId(workoutUUID);
}
var _default = getWorkoutPlanId;
exports.default = _default;
//# sourceMappingURL=getWorkoutPlanId.js.map