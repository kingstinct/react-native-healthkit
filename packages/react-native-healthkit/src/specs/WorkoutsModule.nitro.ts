import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { QuantitySampleForSaving } from "../types/QuantitySample";
import type { LocationForSaving, QueryWorkoutSamplesWithAnchorResponse, WorkoutActivityType, WorkoutPlan, WorkoutRoute, WorkoutSample, WorkoutTotals } from "../types/Workouts";

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
        start: Date | null,
        end: Date | null,
        totals: WorkoutTotals,
        metadata: AnyMap
    ): Promise<string | null>;

    queryWorkoutByUUID(
        workoutUUID: string
    ): Promise<WorkoutSample | null>;

    queryWorkoutSamplesWithAnchor(
        energyUnit: string,
        distanceUnit: string,
        from: Date | null,
        to: Date | null,
        limit: number,
        anchor?: string
    ): Promise<QueryWorkoutSamplesWithAnchorResponse>;
}

