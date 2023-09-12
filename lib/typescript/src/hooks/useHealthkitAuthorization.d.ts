import type { HealthkitReadAuthorization, HealthkitWriteAuthorization, HKAuthorizationRequestStatus } from '../native-types';
declare const useHealthkitAuthorization: (read: readonly HealthkitReadAuthorization[], write?: readonly HealthkitWriteAuthorization[]) => readonly [HKAuthorizationRequestStatus | null, () => Promise<HKAuthorizationRequestStatus>];
export default useHealthkitAuthorization;
