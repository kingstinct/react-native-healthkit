import type { HKCorrelationRaw, HKCorrelationTypeIdentifier } from '../native-types';
import type { HKCorrelation } from '../types';
declare function deserializeCorrelation<TIdentifier extends HKCorrelationTypeIdentifier>(s: HKCorrelationRaw<TIdentifier>): HKCorrelation<TIdentifier>;
export default deserializeCorrelation;
