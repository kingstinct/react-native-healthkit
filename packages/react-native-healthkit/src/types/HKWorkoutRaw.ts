import type { HKDevice } from "../specs/Source.nitro";
import type { HKQuantityRaw } from "../specs/QuantityType.nitro";
import type { HKGenericMetadata } from "../specs/Shared";
import type { HKSourceRevision } from "../specs/Source.nitro";
import type { HKWorkoutActivity } from "../specs/Workout.nitro";
import type { HKWorkoutEvent } from "../specs/Workout.nitro";

export interface HKWorkoutRaw {
    readonly uuid: string;
    readonly device?: HKDevice;
    readonly workoutActivityType: number;
    readonly duration: number;
    readonly totalDistance?: HKQuantityRaw;
    readonly totalEnergyBurned?: HKQuantityRaw;
    readonly totalSwimmingStrokeCount?: HKQuantityRaw;
    readonly totalFlightsClimbed?: HKQuantityRaw;
    readonly startDate: string;
    readonly endDate: string;
    readonly metadata?: HKGenericMetadata;
    readonly sourceRevision?: HKSourceRevision;
    readonly events?: readonly HKWorkoutEvent[];
    readonly activities?: readonly HKWorkoutActivity[];
    readonly workoutPlanId?: string;
};