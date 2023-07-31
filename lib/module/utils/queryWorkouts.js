import deserializeWorkout from './deserializeWorkout';
import getPreferredUnitsTyped from './getPreferredUnitsTyped';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
async function queryWorkouts(options) {
  const {
    energyUnit,
    distanceUnit
  } = await getPreferredUnitsTyped(options);
  const opts = prepareOptions(options);
  const workouts = await Native.queryWorkoutSamples(energyUnit, distanceUnit, opts.from, opts.to, opts.limit, opts.ascending);
  return workouts.map(deserializeWorkout);
}
export default queryWorkouts;
//# sourceMappingURL=queryWorkouts.js.map