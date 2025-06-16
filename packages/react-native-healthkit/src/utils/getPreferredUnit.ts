import { Core } from '../modules'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

const getPreferredUnit = async (
  quantityType: QuantityTypeIdentifier,
): Promise<string> => {
  const units = await Core.getPreferredUnits([quantityType])
  const unit = units[0]?.unit

  if (!unit) {
    throw new Error(
      `No preferred unit found for quantity type: ${quantityType}`,
    )
  }

  return unit
}
export default getPreferredUnit
