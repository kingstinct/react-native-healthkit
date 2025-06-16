import type { CategoryTypeIdentifierWriteable } from '@kingstinct/react-native-healthkit/types/CategoryTypeIdentifier'
import type { CharacteristicTypeIdentifier } from '@kingstinct/react-native-healthkit/types/Characteristics'
import type { QuantityTypeIdentifierWriteable } from '@kingstinct/react-native-healthkit/types/QuantityTypeIdentifier'
import type {
  ObjectTypeIdentifier,
  SampleTypeIdentifierWriteable,
} from '@kingstinct/react-native-healthkit/types/Shared'

export const AllQuantityTypeIdentifierInApp: QuantityTypeIdentifierWriteable[] =
  [
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierDistanceCycling',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
    'HKQuantityTypeIdentifierBasalEnergyBurned',
    'HKQuantityTypeIdentifierFlightsClimbed',
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
    'HKQuantityTypeIdentifierBodyMass',
    'HKQuantityTypeIdentifierBloodGlucose',
    'HKQuantityTypeIdentifierOxygenSaturation',
    'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
    // 'HKQuantityTypeIdentifierAtrialFibrillationBurden',
    'HKQuantityTypeIdentifierBodyTemperature',
    'HKQuantityTypeIdentifierBasalBodyTemperature',
    'HKQuantityTypeIdentifierBodyFatPercentage',
    'HKQuantityTypeIdentifierLeanBodyMass',
    'HKQuantityTypeIdentifierDietaryEnergyConsumed',
    'HKQuantityTypeIdentifierDietaryFatTotal',
    'HKQuantityTypeIdentifierDietaryFatPolyunsaturated',
    'HKQuantityTypeIdentifierDietaryFatMonounsaturated',
    'HKQuantityTypeIdentifierDietaryFatSaturated',
    'HKQuantityTypeIdentifierDietaryCholesterol',
    'HKQuantityTypeIdentifierDietarySodium',
    'HKQuantityTypeIdentifierDietaryCarbohydrates',
    'HKQuantityTypeIdentifierDietaryFiber',
    'HKQuantityTypeIdentifierDietarySugar',
    'HKQuantityTypeIdentifierDietaryProtein',
    'HKQuantityTypeIdentifierDietaryVitaminA',
    'HKQuantityTypeIdentifierDietaryVitaminB6',
    'HKQuantityTypeIdentifierDietaryVitaminB12',
    'HKQuantityTypeIdentifierDietaryVitaminC',
    'HKQuantityTypeIdentifierDietaryVitaminD',
    'HKQuantityTypeIdentifierDietaryVitaminE',
    'HKQuantityTypeIdentifierDietaryVitaminK',
    'HKQuantityTypeIdentifierDietaryCalcium',
    'HKQuantityTypeIdentifierDietaryIron',
    'HKQuantityTypeIdentifierDietaryThiamin',
    'HKQuantityTypeIdentifierDietaryRiboflavin',
    'HKQuantityTypeIdentifierDietaryNiacin',
    'HKQuantityTypeIdentifierDietaryFolate',
    'HKQuantityTypeIdentifierDietaryBiotin',
    'HKQuantityTypeIdentifierDietaryPantothenicAcid',
    'HKQuantityTypeIdentifierDietaryPhosphorus',
    'HKQuantityTypeIdentifierDietaryIodine',
    'HKQuantityTypeIdentifierDietaryMagnesium',
    'HKQuantityTypeIdentifierDietaryZinc',
    'HKQuantityTypeIdentifierDietarySelenium',
    'HKQuantityTypeIdentifierDietaryCopper',
    'HKQuantityTypeIdentifierDietaryManganese',
    'HKQuantityTypeIdentifierDietaryChromium',
    'HKQuantityTypeIdentifierDietaryMolybdenum',
    'HKQuantityTypeIdentifierDietaryChloride',
    'HKQuantityTypeIdentifierDietaryPotassium',
    'HKQuantityTypeIdentifierDietaryCaffeine',
    'HKQuantityTypeIdentifierDietaryWater',
    'HKQuantityTypeIdentifierInsulinDelivery',
    'HKQuantityTypeIdentifierBloodPressureSystolic',
    'HKQuantityTypeIdentifierBloodPressureDiastolic',
    'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',

    // read-only:
    //'HKQuantityTypeIdentifierWalkingHeartRateAverage',
    // 'HKQuantityTypeIdentifierAppleExerciseTime',
    // 'HKQuantityTypeIdentifierAppleStandTime',
    // 'HKQuantityTypeIdentifierAppleWalkingSteadiness',
  ]

export const AllCategorySampleTypeIdentifierInApp: CategoryTypeIdentifierWriteable[] =
  [
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKCategoryTypeIdentifierSleepChanges',
    'HKCategoryTypeIdentifierMindfulSession',
    // read-only:
    // 'HKCategoryTypeIdentifierAppleStandHour',
    // 'HKCategoryTypeIdentifierLowHeartRateEvent',
    // 'HKCategoryTypeIdentifierHighHeartRateEvent',
    // 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
  ]

export const AllCharacteristicTypeIdentifierInApp: CharacteristicTypeIdentifier[] =
  [
    'HKCharacteristicTypeIdentifierBiologicalSex',
    'HKCharacteristicTypeIdentifierBloodType',
    'HKCharacteristicTypeIdentifierDateOfBirth',
    'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
    'HKCharacteristicTypeIdentifierWheelchairUse',
    'HKCharacteristicTypeIdentifierActivityMoveMode',
  ]

export const AllSampleTypesInApp: SampleTypeIdentifierWriteable[] = [
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  'HKDataTypeIdentifierHeartbeatSeries',
  // 'HKAudiogramSampleType',
  ...AllCategorySampleTypeIdentifierInApp,
  ...AllQuantityTypeIdentifierInApp,
  /*'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',
    'HKQuantityTypeIdentifierWalkingHeartRateAverage'*/
]

export const AllObjectTypesInApp: ObjectTypeIdentifier[] = [
  ...AllSampleTypesInApp,
  ...AllCharacteristicTypeIdentifierInApp,
  // 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  /*'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',
    'HKQuantityTypeIdentifierWalkingHeartRateAverage'*/
]
