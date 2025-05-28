import type { Device } from "../specs/Source.nitro";
import type { QuantityRaw } from "../specs/QuantityType.nitro";
import type { GenericMetadata } from "../specs/Shared";
import type { SourceRevision } from "../specs/Source.nitro";
import type { WorkoutActivity, WorkoutActivityType } from "../specs/Workout.nitro";
import type { WorkoutEvent } from "../specs/Workout.nitro";

export interface WorkoutRaw {
    readonly uuid: string;
    readonly device?: Device;
    readonly workoutActivityType: WorkoutActivityType;
    readonly duration: number;
    readonly totalDistance?: QuantityRaw;
    readonly totalEnergyBurned?: QuantityRaw;
    readonly totalSwimmingStrokeCount?: QuantityRaw;
    readonly totalFlightsClimbed?: QuantityRaw;
    readonly startTimestamp: number;
    readonly endTimestamp: number;
    readonly metadata?: GenericMetadata;
    readonly sourceRevision?: SourceRevision;
    readonly events?: readonly WorkoutEvent[];
    readonly activities?: readonly WorkoutActivity[];
    readonly workoutPlanId?: string;
};