import type { CLLocationForSaving } from '../types';
declare function saveWorkoutRoute(workoutUUID: string, locations: readonly CLLocationForSaving[]): Promise<boolean>;
export default saveWorkoutRoute;
