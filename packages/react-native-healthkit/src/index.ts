import { NitroModules } from "react-native-nitro-modules";
import type { CoreModule } from "./specs/CoreModule.nitro";
import type { WorkoutsModule } from "./specs/WorkoutsModule.nitro";
import type { CharacteristicTypeModule } from "./specs/CharacteristicTypeModule.nitro";
import type { QuantityTypeModule } from "./specs/QuantityTypeModule.nitro";
import type { CategoryTypeModule, CategoryTypeModuleTyped } from "./specs/CategoryTypeModule.nitro";
import type { CorrelationTypeModule } from "./specs/CorrelationTypeModule.nitro";
import type { HeartbeatSeriesModule } from "./specs/HeartbeatSeriesModule.nitro";
import type { StateOfMindModule } from "./specs/StateOfMindModule.nitro";
import type { QuantityTypeIdentifier } from "./types/QuantityTypeIdentifier";
import { Platform } from "react-native";

export const Core = NitroModules.createHybridObject<CoreModule>("CoreModule");

export const Workouts =
	NitroModules.createHybridObject<WorkoutsModule>("WorkoutsModule");

export const Characteristics =
	NitroModules.createHybridObject<CharacteristicTypeModule>(
		"CharacteristicTypeModule",
	);

export const QuantityTypes =
	NitroModules.createHybridObject<QuantityTypeModule>("QuantityTypeModule");

export const CategoryTypes =
	NitroModules.createHybridObject<CategoryTypeModule>("CategoryTypeModule") as CategoryTypeModuleTyped;

export const CorrelationTypes =
	NitroModules.createHybridObject<CorrelationTypeModule>(
		"CorrelationTypeModule",
	);

export const HeartbeatSeries =
	NitroModules.createHybridObject<HeartbeatSeriesModule>(
		"HeartbeatSeriesModule",
	);

export const StateOfMind =
	NitroModules.createHybridObject<StateOfMindModule>("StateOfMindModule");


	
const currentMajorVersionIOS = Platform.OS === 'ios' ? Number.parseInt(Platform.Version, 10) : 0

/**
 * Quantity types that are not available before iOS 17
 */
type QuantityTypesIOS17Plus = 
  | "HKQuantityTypeIdentifierCyclingCadence"
  | "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower" 
  | "HKQuantityTypeIdentifierCyclingPower"
  | "HKQuantityTypeIdentifierCyclingSpeed"
  | "HKQuantityTypeIdentifierPhysicalEffort"
  | "HKQuantityTypeIdentifierTimeInDaylight";

/**
 * Available quantity types for iOS versions before iOS 17
 */
export type AvailableQuantityTypesBeforeIOS17 = Exclude<QuantityTypeIdentifier, QuantityTypesIOS17Plus>;

/**
 * Available quantity types for iOS 17 and later (all quantity types)
 */
export type AvailableQuantityTypesIOS17Plus = QuantityTypeIdentifier;

/**
 * Get available quantity types based on iOS version
 * @param majorVersionIOS - iOS major version number (defaults to current iOS version)
 * @returns Available quantity types for the given iOS version
 */
export type AvailableQuantityTypes<T extends number = typeof currentMajorVersionIOS> = 
  T extends 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 ? AvailableQuantityTypesIOS17Plus : AvailableQuantityTypesBeforeIOS17;