import deserializeCategorySample from './deserializeCategorySample'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { HKCategoryTypeIdentifier } from '../native-types'
import type { GenericQueryOptions, HKCategorySample } from '../types'

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: Omit<GenericQueryOptions, 'anchor'>
) => Promise<readonly HKCategorySample<T>[]>;

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
  )

  return raw.map(deserializeCategorySample)
}

export default queryCategorySamples
