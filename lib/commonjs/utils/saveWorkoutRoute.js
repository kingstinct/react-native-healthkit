"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireDefault(require("../native-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function saveWorkoutRoute(workoutUUID, locations) {
  return _nativeTypes.default.saveWorkoutRoute(workoutUUID, locations.map(location => {
    const {
      timestamp,
      ...rest
    } = location;
    return {
      ...rest,
      ...(timestamp ? {
        timestamp: new Date(timestamp).toISOString()
      } : {
        timestamp: ''
      })
    };
  }));
}
var _default = saveWorkoutRoute;
exports.default = _default;
//# sourceMappingURL=saveWorkoutRoute.js.map