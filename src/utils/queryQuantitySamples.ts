import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type {
  HKQuantityTypeIdentifier, UnitForIdentifier, HKQuantitySampleRaw,
} from '../native-types'
import type { GenericQueryOptions } from '../types'

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  options: GenericQueryOptions & { readonly unit?: TUnit }
) => Promise<readonly HKQuantitySampleRaw<TIdentifier>[]>;

const queryQuantitySamples: QueryQuantitySamplesFn = async (
  identifier,
  options,
) => {
  const unit = await ensureUnit(identifier, options.unit)
  const opts = prepareOptions(options)

  const result = await Native.queryQuantitySamples(
    identifier,
    unit,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending,
  )

  return result
}

export default queryQuantitySamples
