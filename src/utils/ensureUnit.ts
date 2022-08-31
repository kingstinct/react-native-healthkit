import Native from '../native-types'

import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'

const ensureUnit = async <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  type: TIdentifier,
  providedUnit?: TUnit,
) => {
  if (providedUnit) {
    return providedUnit
  }
  const unit = await Native.getPreferredUnits([type])
  return unit[type] as TUnit
}

export default ensureUnit
