import Native from '../native-types'

import type { HKQuantityTypeIdentifier, HKUnit } from '../native-types'

export type GetPreferredUnitsFn = (
  identifiers: readonly HKQuantityTypeIdentifier[]
) => Promise<readonly HKUnit[]>;

const getPreferredUnits: GetPreferredUnitsFn = async (identifiers) => {
  const units = await Native.getPreferredUnits(identifiers)
  return identifiers.map((i) => units[i])
}

export default getPreferredUnits
