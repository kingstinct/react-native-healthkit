import Native from '../native-types'

import type { HKQuantityTypeIdentifier } from '../native-types'

export type DeleteQuantitySampleFn = <
  TIdentifier extends HKQuantityTypeIdentifier
>(
  identifier: TIdentifier,
  uuid: string
) => Promise<boolean>

const deleteQuantitySample: DeleteQuantitySampleFn = async (identifier, uuid) => Native.deleteQuantitySample(identifier, uuid)

export default deleteQuantitySample
