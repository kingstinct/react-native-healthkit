import deserializeQuantitySample from './deserializeSample'
import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type {
  HKQuantityTypeIdentifier, UnitForIdentifier,
} from '../native-types'
import type { GenericQueryOptions, HKQuantitySample } from '../types'

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  options: Omit<GenericQueryOptions, 'anchor'> & { readonly unit?: TUnit }
) => Promise<readonly HKQuantitySample<TIdentifier>[]>;

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

  return result.map(deserializeQuantitySample)
}

export default queryQuantitySamples
