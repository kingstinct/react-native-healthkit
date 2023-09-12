import type { DeletedHeartbeatSeriesSampleRaw } from '../native-types';
import type { GenericQueryOptions, HKHeartbeatSeriesSample } from '../types';
export type QueryHeartbeatSeriesSamplesResponse = {
    readonly samples: readonly HKHeartbeatSeriesSample[];
    readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[];
    readonly newAnchor: string;
};
export type QueryHeartbeatSeriesSamplesFn = (options: Omit<GenericQueryOptions, 'anchor'>) => Promise<readonly HKHeartbeatSeriesSample[]>;
declare const queryHeartbeatSeriesSamples: QueryHeartbeatSeriesSamplesFn;
export default queryHeartbeatSeriesSamples;
