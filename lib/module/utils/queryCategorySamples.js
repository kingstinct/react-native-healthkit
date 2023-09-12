import deserializeCategorySample from './deserializeCategorySample';
import prepareOptions from './prepareOptions';
import Native from '../native-types';
const queryCategorySamples = async (identifier, options) => {
  const opts = prepareOptions(options);
  const raw = await Native.queryCategorySamples(identifier, opts.from, opts.to, opts.limit, opts.ascending);
  return raw.map(deserializeCategorySample);
};
export default queryCategorySamples;
//# sourceMappingURL=queryCategorySamples.js.map