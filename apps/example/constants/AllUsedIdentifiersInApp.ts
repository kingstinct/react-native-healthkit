import { SampleTypeIdentifier } from "react-native-healthkit/specs/Shared";
import { QuantityTypeIdentifier } from "react-native-healthkit/types/QuantityTypeIdentifier";

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

export const AllCharacteristicTypeIdentifierInApp: SampleTypeIdentifier[] = [
    'HKCharacteristicTypeIdentifierBiologicalSex',
    'HKCharacteristicTypeIdentifierBloodType',
    'HKCharacteristicTypeIdentifierDateOfBirth',
    'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
    'HKCharacteristicTypeIdentifierWheelchairUse',
]

export const AllUsedIdentifiersInApp: SampleTypeIdentifier[] = [
    'HKWorkoutTypeIdentifier',
    'HKWorkoutRouteTypeIdentifier',
    ...AllQuantityTypeIdentifierInApp,
    ...AllCharacteristicTypeIdentifierInApp
    /*'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierVO2Max',
    'HKQuantityTypeIdentifierWalkingHeartRateAverage'*/
]