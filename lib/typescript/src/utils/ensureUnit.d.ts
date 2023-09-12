import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types';
declare const ensureUnit: <TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier>>(type: TIdentifier, providedUnit?: TUnit | undefined) => Promise<TUnit>;
export default ensureUnit;
