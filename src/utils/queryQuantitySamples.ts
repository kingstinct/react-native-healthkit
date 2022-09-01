import Native from '../native-types'
import deserializeSample from './deserializeSample'
import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'

import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'
import type { GenericQueryOptions, HKQuantitySample } from '../types'

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  options: GenericQueryOptions & { readonly unit?: TUnit }
) => Promise<readonly HKQuantitySample<TIdentifier>[]>;

const queryQuantitySamples: QueryQuantitySamplesFn = async (
  identifier,
  options,
) => {
  const unit = await ensureUnit(identifier, options.unit)
  const opts = prepareOptions(options)

  const quantitySamples = await Native.queryQuantitySamples(
    identifier,
    unit,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending,
  )

  return quantitySamples.map(deserializeSample)
}

export default queryQuantitySamples
