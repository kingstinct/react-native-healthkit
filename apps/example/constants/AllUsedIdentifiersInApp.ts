import { CharacteristicTypeIdentifier } from "react-native-healthkit/types/Characteristics";
import { QuantityTypeIdentifier } from "react-native-healthkit/types/QuantityTypeIdentifier";
import { ObjectTypeIdentifier, SampleTypeIdentifier } from "react-native-healthkit/types/Shared";
import { HeartbeatSeriesTypeIdentifier } from "react-native-healthkit/types/Constants";
import { CategoryTypeIdentifier } from "react-native-healthkit/types/CategoryTypeIdentifier";

export const AllQuantityTypeIdentifierInApp: QuantityTypeIdentifier[] = [
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

export const AllCategorySampleTypeIdentifierInApp: CategoryTypeIdentifier[] = [
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKCategoryTypeIdentifierSleepChanges',
    'HKCategoryTypeIdentifierMindfulSession',
    // read-only:
    // 'HKCategoryTypeIdentifierAppleStandHour',
    // 'HKCategoryTypeIdentifierLowHeartRateEvent',
    // 'HKCategoryTypeIdentifierHighHeartRateEvent',
    // 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
]

export const AllCharacteristicTypeIdentifierInApp: CharacteristicTypeIdentifier[] = [
    'HKCharacteristicTypeIdentifierBiologicalSex',
    'HKCharacteristicTypeIdentifierBloodType',
    'HKCharacteristicTypeIdentifierDateOfBirth',
    'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
    'HKCharacteristicTypeIdentifierWheelchairUse',
    'HKCharacteristicTypeIdentifierActivityMoveMode'
]

export const AllSampleTypesInApp: SampleTypeIdentifier[] = [
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