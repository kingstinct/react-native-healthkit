import type { HybridObject } from "react-native-nitro-modules";
import type { WorkoutActivityType } from "./WorkoutsModule.nitro";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutconfiguration Apple Docs }
 */
export interface WorkoutConfiguration {
    readonly activityType: WorkoutActivityType;
    readonly locationType?: WorkoutSessionLocationType;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutsessionlocationtype Apple Docs }
 */
export enum WorkoutSessionLocationType {
    unknown = 1,
    indoor = 2,
    outdoor = 3
}

export interface WorkoutKitModule extends HybridObject<{ ios: 'swift' }> {
    /**
     * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648358-startwatchapp Apple Docs }
     */
    startWatchAppWithWorkoutConfiguration(
        workoutConfiguration: WorkoutConfiguration
    ): Promise<boolean>;
}

