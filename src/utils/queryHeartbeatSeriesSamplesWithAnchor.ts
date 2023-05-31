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

export type QueryHeartbeatSeriesSamplesFn = (options: Omit<GenericQueryOptions, 'ascending'>) => Promise<QueryHeartbeatSeriesSamplesResponse>;

const queryHeartbeatSeriesSamplesWithAnchor: QueryHeartbeatSeriesSamplesFn = async (options) => {
  const opts = prepareOptions(options)

  const result = await Native.queryHeartbeatSeriesSamplesWithAnchor(
    opts.from,
    opts.to,
    opts.limit,
    opts.anchor,
  )

  return {
    deletedSamples: result.deletedSamples,
    newAnchor: result.newAnchor,
    samples: result.samples.map(deserializeHeartbeatSeriesSample),
  }
}

export default queryHeartbeatSeriesSamplesWithAnchor
