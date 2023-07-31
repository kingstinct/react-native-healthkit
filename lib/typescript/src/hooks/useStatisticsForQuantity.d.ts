import type { HKQuantityTypeIdentifier, HKStatisticsOptions, UnitForIdentifier } from '../native-types';
import type { QueryStatisticsResponse } from '../types';
declare function useStatisticsForQuantity<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, options: readonly HKStatisticsOptions[], from: Date, to?: Date, unit?: TUnit): QueryStatisticsResponse<TIdentifier, TUnit> | null;
export default useStatisticsForQuantity;
