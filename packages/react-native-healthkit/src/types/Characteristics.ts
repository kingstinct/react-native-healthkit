// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export type CharacteristicTypeIdentifier =
  | 'HKCharacteristicTypeIdentifierFitzpatrickSkinType'
  | 'HKCharacteristicTypeIdentifierBiologicalSex'
  | 'HKCharacteristicTypeIdentifierBloodType'
  | 'HKCharacteristicTypeIdentifierDateOfBirth'
  | 'HKCharacteristicTypeIdentifierWheelchairUse'
  | 'HKCharacteristicTypeIdentifierActivityMoveMode'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbloodtype Apple Docs }
 */
export enum BloodType {
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
export enum BiologicalSex {
  notSet = 0,
  female = 1,
  male = 2,
  other = 3,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfitzpatrickskintype Apple Docs }
 */
export enum FitzpatrickSkinType {
  notSet = 0,
  I = 1,
  II = 2,
  III = 3,
  IV = 4,
  V = 5,
  VI = 6,
}

// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export enum WheelchairUse {
  notSet = 0,
  notUsingWheelchair = 1,
  usingWheelchair = 2,
}
