import getPreferredUnits from './getPreferredUnits';
const getPreferredUnit = async type => {
  const [unit] = await getPreferredUnits([type]);
  return unit;
};
export default getPreferredUnit;
//# sourceMappingURL=getPreferredUnit.js.map