import Native from '../native-types';
const getPreferredUnits = async identifiers => {
  const units = await Native.getPreferredUnits(identifiers);
  return identifiers.map(i => units[i]);
};
export default getPreferredUnits;
//# sourceMappingURL=getPreferredUnits.js.map