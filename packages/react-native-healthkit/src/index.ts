import { NitroModules } from "react-native-nitro-modules"
import type { Core } from "./specs/Core.nitro"

export const CoreObject = NitroModules.createHybridObject<Core>("Core")
