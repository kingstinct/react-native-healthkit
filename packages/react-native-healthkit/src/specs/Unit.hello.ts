import type { HybridObject } from "react-native-nitro-modules";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";

export interface Unit extends HybridObject<{ ios: 'swift' }> {
    getPreferredUnits(
        identifiers: readonly QuantityTypeIdentifier[]
    ): Promise<Record<QuantityTypeIdentifier, string>>;
}
