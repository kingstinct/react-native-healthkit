import deserializeHeartbeatSeriesSample from './deserializeHeartbeatSeriesSample';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryHeartbeatSeriesSamples = async options => {
  const opts = prepareOptions(options);
  const result = await Native.queryHeartbeatSeriesSamples(opts.from, opts.to, opts.limit, opts.ascending);
  return result.map(deserializeHeartbeatSeriesSample);
};
export default queryHeartbeatSeriesSamples;
//# sourceMappingURL=queryHeartbeatSeriesSamples.js.map