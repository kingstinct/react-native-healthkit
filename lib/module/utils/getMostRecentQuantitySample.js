import queryQuantitySamples from './queryQuantitySamples';
async function getMostRecentQuantitySample(identifier, unit) {
  const samples = await queryQuantitySamples(identifier, {
    limit: 1,
    unit
  });
  return samples[0] || null;
}
export default getMostRecentQuantitySample;
//# sourceMappingURL=getMostRecentQuantitySample.js.map