import ensureMetadata from './ensureMetadata';
import Native from '../native-types';
async function saveCorrelationSample(typeIdentifier, samples, options) {
  const start = ((options === null || options === void 0 ? void 0 : options.start) || new Date()).toISOString();
  const end = ((options === null || options === void 0 ? void 0 : options.end) || new Date()).toISOString();
  return Native.saveCorrelationSample(typeIdentifier, samples.map(s => ({
    ...s,
    metadata: ensureMetadata(s.metadata)
  })), start, end, ensureMetadata(options === null || options === void 0 ? void 0 : options.metadata));
}
export default saveCorrelationSample;
//# sourceMappingURL=saveCorrelationSample.js.map