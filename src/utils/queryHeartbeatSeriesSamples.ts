import deserializeHeartbeatSeriesSample from './deserializeHeartbeatSeriesSample'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { DeletedHeartbeatSeriesSampleRaw } from '../native-types'
import type { GenericQueryOptions, HKHeartbeatSeriesSample } from '../types'

export type QueryHeartbeatSeriesSamplesResponse = {
  readonly samples: readonly HKHeartbeatSeriesSample[],
  readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[],
  readonly newAnchor: string
}

export type QueryHeartbeatSeriesSamplesFn = (options: Omit<GenericQueryOptions, 'anchor'>) => Promise<readonly HKHeartbeatSeriesSample[]>;

const queryHeartbeatSeriesSamples: QueryHeartbeatSeriesSamplesFn = async (options) => {
  const opts = prepareOptions(options)

  const result = await Native.queryHeartbeatSeriesSamples(
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending,
  )

  return result.map(deserializeHeartbeatSeriesSample)
}

export default queryHeartbeatSeriesSamples
