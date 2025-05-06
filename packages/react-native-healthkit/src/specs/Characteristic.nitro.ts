import type { HybridObject } from "react-native-nitro-modules";



// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export enum HKCharacteristicTypeIdentifier {
    fitzpatrickSkinType = 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
    biologicalSex = 'HKCharacteristicTypeIdentifierBiologicalSex',
    bloodType = 'HKCharacteristicTypeIdentifierBloodType',
    dateOfBirth = 'HKCharacteristicTypeIdentifierDateOfBirth',
    wheelchairUse = 'HKCharacteristicTypeIdentifierWheelchairUse',
    activityMoveMode = 'HKCharacteristicTypeIdentifierActivityMoveMode', // HKActivityMoveModeObject
  }
  

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbloodtype Apple Docs }
 */
export enum HKBloodType {
    notSet = 0,
    aPositive = 1,
    aNegative = 2,
    bPositive = 3,
    bNegative = 4,
    abPositive = 5,
    abNegative = 6,
    oPositive = 7,
    oNegative = 8,
  }
  
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkbiologicalsex Apple Docs }
   */
  export enum HKBiologicalSex {
    notSet = 0,
    female = 1,
    male = 2,
    other = 3,
  }
  
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkfitzpatrickskintype Apple Docs }
   */
  export enum HKFitzpatrickSkinType {
    notSet = 0,
    I = 1,
    II = 2,
    III = 3,
    IV = 4,
    V = 5,
    VI = 6,
  }  
  

// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export enum HKWheelchairUse {
    notSet = 0,
    no = 1,
    yes = 2,
  }


export interface Characteristic extends HybridObject<{ ios: 'swift' }> {
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<string>;
  getBiologicalSex(): Promise<HKBiologicalSex>;
  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
 getWheelchairUse: () => Promise<HKWheelchairUse>;
}