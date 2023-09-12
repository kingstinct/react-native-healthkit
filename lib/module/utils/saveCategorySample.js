import Native from '../native-types';
async function saveCategorySample(identifier, value, options) {
  const start = (options === null || options === void 0 ? void 0 : options.start) || (options === null || options === void 0 ? void 0 : options.end) || new Date();
  const end = (options === null || options === void 0 ? void 0 : options.end) || (options === null || options === void 0 ? void 0 : options.start) || new Date();
  const metadata = (options === null || options === void 0 ? void 0 : options.metadata) || {};
  return Native.saveCategorySample(identifier, value, start.toISOString(), end.toISOString(), metadata || {});
}
export default saveCategorySample;
//# sourceMappingURL=saveCategorySample.js.map