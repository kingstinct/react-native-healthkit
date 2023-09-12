import ensureMetadata from './ensureMetadata';
import Native from '../native-types';
async function saveWorkoutSample(typeIdentifier, quantities, _start, options) {
  const start = _start.toISOString();
  const end = ((options === null || options === void 0 ? void 0 : options.end) || new Date()).toISOString();
  return Native.saveWorkoutSample(typeIdentifier, quantities.map(quantity => {
    const {
      startDate,
      endDate,
      ...rest
    } = quantity;
    const updatedQuantity = {
      ...rest,
      ...(startDate && {
        startDate: startDate.toISOString()
      }),
      ...(endDate && {
        endDate: endDate.toISOString()
      })
    };
    return {
      ...updatedQuantity,
      metadata: ensureMetadata(quantity.metadata)
    };
  }), start, end, ensureMetadata(options === null || options === void 0 ? void 0 : options.metadata));
}
export default saveWorkoutSample;
//# sourceMappingURL=saveWorkoutSample.js.map