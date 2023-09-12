import type { HKQuantityTypeIdentifier, HKSource, HKCategoryTypeIdentifier } from '../native-types';
export type QuerySourcesFn = <TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier>(identifier: TIdentifier) => Promise<readonly HKSource[]>;
declare const querySources: QuerySourcesFn;
export default querySources;
