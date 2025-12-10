import type { BaseSample, DeletedSample } from './Shared'

export interface Heartbeat {
  readonly timeSinceSeriesStart: number
  readonly precededByGap: boolean
}

export interface HeartbeatSeriesSample extends BaseSample {
  readonly heartbeats: readonly Heartbeat[]
}

export interface HeartbeatSeriesSamplesWithAnchorResponse {
  readonly samples: readonly HeartbeatSeriesSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
