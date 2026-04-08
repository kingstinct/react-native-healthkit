import { Core } from '../modules'
import type { UnitForIdentifier } from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

const getPreferredUnit = async <T extends QuantityTypeIdentifier>(
  quantityType: T,
): Promise<UnitForIdentifier<T>> => {
  const units = await Core.getPreferredUnits([quantityType])
  const unit = units[0]?.unit

  if (!unit) {
    throw new Error(
      `No preferred unit found for quantity type: ${quantityType}`,
    )
  }

  return unit as UnitForIdentifier<T>
}
export default getPreferredUnit
