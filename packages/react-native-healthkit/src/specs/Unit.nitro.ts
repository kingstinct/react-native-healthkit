import type { HybridObject } from "react-native-nitro-modules";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKUnit } from "../types/Units";

export interface Unit extends HybridObject<{ ios: 'swift' }> {
    readonly getPreferredUnits: (
        identifiers: readonly HKQuantityTypeIdentifier[]
    ) => Promise<Record<HKQuantityTypeIdentifier, HKUnit>>;
}
