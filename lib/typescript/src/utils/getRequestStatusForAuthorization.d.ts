import type { HealthkitReadAuthorization, HealthkitWriteAuthorization } from '../native-types';
declare const getRequestStatusForAuthorization: (read: readonly HealthkitReadAuthorization[], write?: readonly HealthkitWriteAuthorization[]) => Promise<import("../native-types").HKAuthorizationRequestStatus>;
export default getRequestStatusForAuthorization;
