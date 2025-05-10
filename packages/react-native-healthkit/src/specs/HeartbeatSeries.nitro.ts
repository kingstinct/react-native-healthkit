import type { HybridObject } from "react-native-nitro-modules";
import type { HKDevice, HKSourceRevision } from "./Source.nitro";
import type { HKGenericMetadata } from "./Shared";

export interface HKHeartbeatSeriesSampleMetadata extends HKGenericMetadata {
    readonly HKMetadataKeyAlgorithmVersion: string;
};

export interface HKHeartbeatRaw {
    readonly timeSinceSeriesStart: number;
    readonly precededByGap: boolean;
};

export interface HKHeartbeatSeriesSampleRaw {
    readonly uuid: string;
    readonly device?: HKDevice;
    readonly startDate: string;
    readonly endDate: string;
    readonly heartbeats: readonly HKHeartbeatRaw[];
    readonly metadata?: HKHeartbeatSeriesSampleMetadata;
    readonly sourceRevision?: HKSourceRevision;
};


export interface QueryHeartbeatSeriesSamplesResponseRaw {
    readonly samples: readonly HKHeartbeatSeriesSampleRaw[];
    readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[];
    readonly newAnchor: string;
};

export interface DeletedHeartbeatSeriesSampleRaw {
    readonly uuid: string;
    readonly metadata: HKHeartbeatSeriesSampleMetadata;
};


export interface HeartbeatSeries extends HybridObject<{ ios: 'swift' }> {
    readonly queryHeartbeatSeriesSamples: (
        from: string,
        to: string,
        limit: number,
        ascending: boolean
    ) => Promise<readonly HKHeartbeatSeriesSampleRaw[]>;
    readonly queryHeartbeatSeriesSamplesWithAnchor: (
        from: string,
        to: string,
        limit: number,
        anchor: string
    ) => Promise<QueryHeartbeatSeriesSamplesResponseRaw>;

}