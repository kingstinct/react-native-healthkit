import getPreferredUnits from './getPreferredUnits'

import type { HKQuantityTypeIdentifier, HKUnit } from '../native-types'

export type GetPreferredUnitFn = (
  identifier: HKQuantityTypeIdentifier
) => Promise<HKUnit>;

const getPreferredUnit: GetPreferredUnitFn = async (type) => {
  const [unit] = await getPreferredUnits([type])
  return unit!
}

export default getPreferredUnit
