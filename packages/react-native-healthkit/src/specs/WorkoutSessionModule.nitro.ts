import type { HybridObject } from "react-native-nitro-modules";
import type { WorkoutConfiguration } from "../types/WorkoutKit";

export interface WorkoutKitModule extends HybridObject<{ ios: 'swift' }> {
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648358-startwatchapp Apple Docs }
     */
    startWatchAppWithWorkoutConfiguration(
        workoutConfiguration: WorkoutConfiguration
    ): Promise<boolean>;
}