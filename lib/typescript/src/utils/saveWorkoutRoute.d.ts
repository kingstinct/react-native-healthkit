import type { CLLocationRawForSaving } from '../types';
declare function saveWorkoutRoute(workoutUUID: string, locations: readonly CLLocationRawForSaving[]): Promise<boolean>;
export default saveWorkoutRoute;
