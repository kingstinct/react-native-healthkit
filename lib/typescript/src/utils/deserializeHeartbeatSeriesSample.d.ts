import type { HKHeartbeatSeriesSampleRaw } from '../native-types';
import type { HKHeartbeatSeriesSample } from '../types';
declare function deserializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSampleRaw): HKHeartbeatSeriesSample;
export default deserializeHeartbeatSeriesSample;
