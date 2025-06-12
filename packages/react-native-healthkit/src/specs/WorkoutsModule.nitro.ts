import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type {
	QueryWorkoutSamplesWithAnchorResponse,
	WorkoutActivityType,
	WorkoutQueryOptions,
	WorkoutQueryOptionsWithAnchor,
	WorkoutTotals,
} from "../types/Workouts";
import type { QuantitySampleForSaving } from "../types/QuantitySample";
import type { WorkoutProxy } from "./WorkoutProxy.nitro";

export interface WorkoutsModule extends HybridObject<{ ios: "swift" }> {
	saveWorkoutSample(
		workoutActivityType: WorkoutActivityType,
		quantities: readonly QuantitySampleForSaving[],
		startDate: Date,
		endDate: Date,
		totals: WorkoutTotals,
		metadata: AnyMap,
	): Promise<string>;

	queryWorkoutByUUID(workoutUUID: string): Promise<WorkoutProxy | null>;

	queryWorkoutSamplesWithAnchor(
		options: WorkoutQueryOptionsWithAnchor,
	): Promise<QueryWorkoutSamplesWithAnchorResponse>;

	queryWorkoutSamples(
		options: WorkoutQueryOptions,
	): Promise<WorkoutProxy[]>;
}
