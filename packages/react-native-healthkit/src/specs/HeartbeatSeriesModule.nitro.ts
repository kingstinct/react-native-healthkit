import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { DeletedSample, GenericMetadata } from "../types/Shared";
import type { Device, SourceRevision } from "./CoreModule.nitro";
import type { QueryOptionsWithAnchor, QueryOptionsWithSortOrder } from "../types/QueryOptions";

export interface HeartbeatSeriesSampleMetadata extends GenericMetadata {
    readonly HKMetadataKeyAlgorithmVersion: string;
};

export interface HeartbeatRaw {
    readonly timeSinceSeriesStart: number;
    readonly precededByGap: boolean;
};

export interface HeartbeatSeriesSample {
    readonly uuid: string;
    readonly device?: Device;
    readonly start: Date;
    readonly end: Date;
    readonly heartbeats: readonly HeartbeatRaw[];
    readonly metadata?: AnyMap;
    readonly sourceRevision?: SourceRevision;
};


export interface HeartbeatSeriesSamplesWithAnchorResponse {
    readonly samples: readonly HeartbeatSeriesSample[];
    readonly deletedSamples: readonly DeletedSample[];
    readonly newAnchor: string;
};


export interface HeartbeatSeriesModule extends HybridObject<{ ios: 'swift' }> {
    queryHeartbeatSeriesSamples(
        options?: QueryOptionsWithSortOrder
    ): Promise<readonly HeartbeatSeriesSample[]>;
    queryHeartbeatSeriesSamplesWithAnchor(
        options: QueryOptionsWithAnchor
    ): Promise<HeartbeatSeriesSamplesWithAnchorResponse>;
}