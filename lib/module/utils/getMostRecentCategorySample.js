import queryCategorySamples from './queryCategorySamples';
async function getMostRecentCategorySample(identifier) {
  const samples = await queryCategorySamples(identifier, {
    limit: 1,
    ascending: false
  });
  return samples[0] ?? null;
}
export default getMostRecentCategorySample;
//# sourceMappingURL=getMostRecentCategorySample.js.map