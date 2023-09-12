import Native, { HKQuantityTypeIdentifier, UnitOfEnergy, UnitOfLength } from '../native-types';
async function getPreferredUnitsTyped(options) {
  let energyUnit = options === null || options === void 0 ? void 0 : options.energyUnit;
  let distanceUnit = options === null || options === void 0 ? void 0 : options.distanceUnit;
  if (!energyUnit || !distanceUnit) {
    const units = await Native.getPreferredUnits([HKQuantityTypeIdentifier.distanceWalkingRunning, HKQuantityTypeIdentifier.activeEnergyBurned]);
    if (!energyUnit) {
      energyUnit = units[HKQuantityTypeIdentifier.activeEnergyBurned];
    }
    if (!distanceUnit) {
      distanceUnit = units[HKQuantityTypeIdentifier.distanceWalkingRunning];
    }
  }
  if (!energyUnit) {
    energyUnit = UnitOfEnergy.Kilocalories;
  }
  if (!distanceUnit) {
    distanceUnit = UnitOfLength.Meter;
  }
  return {
    energyUnit,
    distanceUnit
  };
}
export default getPreferredUnitsTyped;
//# sourceMappingURL=getPreferredUnitsTyped.js.map