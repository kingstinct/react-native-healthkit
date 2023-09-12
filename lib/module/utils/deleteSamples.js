import Native from '../native-types';
const deleteSamples = async sample => {
  const start = sample.startDate || new Date();
  const end = sample.endDate || new Date();
  const {
    identifier
  } = sample;
  return Native.deleteSamples(identifier, start.toISOString(), end.toISOString());
};
export default deleteSamples;
//# sourceMappingURL=deleteSamples.js.map