import { HKQuantityTypeIdentifier, UnitOfEnergy, UnitOfTime } from '../native-types';
import type { GenericQueryOptions } from '../types';
declare const queryActivitySummaryForQuantity: <TEnergyUnit extends UnitOfEnergy, TTimeUnit extends UnitOfTime>(options: Omit<GenericQueryOptions, "anchor" | "limit" | "ascending"> & {
    readonly energyUnit?: TEnergyUnit | undefined;
    readonly timeUnit?: TTimeUnit | undefined;
}) => Promise<{
    startDate: Date;
    activeEnergyBurned: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.activeEnergyBurned, TEnergyUnit>;
    activeEnergyBurnedGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.activeEnergyBurned, TEnergyUnit>;
    appleMoveTime: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.appleMoveTime, TTimeUnit>;
    appleMoveTimeGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.appleMoveTime, TTimeUnit>;
    appleExerciseTime: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.appleExerciseTime, TTimeUnit>;
    appleExerciseTimeGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.appleExerciseTime, TTimeUnit>;
    exerciseTimeGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier.appleExerciseTime, TTimeUnit>;
    appleStandHours: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, import("../native-types").HKUnits.Count>;
    standHoursGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, import("../native-types").HKUnits.Count>;
    appleStandHoursGoal: import("../native-types").HKQuantity<HKQuantityTypeIdentifier, import("../native-types").HKUnits.Count>;
}[]>;
export default queryActivitySummaryForQuantity;
