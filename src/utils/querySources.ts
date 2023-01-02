import Native from '../native-types'

import type {
  HKQuantityTypeIdentifier,
  HKSource,
  HKCategoryTypeIdentifier,
} from '../native-types'

export type QuerySourcesFn = <
  TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier
>(
  identifier: TIdentifier
) => Promise<readonly HKSource[]>;

const querySources: QuerySourcesFn = async (identifier) => {
  const quantitySamples = await Native.querySources(identifier)

  return quantitySamples
}

export default querySources
