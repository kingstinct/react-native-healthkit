import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { HKCategoryTypeIdentifier, HKCategorySampleRaw } from '../native-types'
import type { GenericQueryOptions } from '../types'

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: GenericQueryOptions
) => Promise<HKCategorySampleRaw<T>>;

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

  return raw
}

export default queryCategorySamples
