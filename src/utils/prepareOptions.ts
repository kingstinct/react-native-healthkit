import serializeDate from './serializeDate'

import type { GenericQueryOptions } from '../types'

const prepareOptions = (options: GenericQueryOptions) => {
  const limit = !options.limit || options.limit === Infinity ? 0 : options.limit
  const ascending = options.ascending ?? limit === 0
  const from = serializeDate(options.from)
  const to = serializeDate(options.to)
  const anchor = options.anchor ?? -1
  return {
    limit, ascending, from, to, anchor,
  }
}

export default prepareOptions
