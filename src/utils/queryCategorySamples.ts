import Native from '../native-types'
import deserializCategorySample from './deserializeCategorySample'
import prepareOptions from './prepareOptions'

import type { HKCategoryTypeIdentifier } from '../native-types'
import type { GenericQueryOptions, HKCategorySample } from '../types'

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: GenericQueryOptions
) => Promise<readonly HKCategorySample<T>[]>;

const queryCategorySamples: QueryCategorySamplesFn = async (
  identifier,
  options,
) => {
  const opts = prepareOptions(options)
  const results = await Native.queryCategorySamples(
    identifier,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending,
  )

  return results.map(deserializCategorySample)
}

export default queryCategorySamples
