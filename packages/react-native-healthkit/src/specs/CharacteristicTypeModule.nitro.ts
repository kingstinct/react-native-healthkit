import type { HybridObject } from 'react-native-nitro-modules'
import type {
  BiologicalSex,
  BloodType,
  FitzpatrickSkinType,
  WheelchairUse,
} from '../types/Characteristics'

export interface CharacteristicTypeModule
  extends HybridObject<{ ios: 'swift' }> {
  getBloodType(): BloodType
  getDateOfBirth(): Date | null
  getBiologicalSex(): BiologicalSex
  getFitzpatrickSkinType(): FitzpatrickSkinType
  getWheelchairUse(): WheelchairUse

  getBloodTypeAsync(): Promise<BloodType>
  getDateOfBirthAsync(): Promise<Date | null>
  getBiologicalSexAsync(): Promise<BiologicalSex>
  getFitzpatrickSkinTypeAsync(): Promise<FitzpatrickSkinType>
  getWheelchairUseAsync(): Promise<WheelchairUse>
}
