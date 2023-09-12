import deserializeHeartbeatSeriesSample from './deserializeHeartbeatSeriesSample';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryHeartbeatSeriesSamplesWithAnchor = async options => {
  const opts = prepareOptions(options);
  const result = await Native.queryHeartbeatSeriesSamplesWithAnchor(opts.from, opts.to, opts.limit, opts.anchor);
  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(deserializeHeartbeatSeriesSample)
  };
};
export default queryHeartbeatSeriesSamplesWithAnchor;
//# sourceMappingURL=queryHeartbeatSeriesSamplesWithAnchor.js.map