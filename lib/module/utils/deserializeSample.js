function deserializeQuantitySample(sample) {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate)
  };
}
export default deserializeQuantitySample;
//# sourceMappingURL=deserializeSample.js.map