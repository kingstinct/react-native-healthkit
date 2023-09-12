import ensureUnit from './ensureUnit';
import Native from '../native-types';
async function queryStatisticsForQuantity(identifier, options, from, to, unit) {
  const actualUnit = await ensureUnit(identifier, unit);
  const toDate = to || new Date();
  const {
    mostRecentQuantityDateInterval,
    ...rawResponse
  } = await Native.queryStatisticsForQuantity(identifier, actualUnit, from.toISOString(), toDate.toISOString(), options);
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
export default queryStatisticsForQuantity;
//# sourceMappingURL=queryStatisticsForQuantity.js.map