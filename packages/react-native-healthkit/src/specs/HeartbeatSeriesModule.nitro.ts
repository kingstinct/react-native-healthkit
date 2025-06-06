import type { HybridObject } from "react-native-nitro-modules";
import type { QueryOptionsWithAnchor, QueryOptionsWithSortOrder } from "../types/QueryOptions";
import type { HeartbeatSeriesSample, HeartbeatSeriesSamplesWithAnchorResponse } from "../types/HeartbeatSeries";

export interface HeartbeatSeriesModule extends HybridObject<{ ios: 'swift' }> {
    queryHeartbeatSeriesSamples(
        options?: QueryOptionsWithSortOrder
    ): Promise<readonly HeartbeatSeriesSample[]>;
    queryHeartbeatSeriesSamplesWithAnchor(
        options: QueryOptionsWithAnchor
    ): Promise<HeartbeatSeriesSamplesWithAnchorResponse>;
}