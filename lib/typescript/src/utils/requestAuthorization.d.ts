import type { HealthkitReadAuthorization, HealthkitWriteAuthorization } from '../native-types';
/** See https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization */
declare const requestAuthorization: (read: readonly HealthkitReadAuthorization[], write?: readonly HealthkitWriteAuthorization[]) => Promise<boolean>;
export default requestAuthorization;
