import type { HKQuantitySampleForSaving } from '@kingstinct/react-native-healthkit';
/**
 * Generates HR, distance, energy, speed and location samples to generate a sample Apple Health workout
 * @returns number
 */
export declare const generateWorkoutSamples: () => {
    startTime: number;
    samples: HKQuantitySampleForSaving[];
    locationSamples: {
        timestamp: number;
        latitude: number;
        longitude: number;
        altitude: number;
        horizontalAccuracy: number;
        verticalAccuracy: number;
        course: number;
        speed: number;
    }[];
};
