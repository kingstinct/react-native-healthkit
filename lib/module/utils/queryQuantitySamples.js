import deserializeQuantitySample from './deserializeSample';
import ensureUnit from './ensureUnit';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryQuantitySamples = async (identifier, options) => {
  const unit = await ensureUnit(identifier, options.unit);
  const opts = prepareOptions(options);
  const result = await Native.queryQuantitySamples(identifier, unit, opts.from, opts.to, opts.limit, opts.ascending);
  return result.map(deserializeQuantitySample);
};
export default queryQuantitySamples;
//# sourceMappingURL=queryQuantitySamples.js.map