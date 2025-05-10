import type { HKGenericMetadata } from "../specs/Shared";
import type { HKDevice, HKSourceRevision } from "../specs/Source.nitro";
import type { HKQuantityTypeIdentifier } from "./HKQuantityTypeIdentifier";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface HKQuantitySampleRaw {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly quantityType: HKQuantityTypeIdentifier;
  readonly startDate: string;
  readonly endDate: string;
  readonly quantity: number;
  readonly unit: string;
  readonly metadata: HKGenericMetadata;
  readonly sourceRevision?: HKSourceRevision;
};


export interface HKQuantitySampleRawForSaving {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly quantityType: HKQuantityTypeIdentifier;
  readonly quantity: number;
  readonly unit: string;
  readonly metadata: HKGenericMetadata;
  readonly sourceRevision?: HKSourceRevision;
};