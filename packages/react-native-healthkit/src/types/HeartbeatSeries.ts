import type { AnyMap } from 'react-native-nitro-modules'
import type { Device } from './Device'
import type { DeletedSample, GenericMetadata } from './Shared'
import type { SourceRevision } from './Source'

export interface HeartbeatSeriesSampleMetadata extends GenericMetadata {
  readonly HKMetadataKeyAlgorithmVersion: string
}

export interface Heartbeat {
  readonly timeSinceSeriesStart: number
  readonly precededByGap: boolean
}

export interface HeartbeatSeriesSample {
  readonly uuid: string
  readonly device?: Device
  readonly startDate: Date
  readonly endDate: Date
  readonly heartbeats: readonly Heartbeat[]
  readonly metadata?: AnyMap
  readonly sourceRevision?: SourceRevision
}

export interface HeartbeatSeriesSamplesWithAnchorResponse {
  readonly samples: readonly HeartbeatSeriesSample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
