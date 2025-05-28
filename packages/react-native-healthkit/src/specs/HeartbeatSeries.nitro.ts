import type { HybridObject } from "react-native-nitro-modules";
import type { Device, SourceRevision } from "./Source.nitro";
import type { DeletedSample, GenericMetadata } from "./Shared";

export interface HeartbeatSeriesSampleMetadata extends GenericMetadata {
    readonly HKMetadataKeyAlgorithmVersion: string;
};

export interface HeartbeatRaw {
    readonly timeSinceSeriesStart: number;
    readonly precededByGap: boolean;
};

export interface HeartbeatSeriesSampleRaw {
    readonly uuid: string;
    readonly device?: Device;
    readonly startTimestamp: number;
    readonly endTimestamp: number;
    readonly heartbeats: readonly HeartbeatRaw[];
    readonly metadata?: HeartbeatSeriesSampleMetadata;
    readonly sourceRevision?: SourceRevision;
};


export interface QueryHeartbeatSeriesSamplesResponseRaw {
    readonly samples: readonly HeartbeatSeriesSampleRaw[];
    readonly deletedSamples: readonly DeletedSample[];
    readonly newAnchor: string;
};

export interface HeartbeatSeries extends HybridObject<{ ios: 'swift' }> {
    queryHeartbeatSeriesSamples(
        fromTimestamp: number,
        toTimestamp: number,
        limit: number,
        ascending: boolean
    ): Promise<readonly HeartbeatSeriesSampleRaw[]>;
    queryHeartbeatSeriesSamplesWithAnchor(
        fromTimestamp: number,
        toTimestamp: number,
        limit: number,
        anchor: string
    ): Promise<QueryHeartbeatSeriesSamplesResponseRaw>;

}