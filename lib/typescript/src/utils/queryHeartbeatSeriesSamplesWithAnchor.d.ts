import type { DeletedHeartbeatSeriesSampleRaw } from '../native-types';
import type { GenericQueryOptions, HKHeartbeatSeriesSample } from '../types';
export type QueryHeartbeatSeriesSamplesResponse = {
    readonly samples: readonly HKHeartbeatSeriesSample[];
    readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[];
    readonly newAnchor: string;
};
export type QueryHeartbeatSeriesSamplesFn = (options: Omit<GenericQueryOptions, 'ascending'>) => Promise<QueryHeartbeatSeriesSamplesResponse>;
declare const queryHeartbeatSeriesSamplesWithAnchor: QueryHeartbeatSeriesSamplesFn;
export default queryHeartbeatSeriesSamplesWithAnchor;
