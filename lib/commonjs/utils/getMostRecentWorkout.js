"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _queryWorkouts = _interopRequireDefault(require("./queryWorkouts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getMostRecentWorkout = async options => {
  const workouts = await (0, _queryWorkouts.default)({
    limit: 1,
    ascending: false,
    energyUnit: options === null || options === void 0 ? void 0 : options.energyUnit,
    distanceUnit: options === null || options === void 0 ? void 0 : options.distanceUnit
  });
  return workouts[0] || null;
};
var _default = getMostRecentWorkout;
exports.default = _default;
//# sourceMappingURL=getMostRecentWorkout.js.map