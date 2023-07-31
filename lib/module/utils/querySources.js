import Native from '../native-types';
const querySources = async identifier => {
  const quantitySamples = await Native.querySources(identifier);
  return quantitySamples;
};
export default querySources;
//# sourceMappingURL=querySources.js.map