import { NitroModules } from "react-native-nitro-modules"
// import type { Core } from "./specs/Core.nitro"
import type { Auth } from "./specs/Auth.nitro"
import type { Workout } from "./specs/Workout.nitro"

// export const CoreObject = NitroModules.createHybridObject<Core>("Core")

export const AuthObject = NitroModules.createHybridObject<Auth>("Auth")

export const WorkoutObject = NitroModules.createHybridObject<Workout>("Workout")