const deserializeCategorySample = sample => ({
  ...sample,
  startDate: new Date(sample.startDate),
  endDate: new Date(sample.endDate)
});
export default deserializeCategorySample;
//# sourceMappingURL=deserializeCategorySample.js.map