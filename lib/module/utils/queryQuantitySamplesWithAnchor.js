import deserializeQuantitySample from './deserializeSample';
import ensureUnit from './ensureUnit';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryQuantitySamplesWithAnchor = async (identifier, options) => {
  const unit = await ensureUnit(identifier, options.unit);
  const opts = prepareOptions(options);
  const result = await Native.queryQuantitySamplesWithAnchor(identifier, unit, opts.from, opts.to, opts.limit, opts.anchor);
  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(deserializeQuantitySample)
  };
};
export default queryQuantitySamplesWithAnchor;
//# sourceMappingURL=queryQuantitySamplesWithAnchor.js.map