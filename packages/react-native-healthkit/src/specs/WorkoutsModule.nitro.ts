import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { QuantitySampleForSaving } from "../types/QuantitySample";
import type { LocationForSaving, QueryWorkoutSamplesWithAnchorResponse, WorkoutActivityType, WorkoutMetadata, WorkoutPlan, WorkoutRoute, WorkoutSample, WorkoutTotals } from "../types/Workouts";

interface WorkoutQueryOptionsWithAnchor {
    energyUnit?: string,
    distanceUnit?: string,
    from?: Date,
    to?: Date,
    limit?: number,
    anchor?: string
}

export interface WorkoutsModule extends HybridObject<{ ios: 'swift' }> {
    getWorkoutRoutes(workoutUUID: string): Promise<readonly WorkoutRoute[]>;
    getWorkoutPlan(workoutUUID: string): Promise<WorkoutPlan | null>;
    saveWorkoutRoute(
        workoutUUID: string,
        locations: readonly LocationForSaving[]
    ): Promise<boolean>;

    saveWorkoutSample(
        workoutActivityType: WorkoutActivityType,
        quantities: readonly QuantitySampleForSaving[],
        start: Date,
        end: Date,
        totals: WorkoutTotals,
        metadata: AnyMap
    ): Promise<string | null>;

    queryWorkoutByUUID(
        workoutUUID: string
    ): Promise<WorkoutSample | null>;

    queryWorkoutSamplesWithAnchor(
        options: WorkoutQueryOptionsWithAnchor
    ): Promise<QueryWorkoutSamplesWithAnchorResponse>;
}

