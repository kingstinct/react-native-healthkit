function deserializeWorkout(sample) {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate)
  };
}
export default deserializeWorkout;
//# sourceMappingURL=deserializeWorkout.js.map