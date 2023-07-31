import type { HKSampleTypeIdentifier } from '..';
declare function useSubscribeToChanges<TIdentifier extends HKSampleTypeIdentifier>(identifier: TIdentifier, onChange: () => void): void;
export default useSubscribeToChanges;
