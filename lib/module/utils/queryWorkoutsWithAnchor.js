import deserializeWorkout from './deserializeWorkout';
import getPreferredUnitsTyped from './getPreferredUnitsTyped';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
async function queryWorkoutsWitAnchor(options) {
  const {
    energyUnit,
    distanceUnit
  } = await getPreferredUnitsTyped(options);
  const opts = prepareOptions(options);
  const {
    samples,
    deletedSamples,
    newAnchor
  } = await Native.queryWorkoutSamplesWithAnchor(energyUnit, distanceUnit, opts.from, opts.to, opts.limit, opts.anchor);
  return {
    samples: samples.map(deserializeWorkout),
    deletedSamples,
    newAnchor
  };
}
export default queryWorkoutsWitAnchor;
//# sourceMappingURL=queryWorkoutsWithAnchor.js.map