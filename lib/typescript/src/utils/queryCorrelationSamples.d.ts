import type { HKCorrelationTypeIdentifier } from '../native-types';
import type { GenericQueryOptions, HKCorrelation } from '../types';
export type QueryCorrelationSamplesFn = <TIdentifier extends HKCorrelationTypeIdentifier>(typeIdentifier: TIdentifier, options: Omit<GenericQueryOptions, 'anchor' | 'ascending' | 'limit'>) => Promise<readonly HKCorrelation<TIdentifier>[]>;
declare const queryCorrelationSamples: QueryCorrelationSamplesFn;
export default queryCorrelationSamples;
