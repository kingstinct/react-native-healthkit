import type { HybridObject } from "react-native-nitro-modules";
import type { HKDevice, HKSourceRevision } from "./Source.nitro";
import type { HKGenericMetadata } from "./Shared";


export type HKHeartbeatSeriesSampleMetadata = HKGenericMetadata & {
    readonly HKMetadataKeyAlgorithmVersion: string;
};

export type HKHeartbeatRaw = {
    readonly timeSinceSeriesStart: number;
    readonly precededByGap: boolean;
};

export type HKHeartbeatSeriesSampleRaw = {
    readonly uuid: string;
    readonly device?: HKDevice;
    readonly startDate: string;
    readonly endDate: string;
    readonly heartbeats: readonly HKHeartbeatRaw[];
    readonly metadata?: HKHeartbeatSeriesSampleMetadata;
    readonly sourceRevision?: HKSourceRevision;
};


export type QueryHeartbeatSeriesSamplesResponseRaw = {
    readonly samples: readonly HKHeartbeatSeriesSampleRaw[];
    readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[];
    readonly newAnchor: string;
};


/**
 * Represents a series sample containing heartbeat data..
 * @see {@link https://developer.apple.com/documentation/healthkit/HKDataTypeIdentifierHeartbeatSeries Apple Docs HKDataTypeIdentifierHeartbeatSeries}
 */
export declare const HKDataTypeIdentifierHeartbeatSeries: 'HKDataTypeIdentifierHeartbeatSeries'

export type DeletedHeartbeatSeriesSampleRaw = {
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