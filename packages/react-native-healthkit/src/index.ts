import { NitroModules } from "react-native-nitro-modules"
import type { ReactNativeHealthkit } from "./specs/ReactNativeHealthkit.nitro"

export const MathModule = NitroModules.createHybridObject<ReactNativeHealthkit>("ReactNativeHealthkit")
const result = MathModule.add(5, 7)
console.log(result)