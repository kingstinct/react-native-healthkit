import type { HKSampleTypeIdentifier } from '..';
declare const subscribeToChanges: (identifier: HKSampleTypeIdentifier, callback: () => void) => Promise<() => Promise<boolean>>;
export default subscribeToChanges;
