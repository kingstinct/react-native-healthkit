import type { KnownSampleMetadata } from '../generated/healthkit.generated'
import type { BaseSample, DeletedSample, WithTypedMetadata } from './Shared'

export interface Heartbeat {
  readonly timeSinceSeriesStart: number
  readonly precededByGap: boolean
}

export interface HeartbeatSeriesSample extends BaseSample {
  readonly heartbeats: readonly Heartbeat[]
}

export type HeartbeatSeriesSampleTyped = WithTypedMetadata<
  HeartbeatSeriesSample,
  KnownSampleMetadata
>

export interface HeartbeatSeriesSamplesWithAnchorResponse {
  readonly samples: readonly HeartbeatSeriesSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface HeartbeatSeriesSamplesWithAnchorResponseTyped {
  readonly samples: readonly HeartbeatSeriesSampleTyped[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
