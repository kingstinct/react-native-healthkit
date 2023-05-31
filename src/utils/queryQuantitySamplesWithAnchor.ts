import deserializeQuantitySample from './deserializeSample'
import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { HKQuantityTypeIdentifier, UnitForIdentifier, DeletedQuantitySampleRaw } from '../native-types'
import type { GenericQueryOptions, HKQuantitySample } from '../types'

export type QueryQuantitySamplesWithAnchorResponse<T extends HKQuantityTypeIdentifier> = {
  readonly samples: readonly HKQuantitySample<T>[],
  readonly deletedSamples: readonly DeletedQuantitySampleRaw<T>[],
  readonly newAnchor: string
}

export type QueryQuantitySamplesWithAnchorFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  options: Omit<GenericQueryOptions, 'ascending'> & { readonly unit?: TUnit }
) => Promise<QueryQuantitySamplesWithAnchorResponse<TIdentifier>>;

const queryQuantitySamplesWithAnchor: QueryQuantitySamplesWithAnchorFn = async (
  identifier,
  options,
) => {
  const unit = await ensureUnit(identifier, options.unit)
  const opts = prepareOptions(options)

  const result = await Native.queryQuantitySamplesWithAnchor(
    identifier,
    unit,
    opts.from,
    opts.to,
    opts.limit,
    opts.anchor,
  )

  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(deserializeQuantitySample),
  }
}

export default queryQuantitySamplesWithAnchor
