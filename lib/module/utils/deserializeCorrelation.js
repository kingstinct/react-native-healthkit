import deserializCategorySample from './deserializeCategorySample';
import deserializeQuantitySample from './deserializeSample';
function deserializeCorrelation(s) {
  return {
    ...s,
    objects: s.objects.map(o => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (o.quantity !== undefined) {
        return deserializeQuantitySample(o);
      }
      return deserializCategorySample(o);
    }),
    endDate: new Date(s.endDate),
    startDate: new Date(s.startDate)
  };
}
export default deserializeCorrelation;
//# sourceMappingURL=deserializeCorrelation.js.map