import deserializeCorrelation from './deserializeCorrelation';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryCorrelationSamples = async (typeIdentifier, options) => {
  const opts = prepareOptions(options);
  const correlations = await Native.queryCorrelationSamples(typeIdentifier, opts.from, opts.to);
  return correlations.map(deserializeCorrelation);
};
export default queryCorrelationSamples;
//# sourceMappingURL=queryCorrelationSamples.js.map