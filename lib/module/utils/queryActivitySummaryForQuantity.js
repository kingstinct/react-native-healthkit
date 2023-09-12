import ensureUnit from './ensureUnit';
import prepareOptions from './prepareOptions';
import Native, { HKQuantityTypeIdentifier, UnitOfEnergy, UnitOfTime } from '../native-types';
const queryActivitySummaryForQuantity = async options => {
  const energyUnit = (await ensureUnit(HKQuantityTypeIdentifier.activeEnergyBurned, options.energyUnit)) ?? UnitOfEnergy.Joules;
  const timeUnit = (await ensureUnit(HKQuantityTypeIdentifier.appleMoveTime, options.timeUnit)) ?? UnitOfTime.Seconds;
  const opts = prepareOptions(options);
  const data = await Native.queryActivitySummaryForQuantity(energyUnit, timeUnit, opts.from, opts.to);
  return data.map(record => ({
    ...record,
    startDate: new Date(record.startDate)
  }));
};
export default queryActivitySummaryForQuantity;
//# sourceMappingURL=queryActivitySummaryForQuantity.js.map