import queryWorkouts from './queryWorkouts';
const getMostRecentWorkout = async options => {
  const workouts = await queryWorkouts({
    limit: 1,
    ascending: false,
    energyUnit: options === null || options === void 0 ? void 0 : options.energyUnit,
    distanceUnit: options === null || options === void 0 ? void 0 : options.distanceUnit
  });
  return workouts[0] || null;
};
export default getMostRecentWorkout;
//# sourceMappingURL=getMostRecentWorkout.js.map