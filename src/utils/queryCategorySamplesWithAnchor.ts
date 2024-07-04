import deserializeCategorySample from './deserializeCategorySample'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { HKCategoryTypeIdentifier, DeletedCategorySampleRaw } from '../native-types'
import type { GenericQueryOptions, HKCategorySample } from '../types'

export type QueryCategorySamplesWithAnchorResponse<T extends HKCategoryTypeIdentifier> = {
  readonly samples: readonly HKCategorySample<T>[],
  readonly deletedSamples: readonly DeletedCategorySampleRaw<T>[],
  readonly newAnchor: string
}

export type QueryCategorySamplesWithAnchorFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: Omit<GenericQueryOptions, 'ascending'>
) => Promise<QueryCategorySamplesWithAnchorResponse<T>>;

const queryCategorySamplesWithAnchor: QueryCategorySamplesWithAnchorFn = async (
  identifier,
  options,
) => {
  const opts = prepareOptions(options)
  const raw = await Native.queryCategorySamplesWithAnchor(
    identifier,
    opts.from,
    opts.to,
    opts.limit,
    opts.anchor,
  )

  return {
    samples: raw.samples.map(deserializeCategorySample),
    deletedSamples: raw.deletedSamples,
    newAnchor: raw.newAnchor,
  }
}

export default queryCategorySamplesWithAnchor
