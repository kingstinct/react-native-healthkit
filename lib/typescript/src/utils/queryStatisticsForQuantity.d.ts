import type { HKQuantityTypeIdentifier, HKStatisticsOptions, UnitForIdentifier } from '../native-types';
declare function queryStatisticsForQuantity<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>>(identifier: TIdentifier, options: readonly HKStatisticsOptions[], from: Date, to?: Date, unit?: TUnit): Promise<{
    mostRecentQuantityDateInterval?: {
        from: Date;
        to: Date;
    } | undefined;
    averageQuantity?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, TUnit> | undefined;
    maximumQuantity?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, TUnit> | undefined;
    minimumQuantity?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, TUnit> | undefined;
    sumQuantity?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, TUnit> | undefined;
    mostRecentQuantity?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, TUnit> | undefined;
    duration?: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, import("../native-types").TimeUnit> | undefined;
}>;
export default queryStatisticsForQuantity;
