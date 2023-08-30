/**
 * @description By default, HealthKit data is available on iOS and watchOS. HealthKit data is also available on iPadOS 17 or later. However, devices running in an enterprise environment may restrict access to HealthKit data.
* @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple HealthKit isHealthDataAvailable}
* @returns {boolean | null} true if HealthKit is available; otherwise, false. null while initializing.
*/
declare const useIsHealthDataAvailable: () => boolean | null;
export default useIsHealthDataAvailable;
