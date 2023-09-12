import Native from '../native-types';
const ensureUnit = async (type, providedUnit) => {
  if (providedUnit) {
    return providedUnit;
  }
  const unit = await Native.getPreferredUnits([type]);
  return unit[type];
};
export default ensureUnit;
//# sourceMappingURL=ensureUnit.js.map