import deserializCategorySample from './deserializeCategorySample';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryCategorySamplesWithAnchor = async (identifier, options) => {
  const opts = prepareOptions(options);
  const raw = await Native.queryCategorySamplesWithAnchor(identifier, opts.from, opts.to, opts.limit, opts.anchor);
  return {
    samples: raw.samples.map(deserializCategorySample),
    deletedSamples: raw.deletedSamples,
    newAnchor: raw.newAnchor
  };
};
export default queryCategorySamplesWithAnchor;
//# sourceMappingURL=queryCategorySamplesWithAnchor.js.map