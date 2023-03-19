import Native from '../native-types'
import deserializeQuantitySample from './deserializeSample'
import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'

import type { HKQuantityTypeIdentifier, UnitForIdentifier, DeletedQuantitySampleRaw } from '../native-types'
import type { GenericQueryOptions, HKQuantitySample } from '../types'

export type QueryQuantitySamplesResponse<T extends HKQuantityTypeIdentifier> = {
  readonly samples: readonly HKQuantitySample<T>[],
  readonly deletedSamples: readonly DeletedQuantitySampleRaw<T>[],
  readonly newAnchor: number
}

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  options: GenericQueryOptions & { readonly unit?: TUnit }
) => Promise<QueryQuantitySamplesResponse<TIdentifier>>;

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
    opts.anchor,
  )

  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(deserializeQuantitySample),
  }
}

export default queryQuantitySamples
