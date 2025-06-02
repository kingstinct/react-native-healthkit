import { NitroModules } from "react-native-nitro-modules"
import type { Core as CoreNative } from "./specs/Core.nitro"
import type { Auth as AuthNative } from "./specs/Auth.nitro"
import type { Workout as WorkoutNative } from "./specs/Workout.nitro"
import type { Characteristic as CharacteristicNative } from "./specs/Characteristic.nitro"

export const Core = NitroModules.createHybridObject<CoreNative>("Core")

export const Auth = NitroModules.createHybridObject<AuthNative>("Auth")

export const Workouts = NitroModules.createHybridObject<WorkoutNative>("Workout")

export const Characteristic = NitroModules.createHybridObject<CharacteristicNative>("Characteristic")
