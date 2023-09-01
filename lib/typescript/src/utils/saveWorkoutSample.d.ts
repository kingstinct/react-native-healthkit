import type { HKWorkoutActivityType, HKWorkoutMetadata } from '../native-types';
import type { HKQuantitySampleForSaving } from '../types';
declare function saveWorkoutSample<TIdentifier extends HKWorkoutActivityType>(typeIdentifier: TIdentifier, quantities: readonly HKQuantitySampleForSaving[], _start: Date, options?: {
    readonly end?: Date;
    readonly metadata?: HKWorkoutMetadata;
}): Promise<string | null>;
export default saveWorkoutSample;
