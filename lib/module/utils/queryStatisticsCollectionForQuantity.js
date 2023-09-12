import ensureUnit from './ensureUnit';
import Native from '../native-types';
async function queryStatisticsCollectionForQuantity(identifier, options, from, to, unit) {
  const actualUnit = await ensureUnit(identifier, unit);
  const toDate = to || new Date();
  const data = await Native.queryStatisticsCollectionForQuantity(identifier, actualUnit, from.toISOString(), toDate.toISOString(), options);
  return data.map(record => ({
    ...record,
    startDate: new Date(record.startDate),
    endDate: new Date(record.endDate)
  }));
}
export default queryStatisticsCollectionForQuantity;
//# sourceMappingURL=queryStatisticsCollectionForQuantity.js.map