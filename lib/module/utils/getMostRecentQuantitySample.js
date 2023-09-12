import queryQuantitySamples from './queryQuantitySamples';
async function getMostRecentQuantitySample(identifier, unit) {
  const samples = await queryQuantitySamples(identifier, {
    limit: 1,
    unit
  });
  const lastSample = samples[0];
  if (lastSample) {
    return lastSample;
  }
  return null;
}
export default getMostRecentQuantitySample;
//# sourceMappingURL=getMostRecentQuantitySample.js.map