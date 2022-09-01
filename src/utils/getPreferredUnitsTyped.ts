import Native, { HKQuantityTypeIdentifier, UnitOfEnergy, UnitOfLength } from '../native-types'

import type { HKUnit } from '../native-types'

async function getPreferredUnitsTyped<
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(options?: { readonly energyUnit?: TEnergy; readonly distanceUnit?: TDistance }) {
  let energyUnit = options?.energyUnit
  let distanceUnit = options?.distanceUnit

  if (!energyUnit || !distanceUnit) {
    const units = await Native.getPreferredUnits([
      HKQuantityTypeIdentifier.distanceWalkingRunning,
      HKQuantityTypeIdentifier.activeEnergyBurned,
    ])
    if (!energyUnit) {
      energyUnit = units[HKQuantityTypeIdentifier.activeEnergyBurned] as
      | TEnergy
      | undefined
    }
    if (!distanceUnit) {
      distanceUnit = units[HKQuantityTypeIdentifier.distanceWalkingRunning] as
      | TDistance
      | undefined
    }
  }

  if (!energyUnit) {
    energyUnit = UnitOfEnergy.Kilocalories as TEnergy
  }
  if (!distanceUnit) {
    distanceUnit = UnitOfLength.Meter as TDistance
  }
  return { energyUnit, distanceUnit }
}

export default getPreferredUnitsTyped
