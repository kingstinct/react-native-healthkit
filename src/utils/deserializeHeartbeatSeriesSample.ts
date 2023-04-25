import type { HKHeartbeatSeriesSampleRaw } from '../native-types'
import type { HKHeartbeatSeriesSample } from '../types'

function deserializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSampleRaw): HKHeartbeatSeriesSample {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  }
}

export default deserializeHeartbeatSeriesSample
