
import { CharacteristicTypeIdentifier } from "react-native-healthkit/types/Characteristics";
import { QuantityTypeIdentifier } from "react-native-healthkit/types/QuantityTypeIdentifier";
import { ObjectTypeIdentifier, SampleTypeIdentifier } from "react-native-healthkit/types/Shared";

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
]

export const AllCharacteristicTypeIdentifierInApp: CharacteristicTypeIdentifier[] = [
    'HKCharacteristicTypeIdentifierBiologicalSex',
    'HKCharacteristicTypeIdentifierBloodType',
    'HKCharacteristicTypeIdentifierDateOfBirth',
    'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
    'HKCharacteristicTypeIdentifierWheelchairUse',
]

export const AllSampleTypesInApp: SampleTypeIdentifier[] = [
    'HKWorkoutTypeIdentifier',
    'HKWorkoutRouteTypeIdentifier',
    ...AllQuantityTypeIdentifierInApp,
    /*'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',
    'HKQuantityTypeIdentifierWalkingHeartRateAverage'*/
]

export const AllObjectTypesInApp: ObjectTypeIdentifier[] = [
    ...AllSampleTypesInApp,
    ...AllCharacteristicTypeIdentifierInApp
    /*'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',
    'HKQuantityTypeIdentifierWalkingHeartRateAverage'*/
]