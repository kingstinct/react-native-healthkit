function deserializeHeartbeatSeriesSample(sample) {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate)
  };
}
export default deserializeHeartbeatSeriesSample;
//# sourceMappingURL=deserializeHeartbeatSeriesSample.js.map