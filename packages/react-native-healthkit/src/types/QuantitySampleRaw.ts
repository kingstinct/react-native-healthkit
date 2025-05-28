import type { AnyMap } from "react-native-nitro-modules";
import type { Device, SourceRevision } from "../specs/Source.nitro";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface QuantitySampleRaw {
  readonly uuid: string;
  readonly device?: Device;
  readonly quantityType: string;
  readonly startTimestamp: number;
  readonly endTimestamp: number;
  readonly quantity: number;
  readonly unit: string;
  readonly metadata: AnyMap;
  readonly sourceRevision?: SourceRevision;
};


export interface QuantitySampleRawForSaving {
  readonly startTimestamp?: number;
  readonly endTimestamp?: number;
  readonly quantityType: string;
  readonly quantity: number;
  readonly unit: string;
  readonly metadata: AnyMap;
  readonly sourceRevision?: SourceRevision;
};