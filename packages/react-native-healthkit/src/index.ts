import { NitroModules } from "react-native-nitro-modules"
import type { Core as CoreNative } from "./specs/Core.nitro"
import type { Auth as AuthNative } from "./specs/Auth.nitro"
import type { WorkoutsModule } from "./specs/WorkoutsModule.nitro"
import type { Characteristic as CharacteristicNative } from "./specs/Characteristic.nitro"
import type { QuantityType as QuantityTypeNative } from "./specs/QuantityType.nitro"
import type { CategoryType as CategoryTypeNative } from "./specs/CategoryType.nitro"
import type { Correlation as CorrelationNative } from "./specs/Correlation.nitro"
import type { HeartbeatSeries as HeartbeatSeriesNative } from "./specs/HeartbeatSeries.nitro"
import type { SourceHybridObject as SourceNative } from "./specs/Source.nitro"
import type { StateOfMind as StateOfMindNative } from "./specs/StateOfMind.nitro"

export const Core = NitroModules.createHybridObject<CoreNative>("Core")

export const Auth = NitroModules.createHybridObject<AuthNative>("Auth")

export const Workouts = NitroModules.createHybridObject<WorkoutsModule>("WorkoutsModule")

export const Characteristic = NitroModules.createHybridObject<CharacteristicNative>("Characteristic")

export const QuantityType = NitroModules.createHybridObject<QuantityTypeNative>("QuantityType")

export const CategoryType = NitroModules.createHybridObject<CategoryTypeNative>("CategoryType")

export const Correlation = NitroModules.createHybridObject<CorrelationNative>("Correlation")

export const HeartbeatSeries = NitroModules.createHybridObject<HeartbeatSeriesNative>("HeartbeatSeries")

export const Source = NitroModules.createHybridObject<SourceNative>("SourceHybridObject")

export const StateOfMind = NitroModules.createHybridObject<StateOfMindNative>("StateOfMind")
