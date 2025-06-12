import type { AnyMap } from "react-native-nitro-modules";

import type { QuantityTypeIdentifier } from "./QuantityTypeIdentifier";
import type { SourceRevision } from "./Source";
import type { Device } from "./Device";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface QuantitySample {
	readonly uuid: string;
	readonly device?: Device;
	readonly quantityType: QuantityTypeIdentifier;
	readonly start: Date;
	readonly end: Date;
	readonly quantity: number;
	readonly unit: string;
	readonly metadata: AnyMap;
	readonly sourceRevision?: SourceRevision;
}

export interface QuantitySampleForSaving {
	readonly start: Date;
	readonly end: Date;
	readonly quantityType: QuantityTypeIdentifier;
	readonly quantity: number;
	readonly unit: string;
	readonly metadata: AnyMap;
	readonly sourceRevision?: SourceRevision;
}
