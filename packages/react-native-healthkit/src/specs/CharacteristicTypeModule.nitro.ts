import type { HybridObject } from "react-native-nitro-modules";

export interface CharacteristicTypeModule
	extends HybridObject<{ ios: "swift" }> {
	getBloodType(): number;
	getDateOfBirth(): string;
	getBiologicalSex(): number;
	getFitzpatrickSkinType(): number;
	getWheelchairUse(): number;

	getBloodTypeAsync(): Promise<number>;
	getDateOfBirthAsync(): Promise<string>;
	getBiologicalSexAsync(): Promise<number>;
	getFitzpatrickSkinTypeAsync(): Promise<number>;
	getWheelchairUseAsync(): Promise<number>;
}
