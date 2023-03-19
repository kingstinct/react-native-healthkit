import Native from '../native-types'
import deserializCategorySample from './deserializeCategorySample'
import prepareOptions from './prepareOptions'

import type { HKCategoryTypeIdentifier, DeletedCategorySampleRaw } from '../native-types'
import type { GenericQueryOptions, HKCategorySample } from '../types'

export type QueryCategorySamplesResponse<T extends HKCategoryTypeIdentifier> = {
  readonly samples: readonly HKCategorySample<T>[],
  readonly deletedSamples: readonly DeletedCategorySampleRaw<T>[],
  readonly newAnchor: number
}

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: GenericQueryOptions
) => Promise<QueryCategorySamplesResponse<T>>;

const queryCategorySamples: QueryCategorySamplesFn = async (
  identifier,
  options,
) => {
  const opts = prepareOptions(options)
  const raw = await Native.queryCategorySamples(
    identifier,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending,
    opts.anchor,
  )

  return {
    samples: raw.samples.map(deserializCategorySample),
    deletedSamples: raw.deletedSamples,
    newAnchor: raw.newAnchor,
  }
}

export default queryCategorySamples
