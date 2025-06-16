import type { HybridObject } from 'react-native-nitro-modules'
import type {
  HeartbeatSeriesSample,
  HeartbeatSeriesSamplesWithAnchorResponse,
} from '../types/HeartbeatSeries'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'

export interface HeartbeatSeriesModule extends HybridObject<{ ios: 'swift' }> {
  queryHeartbeatSeriesSamples(
    options?: QueryOptionsWithSortOrder,
  ): Promise<readonly HeartbeatSeriesSample[]>

  queryHeartbeatSeriesSamplesWithAnchor(
    options: QueryOptionsWithAnchor,
  ): Promise<HeartbeatSeriesSamplesWithAnchorResponse>
}
