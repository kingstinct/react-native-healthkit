/*
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: scripts/generate-healthkit.ts
 */

import type { Quantity } from '../types/QuantityType'
import type {
  BloodGlucoseUnit,
  CountPerTime,
  EnergyUnit,
  LengthUnit,
  MassUnit,
  PressureUnit,
  SpeedUnit,
  TemperatureUnit,
  TimeUnit,
} from '../types/Units'
export type QuantityTypeIdentifierReadOnly =
  | 'HKQuantityTypeIdentifierAppleExerciseTime'
  | 'HKQuantityTypeIdentifierAppleStandTime'
  | 'HKQuantityTypeIdentifierAppleWalkingSteadiness'
  | 'HKQuantityTypeIdentifierAtrialFibrillationBurden'
  | 'HKQuantityTypeIdentifierWalkingHeartRateAverage'
export type QuantityTypeIdentifierWriteable =
  | 'HKQuantityTypeIdentifierActiveEnergyBurned'
  | 'HKQuantityTypeIdentifierAppleMoveTime'
  | 'HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances'
  | 'HKQuantityTypeIdentifierAppleSleepingWristTemperature'
  | 'HKQuantityTypeIdentifierBasalBodyTemperature'
  | 'HKQuantityTypeIdentifierBasalEnergyBurned'
  | 'HKQuantityTypeIdentifierBloodAlcoholContent'
  | 'HKQuantityTypeIdentifierBloodGlucose'
  | 'HKQuantityTypeIdentifierBloodPressureDiastolic'
  | 'HKQuantityTypeIdentifierBloodPressureSystolic'
  | 'HKQuantityTypeIdentifierBodyFatPercentage'
  | 'HKQuantityTypeIdentifierBodyMass'
  | 'HKQuantityTypeIdentifierBodyMassIndex'
  | 'HKQuantityTypeIdentifierBodyTemperature'
  | 'HKQuantityTypeIdentifierCrossCountrySkiingSpeed'
  | 'HKQuantityTypeIdentifierCyclingCadence'
  | 'HKQuantityTypeIdentifierCyclingFunctionalThresholdPower'
  | 'HKQuantityTypeIdentifierCyclingPower'
  | 'HKQuantityTypeIdentifierCyclingSpeed'
  | 'HKQuantityTypeIdentifierDietaryBiotin'
  | 'HKQuantityTypeIdentifierDietaryCaffeine'
  | 'HKQuantityTypeIdentifierDietaryCalcium'
  | 'HKQuantityTypeIdentifierDietaryCarbohydrates'
  | 'HKQuantityTypeIdentifierDietaryChloride'
  | 'HKQuantityTypeIdentifierDietaryCholesterol'
  | 'HKQuantityTypeIdentifierDietaryChromium'
  | 'HKQuantityTypeIdentifierDietaryCopper'
  | 'HKQuantityTypeIdentifierDietaryEnergyConsumed'
  | 'HKQuantityTypeIdentifierDietaryFatMonounsaturated'
  | 'HKQuantityTypeIdentifierDietaryFatPolyunsaturated'
  | 'HKQuantityTypeIdentifierDietaryFatSaturated'
  | 'HKQuantityTypeIdentifierDietaryFatTotal'
  | 'HKQuantityTypeIdentifierDietaryFiber'
  | 'HKQuantityTypeIdentifierDietaryFolate'
  | 'HKQuantityTypeIdentifierDietaryIodine'
  | 'HKQuantityTypeIdentifierDietaryIron'
  | 'HKQuantityTypeIdentifierDietaryMagnesium'
  | 'HKQuantityTypeIdentifierDietaryManganese'
  | 'HKQuantityTypeIdentifierDietaryMolybdenum'
  | 'HKQuantityTypeIdentifierDietaryNiacin'
  | 'HKQuantityTypeIdentifierDietaryPantothenicAcid'
  | 'HKQuantityTypeIdentifierDietaryPhosphorus'
  | 'HKQuantityTypeIdentifierDietaryPotassium'
  | 'HKQuantityTypeIdentifierDietaryProtein'
  | 'HKQuantityTypeIdentifierDietaryRiboflavin'
  | 'HKQuantityTypeIdentifierDietarySelenium'
  | 'HKQuantityTypeIdentifierDietarySodium'
  | 'HKQuantityTypeIdentifierDietarySugar'
  | 'HKQuantityTypeIdentifierDietaryThiamin'
  | 'HKQuantityTypeIdentifierDietaryVitaminA'
  | 'HKQuantityTypeIdentifierDietaryVitaminB12'
  | 'HKQuantityTypeIdentifierDietaryVitaminB6'
  | 'HKQuantityTypeIdentifierDietaryVitaminC'
  | 'HKQuantityTypeIdentifierDietaryVitaminD'
  | 'HKQuantityTypeIdentifierDietaryVitaminE'
  | 'HKQuantityTypeIdentifierDietaryVitaminK'
  | 'HKQuantityTypeIdentifierDietaryWater'
  | 'HKQuantityTypeIdentifierDietaryZinc'
  | 'HKQuantityTypeIdentifierDistanceCrossCountrySkiing'
  | 'HKQuantityTypeIdentifierDistanceCycling'
  | 'HKQuantityTypeIdentifierDistanceDownhillSnowSports'
  | 'HKQuantityTypeIdentifierDistancePaddleSports'
  | 'HKQuantityTypeIdentifierDistanceRowing'
  | 'HKQuantityTypeIdentifierDistanceSkatingSports'
  | 'HKQuantityTypeIdentifierDistanceSwimming'
  | 'HKQuantityTypeIdentifierDistanceWalkingRunning'
  | 'HKQuantityTypeIdentifierDistanceWheelchair'
  | 'HKQuantityTypeIdentifierElectrodermalActivity'
  | 'HKQuantityTypeIdentifierEnvironmentalAudioExposure'
  | 'HKQuantityTypeIdentifierEnvironmentalSoundReduction'
  | 'HKQuantityTypeIdentifierEstimatedWorkoutEffortScore'
  | 'HKQuantityTypeIdentifierFlightsClimbed'
  | 'HKQuantityTypeIdentifierForcedExpiratoryVolume1'
  | 'HKQuantityTypeIdentifierForcedVitalCapacity'
  | 'HKQuantityTypeIdentifierHeadphoneAudioExposure'
  | 'HKQuantityTypeIdentifierHeartRate'
  | 'HKQuantityTypeIdentifierHeartRateRecoveryOneMinute'
  | 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'
  | 'HKQuantityTypeIdentifierHeight'
  | 'HKQuantityTypeIdentifierInhalerUsage'
  | 'HKQuantityTypeIdentifierInsulinDelivery'
  | 'HKQuantityTypeIdentifierLeanBodyMass'
  | 'HKQuantityTypeIdentifierNikeFuel'
  | 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages'
  | 'HKQuantityTypeIdentifierNumberOfTimesFallen'
  | 'HKQuantityTypeIdentifierOxygenSaturation'
  | 'HKQuantityTypeIdentifierPaddleSportsSpeed'
  | 'HKQuantityTypeIdentifierPeakExpiratoryFlowRate'
  | 'HKQuantityTypeIdentifierPeripheralPerfusionIndex'
  | 'HKQuantityTypeIdentifierPhysicalEffort'
  | 'HKQuantityTypeIdentifierPushCount'
  | 'HKQuantityTypeIdentifierRespiratoryRate'
  | 'HKQuantityTypeIdentifierRestingHeartRate'
  | 'HKQuantityTypeIdentifierRowingSpeed'
  | 'HKQuantityTypeIdentifierRunningGroundContactTime'
  | 'HKQuantityTypeIdentifierRunningPower'
  | 'HKQuantityTypeIdentifierRunningSpeed'
  | 'HKQuantityTypeIdentifierRunningStrideLength'
  | 'HKQuantityTypeIdentifierRunningVerticalOscillation'
  | 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance'
  | 'HKQuantityTypeIdentifierStairAscentSpeed'
  | 'HKQuantityTypeIdentifierStairDescentSpeed'
  | 'HKQuantityTypeIdentifierStepCount'
  | 'HKQuantityTypeIdentifierSwimmingStrokeCount'
  | 'HKQuantityTypeIdentifierTimeInDaylight'
  | 'HKQuantityTypeIdentifierUnderwaterDepth'
  | 'HKQuantityTypeIdentifierUVExposure'
  | 'HKQuantityTypeIdentifierVO2Max'
  | 'HKQuantityTypeIdentifierWaistCircumference'
  | 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage'
  | 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage'
  | 'HKQuantityTypeIdentifierWalkingSpeed'
  | 'HKQuantityTypeIdentifierWalkingStepLength'
  | 'HKQuantityTypeIdentifierWaterTemperature'
  | 'HKQuantityTypeIdentifierWorkoutEffortScore'
export type QuantityTypeIdentifier =
  | QuantityTypeIdentifierReadOnly
  | QuantityTypeIdentifierWriteable
export type CategoryTypeIdentifierReadOnly =
  | 'HKCategoryTypeIdentifierAppleStandHour'
  | 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent'
  | 'HKCategoryTypeIdentifierHighHeartRateEvent'
  | 'HKCategoryTypeIdentifierHypertensionEvent'
  | 'HKCategoryTypeIdentifierLowHeartRateEvent'
export type CategoryTypeIdentifierWriteable =
  | 'HKCategoryTypeIdentifierAbdominalCramps'
  | 'HKCategoryTypeIdentifierAcne'
  | 'HKCategoryTypeIdentifierAppetiteChanges'
  | 'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent'
  | 'HKCategoryTypeIdentifierAudioExposureEvent'
  | 'HKCategoryTypeIdentifierBladderIncontinence'
  | 'HKCategoryTypeIdentifierBleedingAfterPregnancy'
  | 'HKCategoryTypeIdentifierBleedingDuringPregnancy'
  | 'HKCategoryTypeIdentifierBloating'
  | 'HKCategoryTypeIdentifierBreastPain'
  | 'HKCategoryTypeIdentifierCervicalMucusQuality'
  | 'HKCategoryTypeIdentifierChestTightnessOrPain'
  | 'HKCategoryTypeIdentifierChills'
  | 'HKCategoryTypeIdentifierConstipation'
  | 'HKCategoryTypeIdentifierContraceptive'
  | 'HKCategoryTypeIdentifierCoughing'
  | 'HKCategoryTypeIdentifierDiarrhea'
  | 'HKCategoryTypeIdentifierDizziness'
  | 'HKCategoryTypeIdentifierDrySkin'
  | 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent'
  | 'HKCategoryTypeIdentifierFainting'
  | 'HKCategoryTypeIdentifierFatigue'
  | 'HKCategoryTypeIdentifierFever'
  | 'HKCategoryTypeIdentifierGeneralizedBodyAche'
  | 'HKCategoryTypeIdentifierHairLoss'
  | 'HKCategoryTypeIdentifierHandwashingEvent'
  | 'HKCategoryTypeIdentifierHeadache'
  | 'HKCategoryTypeIdentifierHeartburn'
  | 'HKCategoryTypeIdentifierHotFlashes'
  | 'HKCategoryTypeIdentifierInfrequentMenstrualCycles'
  | 'HKCategoryTypeIdentifierIntermenstrualBleeding'
  | 'HKCategoryTypeIdentifierIrregularHeartRhythmEvent'
  | 'HKCategoryTypeIdentifierIrregularMenstrualCycles'
  | 'HKCategoryTypeIdentifierLactation'
  | 'HKCategoryTypeIdentifierLossOfSmell'
  | 'HKCategoryTypeIdentifierLossOfTaste'
  | 'HKCategoryTypeIdentifierLowCardioFitnessEvent'
  | 'HKCategoryTypeIdentifierLowerBackPain'
  | 'HKCategoryTypeIdentifierMemoryLapse'
  | 'HKCategoryTypeIdentifierMenstrualFlow'
  | 'HKCategoryTypeIdentifierMindfulSession'
  | 'HKCategoryTypeIdentifierMoodChanges'
  | 'HKCategoryTypeIdentifierNausea'
  | 'HKCategoryTypeIdentifierNightSweats'
  | 'HKCategoryTypeIdentifierOvulationTestResult'
  | 'HKCategoryTypeIdentifierPelvicPain'
  | 'HKCategoryTypeIdentifierPersistentIntermenstrualBleeding'
  | 'HKCategoryTypeIdentifierPregnancy'
  | 'HKCategoryTypeIdentifierPregnancyTestResult'
  | 'HKCategoryTypeIdentifierProgesteroneTestResult'
  | 'HKCategoryTypeIdentifierProlongedMenstrualPeriods'
  | 'HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat'
  | 'HKCategoryTypeIdentifierRunnyNose'
  | 'HKCategoryTypeIdentifierSexualActivity'
  | 'HKCategoryTypeIdentifierShortnessOfBreath'
  | 'HKCategoryTypeIdentifierSinusCongestion'
  | 'HKCategoryTypeIdentifierSkippedHeartbeat'
  | 'HKCategoryTypeIdentifierSleepAnalysis'
  | 'HKCategoryTypeIdentifierSleepApneaEvent'
  | 'HKCategoryTypeIdentifierSleepChanges'
  | 'HKCategoryTypeIdentifierSoreThroat'
  | 'HKCategoryTypeIdentifierToothbrushingEvent'
  | 'HKCategoryTypeIdentifierVaginalDryness'
  | 'HKCategoryTypeIdentifierVomiting'
  | 'HKCategoryTypeIdentifierWheezing'
export type CategoryTypeIdentifier =
  | CategoryTypeIdentifierReadOnly
  | CategoryTypeIdentifierWriteable
export const QUANTITY_IDENTIFIER_IOS_AVAILABILITY = {
  HKQuantityTypeIdentifierActiveEnergyBurned: '8.0',
  HKQuantityTypeIdentifierAppleExerciseTime: '9.3',
  HKQuantityTypeIdentifierAppleMoveTime: '14.5',
  HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances: '18.0',
  HKQuantityTypeIdentifierAppleSleepingWristTemperature: '16.0',
  HKQuantityTypeIdentifierAppleStandTime: '13.0',
  HKQuantityTypeIdentifierAppleWalkingSteadiness: '15.0',
  HKQuantityTypeIdentifierAtrialFibrillationBurden: '16.0',
  HKQuantityTypeIdentifierBasalBodyTemperature: '9.0',
  HKQuantityTypeIdentifierBasalEnergyBurned: '8.0',
  HKQuantityTypeIdentifierBloodAlcoholContent: '8.0',
  HKQuantityTypeIdentifierBloodGlucose: '8.0',
  HKQuantityTypeIdentifierBloodPressureDiastolic: '8.0',
  HKQuantityTypeIdentifierBloodPressureSystolic: '8.0',
  HKQuantityTypeIdentifierBodyFatPercentage: '8.0',
  HKQuantityTypeIdentifierBodyMass: '8.0',
  HKQuantityTypeIdentifierBodyMassIndex: '8.0',
  HKQuantityTypeIdentifierBodyTemperature: '8.0',
  HKQuantityTypeIdentifierCrossCountrySkiingSpeed: '18.0',
  HKQuantityTypeIdentifierCyclingCadence: '17.0',
  HKQuantityTypeIdentifierCyclingFunctionalThresholdPower: '17.0',
  HKQuantityTypeIdentifierCyclingPower: '17.0',
  HKQuantityTypeIdentifierCyclingSpeed: '17.0',
  HKQuantityTypeIdentifierDietaryBiotin: '8.0',
  HKQuantityTypeIdentifierDietaryCaffeine: '8.0',
  HKQuantityTypeIdentifierDietaryCalcium: '8.0',
  HKQuantityTypeIdentifierDietaryCarbohydrates: '8.0',
  HKQuantityTypeIdentifierDietaryChloride: '8.0',
  HKQuantityTypeIdentifierDietaryCholesterol: '8.0',
  HKQuantityTypeIdentifierDietaryChromium: '8.0',
  HKQuantityTypeIdentifierDietaryCopper: '8.0',
  HKQuantityTypeIdentifierDietaryEnergyConsumed: '8.0',
  HKQuantityTypeIdentifierDietaryFatMonounsaturated: '8.0',
  HKQuantityTypeIdentifierDietaryFatPolyunsaturated: '8.0',
  HKQuantityTypeIdentifierDietaryFatSaturated: '8.0',
  HKQuantityTypeIdentifierDietaryFatTotal: '8.0',
  HKQuantityTypeIdentifierDietaryFiber: '8.0',
  HKQuantityTypeIdentifierDietaryFolate: '8.0',
  HKQuantityTypeIdentifierDietaryIodine: '8.0',
  HKQuantityTypeIdentifierDietaryIron: '8.0',
  HKQuantityTypeIdentifierDietaryMagnesium: '8.0',
  HKQuantityTypeIdentifierDietaryManganese: '8.0',
  HKQuantityTypeIdentifierDietaryMolybdenum: '8.0',
  HKQuantityTypeIdentifierDietaryNiacin: '8.0',
  HKQuantityTypeIdentifierDietaryPantothenicAcid: '8.0',
  HKQuantityTypeIdentifierDietaryPhosphorus: '8.0',
  HKQuantityTypeIdentifierDietaryPotassium: '8.0',
  HKQuantityTypeIdentifierDietaryProtein: '8.0',
  HKQuantityTypeIdentifierDietaryRiboflavin: '8.0',
  HKQuantityTypeIdentifierDietarySelenium: '8.0',
  HKQuantityTypeIdentifierDietarySodium: '8.0',
  HKQuantityTypeIdentifierDietarySugar: '8.0',
  HKQuantityTypeIdentifierDietaryThiamin: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminA: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminB12: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminB6: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminC: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminD: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminE: '8.0',
  HKQuantityTypeIdentifierDietaryVitaminK: '8.0',
  HKQuantityTypeIdentifierDietaryWater: '9.0',
  HKQuantityTypeIdentifierDietaryZinc: '8.0',
  HKQuantityTypeIdentifierDistanceCrossCountrySkiing: '18.0',
  HKQuantityTypeIdentifierDistanceCycling: '8.0',
  HKQuantityTypeIdentifierDistanceDownhillSnowSports: '11.2',
  HKQuantityTypeIdentifierDistancePaddleSports: '18.0',
  HKQuantityTypeIdentifierDistanceRowing: '18.0',
  HKQuantityTypeIdentifierDistanceSkatingSports: '18.0',
  HKQuantityTypeIdentifierDistanceSwimming: '10.0',
  HKQuantityTypeIdentifierDistanceWalkingRunning: '8.0',
  HKQuantityTypeIdentifierDistanceWheelchair: '10.0',
  HKQuantityTypeIdentifierElectrodermalActivity: '8.0',
  HKQuantityTypeIdentifierEnvironmentalAudioExposure: '13.0',
  HKQuantityTypeIdentifierEnvironmentalSoundReduction: '16.0',
  HKQuantityTypeIdentifierEstimatedWorkoutEffortScore: '18.0',
  HKQuantityTypeIdentifierFlightsClimbed: '8.0',
  HKQuantityTypeIdentifierForcedExpiratoryVolume1: '8.0',
  HKQuantityTypeIdentifierForcedVitalCapacity: '8.0',
  HKQuantityTypeIdentifierHeadphoneAudioExposure: '13.0',
  HKQuantityTypeIdentifierHeartRate: '8.0',
  HKQuantityTypeIdentifierHeartRateRecoveryOneMinute: '16.0',
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: '11.0',
  HKQuantityTypeIdentifierHeight: '8.0',
  HKQuantityTypeIdentifierInhalerUsage: '8.0',
  HKQuantityTypeIdentifierInsulinDelivery: '11.0',
  HKQuantityTypeIdentifierLeanBodyMass: '8.0',
  HKQuantityTypeIdentifierNikeFuel: '8.0',
  HKQuantityTypeIdentifierNumberOfAlcoholicBeverages: '15.0',
  HKQuantityTypeIdentifierNumberOfTimesFallen: '8.0',
  HKQuantityTypeIdentifierOxygenSaturation: '8.0',
  HKQuantityTypeIdentifierPaddleSportsSpeed: '18.0',
  HKQuantityTypeIdentifierPeakExpiratoryFlowRate: '8.0',
  HKQuantityTypeIdentifierPeripheralPerfusionIndex: '8.0',
  HKQuantityTypeIdentifierPhysicalEffort: '17.0',
  HKQuantityTypeIdentifierPushCount: '10.0',
  HKQuantityTypeIdentifierRespiratoryRate: '8.0',
  HKQuantityTypeIdentifierRestingHeartRate: '11.0',
  HKQuantityTypeIdentifierRowingSpeed: '18.0',
  HKQuantityTypeIdentifierRunningGroundContactTime: '16.0',
  HKQuantityTypeIdentifierRunningPower: '16.0',
  HKQuantityTypeIdentifierRunningSpeed: '16.0',
  HKQuantityTypeIdentifierRunningStrideLength: '16.0',
  HKQuantityTypeIdentifierRunningVerticalOscillation: '16.0',
  HKQuantityTypeIdentifierSixMinuteWalkTestDistance: '14.0',
  HKQuantityTypeIdentifierStairAscentSpeed: '14.0',
  HKQuantityTypeIdentifierStairDescentSpeed: '14.0',
  HKQuantityTypeIdentifierStepCount: '8.0',
  HKQuantityTypeIdentifierSwimmingStrokeCount: '10.0',
  HKQuantityTypeIdentifierTimeInDaylight: '17.0',
  HKQuantityTypeIdentifierUnderwaterDepth: '16.0',
  HKQuantityTypeIdentifierUVExposure: '9.0',
  HKQuantityTypeIdentifierVO2Max: '11.0',
  HKQuantityTypeIdentifierWaistCircumference: '11.0',
  HKQuantityTypeIdentifierWalkingAsymmetryPercentage: '14.0',
  HKQuantityTypeIdentifierWalkingDoubleSupportPercentage: '14.0',
  HKQuantityTypeIdentifierWalkingHeartRateAverage: '11.0',
  HKQuantityTypeIdentifierWalkingSpeed: '14.0',
  HKQuantityTypeIdentifierWalkingStepLength: '14.0',
  HKQuantityTypeIdentifierWaterTemperature: '16.0',
  HKQuantityTypeIdentifierWorkoutEffortScore: '18.0',
} as const
export const CATEGORY_IDENTIFIER_IOS_AVAILABILITY = {
  HKCategoryTypeIdentifierAbdominalCramps: '13.6',
  HKCategoryTypeIdentifierAcne: '13.6',
  HKCategoryTypeIdentifierAppetiteChanges: '13.6',
  HKCategoryTypeIdentifierAppleStandHour: '9.0',
  HKCategoryTypeIdentifierAppleWalkingSteadinessEvent: '15.0',
  HKCategoryTypeIdentifierAudioExposureEvent: '13.0',
  HKCategoryTypeIdentifierBladderIncontinence: '14.0',
  HKCategoryTypeIdentifierBleedingAfterPregnancy: '18.0',
  HKCategoryTypeIdentifierBleedingDuringPregnancy: '18.0',
  HKCategoryTypeIdentifierBloating: '13.6',
  HKCategoryTypeIdentifierBreastPain: '13.6',
  HKCategoryTypeIdentifierCervicalMucusQuality: '9.0',
  HKCategoryTypeIdentifierChestTightnessOrPain: '13.6',
  HKCategoryTypeIdentifierChills: '13.6',
  HKCategoryTypeIdentifierConstipation: '13.6',
  HKCategoryTypeIdentifierContraceptive: '14.3',
  HKCategoryTypeIdentifierCoughing: '13.6',
  HKCategoryTypeIdentifierDiarrhea: '13.6',
  HKCategoryTypeIdentifierDizziness: '13.6',
  HKCategoryTypeIdentifierDrySkin: '14.0',
  HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent: '14.0',
  HKCategoryTypeIdentifierFainting: '13.6',
  HKCategoryTypeIdentifierFatigue: '13.6',
  HKCategoryTypeIdentifierFever: '13.6',
  HKCategoryTypeIdentifierGeneralizedBodyAche: '13.6',
  HKCategoryTypeIdentifierHairLoss: '14.0',
  HKCategoryTypeIdentifierHandwashingEvent: '14.0',
  HKCategoryTypeIdentifierHeadache: '13.6',
  HKCategoryTypeIdentifierHeadphoneAudioExposureEvent: '14.2',
  HKCategoryTypeIdentifierHeartburn: '13.6',
  HKCategoryTypeIdentifierHighHeartRateEvent: '12.2',
  HKCategoryTypeIdentifierHotFlashes: '13.6',
  HKCategoryTypeIdentifierHypertensionEvent: '26.2',
  HKCategoryTypeIdentifierInfrequentMenstrualCycles: '16.0',
  HKCategoryTypeIdentifierIntermenstrualBleeding: '9.0',
  HKCategoryTypeIdentifierIrregularHeartRhythmEvent: '12.2',
  HKCategoryTypeIdentifierIrregularMenstrualCycles: '16.0',
  HKCategoryTypeIdentifierLactation: '14.3',
  HKCategoryTypeIdentifierLossOfSmell: '13.6',
  HKCategoryTypeIdentifierLossOfTaste: '13.6',
  HKCategoryTypeIdentifierLowCardioFitnessEvent: '14.3',
  HKCategoryTypeIdentifierLowerBackPain: '13.6',
  HKCategoryTypeIdentifierLowHeartRateEvent: '12.2',
  HKCategoryTypeIdentifierMemoryLapse: '14.0',
  HKCategoryTypeIdentifierMenstrualFlow: '9.0',
  HKCategoryTypeIdentifierMindfulSession: '10.0',
  HKCategoryTypeIdentifierMoodChanges: '13.6',
  HKCategoryTypeIdentifierNausea: '13.6',
  HKCategoryTypeIdentifierNightSweats: '14.0',
  HKCategoryTypeIdentifierOvulationTestResult: '9.0',
  HKCategoryTypeIdentifierPelvicPain: '13.6',
  HKCategoryTypeIdentifierPersistentIntermenstrualBleeding: '16.0',
  HKCategoryTypeIdentifierPregnancy: '14.3',
  HKCategoryTypeIdentifierPregnancyTestResult: '15.0',
  HKCategoryTypeIdentifierProgesteroneTestResult: '15.0',
  HKCategoryTypeIdentifierProlongedMenstrualPeriods: '16.0',
  HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat: '13.6',
  HKCategoryTypeIdentifierRunnyNose: '13.6',
  HKCategoryTypeIdentifierSexualActivity: '9.0',
  HKCategoryTypeIdentifierShortnessOfBreath: '13.6',
  HKCategoryTypeIdentifierSinusCongestion: '13.6',
  HKCategoryTypeIdentifierSkippedHeartbeat: '13.6',
  HKCategoryTypeIdentifierSleepAnalysis: '8.0',
  HKCategoryTypeIdentifierSleepApneaEvent: '18.0',
  HKCategoryTypeIdentifierSleepChanges: '13.6',
  HKCategoryTypeIdentifierSoreThroat: '13.6',
  HKCategoryTypeIdentifierToothbrushingEvent: '13.0',
  HKCategoryTypeIdentifierVaginalDryness: '14.0',
  HKCategoryTypeIdentifierVomiting: '13.6',
  HKCategoryTypeIdentifierWheezing: '13.6',
} as const
export const QUANTITY_IDENTIFIER_CANONICAL_UNITS = {
  HKQuantityTypeIdentifierActiveEnergyBurned: 'kcal',
  HKQuantityTypeIdentifierAppleExerciseTime: 'min',
  HKQuantityTypeIdentifierAppleMoveTime: 'min',
  HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances: 'count',
  HKQuantityTypeIdentifierAppleSleepingWristTemperature: 'degC',
  HKQuantityTypeIdentifierAppleStandTime: 'min',
  HKQuantityTypeIdentifierAppleWalkingSteadiness: '%',
  HKQuantityTypeIdentifierAtrialFibrillationBurden: '%',
  HKQuantityTypeIdentifierBasalBodyTemperature: 'degC',
  HKQuantityTypeIdentifierBasalEnergyBurned: 'kcal',
  HKQuantityTypeIdentifierBloodAlcoholContent: '%',
  HKQuantityTypeIdentifierBloodGlucose: 'mg/dL',
  HKQuantityTypeIdentifierBloodPressureDiastolic: 'mmHg',
  HKQuantityTypeIdentifierBloodPressureSystolic: 'mmHg',
  HKQuantityTypeIdentifierBodyFatPercentage: '%',
  HKQuantityTypeIdentifierBodyMass: 'kg',
  HKQuantityTypeIdentifierBodyMassIndex: 'count',
  HKQuantityTypeIdentifierBodyTemperature: 'degC',
  HKQuantityTypeIdentifierCrossCountrySkiingSpeed: 'm/s',
  HKQuantityTypeIdentifierCyclingCadence: 'count/min',
  HKQuantityTypeIdentifierCyclingFunctionalThresholdPower: 'W',
  HKQuantityTypeIdentifierCyclingPower: 'W',
  HKQuantityTypeIdentifierCyclingSpeed: 'm/s',
  HKQuantityTypeIdentifierDietaryBiotin: 'g',
  HKQuantityTypeIdentifierDietaryCaffeine: 'g',
  HKQuantityTypeIdentifierDietaryCalcium: 'g',
  HKQuantityTypeIdentifierDietaryCarbohydrates: 'g',
  HKQuantityTypeIdentifierDietaryChloride: 'g',
  HKQuantityTypeIdentifierDietaryCholesterol: 'g',
  HKQuantityTypeIdentifierDietaryChromium: 'g',
  HKQuantityTypeIdentifierDietaryCopper: 'g',
  HKQuantityTypeIdentifierDietaryEnergyConsumed: 'kcal',
  HKQuantityTypeIdentifierDietaryFatMonounsaturated: 'g',
  HKQuantityTypeIdentifierDietaryFatPolyunsaturated: 'g',
  HKQuantityTypeIdentifierDietaryFatSaturated: 'g',
  HKQuantityTypeIdentifierDietaryFatTotal: 'g',
  HKQuantityTypeIdentifierDietaryFiber: 'g',
  HKQuantityTypeIdentifierDietaryFolate: 'g',
  HKQuantityTypeIdentifierDietaryIodine: 'g',
  HKQuantityTypeIdentifierDietaryIron: 'g',
  HKQuantityTypeIdentifierDietaryMagnesium: 'g',
  HKQuantityTypeIdentifierDietaryManganese: 'g',
  HKQuantityTypeIdentifierDietaryMolybdenum: 'g',
  HKQuantityTypeIdentifierDietaryNiacin: 'g',
  HKQuantityTypeIdentifierDietaryPantothenicAcid: 'g',
  HKQuantityTypeIdentifierDietaryPhosphorus: 'g',
  HKQuantityTypeIdentifierDietaryPotassium: 'g',
  HKQuantityTypeIdentifierDietaryProtein: 'g',
  HKQuantityTypeIdentifierDietaryRiboflavin: 'g',
  HKQuantityTypeIdentifierDietarySelenium: 'g',
  HKQuantityTypeIdentifierDietarySodium: 'g',
  HKQuantityTypeIdentifierDietarySugar: 'g',
  HKQuantityTypeIdentifierDietaryThiamin: 'g',
  HKQuantityTypeIdentifierDietaryVitaminA: 'g',
  HKQuantityTypeIdentifierDietaryVitaminB12: 'g',
  HKQuantityTypeIdentifierDietaryVitaminB6: 'g',
  HKQuantityTypeIdentifierDietaryVitaminC: 'g',
  HKQuantityTypeIdentifierDietaryVitaminD: 'g',
  HKQuantityTypeIdentifierDietaryVitaminE: 'g',
  HKQuantityTypeIdentifierDietaryVitaminK: 'g',
  HKQuantityTypeIdentifierDietaryWater: 'mL',
  HKQuantityTypeIdentifierDietaryZinc: 'g',
  HKQuantityTypeIdentifierDistanceCrossCountrySkiing: 'm',
  HKQuantityTypeIdentifierDistanceCycling: 'm',
  HKQuantityTypeIdentifierDistanceDownhillSnowSports: 'm',
  HKQuantityTypeIdentifierDistancePaddleSports: 'm',
  HKQuantityTypeIdentifierDistanceRowing: 'm',
  HKQuantityTypeIdentifierDistanceSkatingSports: 'm',
  HKQuantityTypeIdentifierDistanceSwimming: 'm',
  HKQuantityTypeIdentifierDistanceWalkingRunning: 'm',
  HKQuantityTypeIdentifierDistanceWheelchair: 'm',
  HKQuantityTypeIdentifierElectrodermalActivity: 'S',
  HKQuantityTypeIdentifierEnvironmentalAudioExposure: 'dBASPL',
  HKQuantityTypeIdentifierEnvironmentalSoundReduction: 'dBASPL',
  HKQuantityTypeIdentifierEstimatedWorkoutEffortScore: 'appleEffortScore',
  HKQuantityTypeIdentifierFlightsClimbed: 'count',
  HKQuantityTypeIdentifierForcedExpiratoryVolume1: 'L',
  HKQuantityTypeIdentifierForcedVitalCapacity: 'L',
  HKQuantityTypeIdentifierHeadphoneAudioExposure: 'dBASPL',
  HKQuantityTypeIdentifierHeartRate: 'count/s',
  HKQuantityTypeIdentifierHeartRateRecoveryOneMinute: 'count/min',
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: 'ms',
  HKQuantityTypeIdentifierHeight: 'm',
  HKQuantityTypeIdentifierInhalerUsage: 'count',
  HKQuantityTypeIdentifierInsulinDelivery: 'IU',
  HKQuantityTypeIdentifierLeanBodyMass: 'kg',
  HKQuantityTypeIdentifierNikeFuel: 'count',
  HKQuantityTypeIdentifierNumberOfAlcoholicBeverages: 'count',
  HKQuantityTypeIdentifierNumberOfTimesFallen: 'count',
  HKQuantityTypeIdentifierOxygenSaturation: '%',
  HKQuantityTypeIdentifierPaddleSportsSpeed: 'm/s',
  HKQuantityTypeIdentifierPeakExpiratoryFlowRate: 'L/min',
  HKQuantityTypeIdentifierPeripheralPerfusionIndex: '%',
  HKQuantityTypeIdentifierPhysicalEffort: 'kcal/(kg*hr)',
  HKQuantityTypeIdentifierPushCount: 'count',
  HKQuantityTypeIdentifierRespiratoryRate: 'count/s',
  HKQuantityTypeIdentifierRestingHeartRate: 'count/min',
  HKQuantityTypeIdentifierRowingSpeed: 'm/s',
  HKQuantityTypeIdentifierRunningGroundContactTime: 'ms',
  HKQuantityTypeIdentifierRunningPower: 'W',
  HKQuantityTypeIdentifierRunningSpeed: 'm/s',
  HKQuantityTypeIdentifierRunningStrideLength: 'm',
  HKQuantityTypeIdentifierRunningVerticalOscillation: 'cm',
  HKQuantityTypeIdentifierSixMinuteWalkTestDistance: 'm',
  HKQuantityTypeIdentifierStairAscentSpeed: 'm/s',
  HKQuantityTypeIdentifierStairDescentSpeed: 'm/s',
  HKQuantityTypeIdentifierStepCount: 'count',
  HKQuantityTypeIdentifierSwimmingStrokeCount: 'count',
  HKQuantityTypeIdentifierTimeInDaylight: 'min',
  HKQuantityTypeIdentifierUnderwaterDepth: 'm',
  HKQuantityTypeIdentifierUVExposure: null,
  HKQuantityTypeIdentifierVO2Max: 'ml/(kg*min)',
  HKQuantityTypeIdentifierWaistCircumference: 'm',
  HKQuantityTypeIdentifierWalkingAsymmetryPercentage: '%',
  HKQuantityTypeIdentifierWalkingDoubleSupportPercentage: '%',
  HKQuantityTypeIdentifierWalkingHeartRateAverage: 'count/min',
  HKQuantityTypeIdentifierWalkingSpeed: 'm/s',
  HKQuantityTypeIdentifierWalkingStepLength: 'm',
  HKQuantityTypeIdentifierWaterTemperature: 'degC',
  HKQuantityTypeIdentifierWorkoutEffortScore: 'appleEffortScore',
} as const
export const CATEGORY_IDENTIFIER_VALUE_ENUMS = {
  HKCategoryTypeIdentifierAbdominalCramps: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierAcne: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierAppetiteChanges: 'CategoryValueAppetiteChanges',
  HKCategoryTypeIdentifierAppleStandHour: 'CategoryValueAppleStandHour',
  HKCategoryTypeIdentifierAppleWalkingSteadinessEvent:
    'CategoryValueAppleWalkingSteadinessEvent',
  HKCategoryTypeIdentifierAudioExposureEvent: null,
  HKCategoryTypeIdentifierBladderIncontinence: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierBleedingAfterPregnancy:
    'CategoryValueVaginalBleeding',
  HKCategoryTypeIdentifierBleedingDuringPregnancy:
    'CategoryValueVaginalBleeding',
  HKCategoryTypeIdentifierBloating: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierBreastPain: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierCervicalMucusQuality:
    'CategoryValueCervicalMucusQuality',
  HKCategoryTypeIdentifierChestTightnessOrPain: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierChills: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierConstipation: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierContraceptive: 'CategoryValueContraceptive',
  HKCategoryTypeIdentifierCoughing: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierDiarrhea: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierDizziness: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierDrySkin: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent:
    'CategoryValueEnvironmentalAudioExposureEvent',
  HKCategoryTypeIdentifierFainting: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierFatigue: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierFever: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierGeneralizedBodyAche: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierHairLoss: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierHandwashingEvent: 'CategoryValue',
  HKCategoryTypeIdentifierHeadache: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierHeadphoneAudioExposureEvent:
    'CategoryValueHeadphoneAudioExposureEvent',
  HKCategoryTypeIdentifierHeartburn: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierHighHeartRateEvent: 'CategoryValue',
  HKCategoryTypeIdentifierHotFlashes: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierHypertensionEvent: 'CategoryValue',
  HKCategoryTypeIdentifierInfrequentMenstrualCycles: 'CategoryValue',
  HKCategoryTypeIdentifierIntermenstrualBleeding: 'CategoryValue',
  HKCategoryTypeIdentifierIrregularHeartRhythmEvent: 'CategoryValue',
  HKCategoryTypeIdentifierIrregularMenstrualCycles: 'CategoryValue',
  HKCategoryTypeIdentifierLactation: 'CategoryValue',
  HKCategoryTypeIdentifierLossOfSmell: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierLossOfTaste: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierLowCardioFitnessEvent:
    'CategoryValueLowCardioFitnessEvent',
  HKCategoryTypeIdentifierLowerBackPain: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierLowHeartRateEvent: 'CategoryValue',
  HKCategoryTypeIdentifierMemoryLapse: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierMenstrualFlow: 'CategoryValueMenstrualFlow',
  HKCategoryTypeIdentifierMindfulSession: 'CategoryValue',
  HKCategoryTypeIdentifierMoodChanges: 'CategoryValuePresence',
  HKCategoryTypeIdentifierNausea: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierNightSweats: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierOvulationTestResult:
    'CategoryValueOvulationTestResult',
  HKCategoryTypeIdentifierPelvicPain: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierPersistentIntermenstrualBleeding: 'CategoryValue',
  HKCategoryTypeIdentifierPregnancy: 'CategoryValue',
  HKCategoryTypeIdentifierPregnancyTestResult:
    'CategoryValuePregnancyTestResult',
  HKCategoryTypeIdentifierProgesteroneTestResult:
    'CategoryValueProgesteroneTestResult',
  HKCategoryTypeIdentifierProlongedMenstrualPeriods: 'CategoryValue',
  HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat:
    'CategoryValueSeverity',
  HKCategoryTypeIdentifierRunnyNose: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierSexualActivity: 'CategoryValue',
  HKCategoryTypeIdentifierShortnessOfBreath: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierSinusCongestion: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierSkippedHeartbeat: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierSleepAnalysis: 'CategoryValueSleepAnalysis',
  HKCategoryTypeIdentifierSleepApneaEvent: 'CategoryValue',
  HKCategoryTypeIdentifierSleepChanges: 'CategoryValuePresence',
  HKCategoryTypeIdentifierSoreThroat: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierToothbrushingEvent: 'CategoryValue',
  HKCategoryTypeIdentifierVaginalDryness: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierVomiting: 'CategoryValueSeverity',
  HKCategoryTypeIdentifierWheezing: 'CategoryValueSeverity',
} as const
export enum AppleECGAlgorithmVersion {
  value1 = 1,
  value2 = 2,
}
export enum BloodGlucoseMealTime {
  preprandial = 1,
  postprandial = 2,
}
export enum BodyTemperatureSensorLocation {
  other = 0,
  armpit = 1,
  body = 2,
  ear = 3,
  finger = 4,
  gastroIntestinal = 5,
  mouth = 6,
  rectum = 7,
  toe = 8,
  earDrum = 9,
  temporalArtery = 10,
  forehead = 11,
}
export enum CategoryValue {
  notApplicable = 0,
}
export enum CategoryValueAppetiteChanges {
  unspecified = 0,
  noChange = 1,
  decreased = 2,
  increased = 3,
}
export enum CategoryValueAppleStandHour {
  stood = 0,
  idle = 1,
}
export enum CategoryValueAppleWalkingSteadinessEvent {
  initialLow = 1,
  initialVeryLow = 2,
  repeatLow = 3,
  repeatVeryLow = 4,
}
export enum CategoryValueAudioExposureEvent {
  loudEnvironment = 1,
}
export enum CategoryValueCervicalMucusQuality {
  dry = 1,
  sticky = 2,
  creamy = 3,
  watery = 4,
  eggWhite = 5,
}
export enum CategoryValueContraceptive {
  unspecified = 1,
  implant = 2,
  injection = 3,
  intrauterineDevice = 4,
  intravaginalRing = 5,
  oral = 6,
  patch = 7,
}
export enum CategoryValueEnvironmentalAudioExposureEvent {
  momentaryLimit = 1,
}
export enum CategoryValueHeadphoneAudioExposureEvent {
  sevenDayLimit = 1,
}
export enum CategoryValueLowCardioFitnessEvent {
  lowFitness = 1,
}
export enum CategoryValueMenstrualFlow {
  unspecified = 1,
  light = 2,
  medium = 3,
  heavy = 4,
  none = 5,
}
export enum CategoryValueOvulationTestResult {
  negative = 1,
  luteinizingHormoneSurge = 2,
  positive = 2,
  indeterminate = 3,
  estrogenSurge = 4,
}
export enum CategoryValuePregnancyTestResult {
  negative = 1,
  positive = 2,
  indeterminate = 3,
}
export enum CategoryValuePresence {
  present = 0,
  notPresent = 1,
}
export enum CategoryValueProgesteroneTestResult {
  negative = 1,
  positive = 2,
  indeterminate = 3,
}
export enum CategoryValueSeverity {
  unspecified = 0,
  notPresent = 1,
  mild = 2,
  moderate = 3,
  severe = 4,
}
export enum CategoryValueSleepAnalysis {
  inBed = 0,
  asleepUnspecified = 1,
  asleep = 1,
  awake = 2,
  asleepCore = 3,
  asleepDeep = 4,
  asleepREM = 5,
}
export enum CategoryValueVaginalBleeding {
  unspecified = 1,
  light = 2,
  medium = 3,
  heavy = 4,
  none = 5,
}
export enum CyclingFunctionalThresholdPowerTestType {
  maxExercise60Minute = 1,
  maxExercise20Minute = 2,
  rampTest = 3,
  predictionExercise = 4,
}
export enum DevicePlacementSide {
  unknown = 0,
  left = 1,
  right = 2,
  central = 3,
}
export enum HeartRateMotionContext {
  notSet = 0,
  sedentary = 1,
  active = 2,
}
export enum HeartRateRecoveryTestType {
  maxExercise = 1,
  predictionSubMaxExercise = 2,
  predictionNonExercise = 3,
}
export enum HeartRateSensorLocation {
  other = 0,
  chest = 1,
  wrist = 2,
  finger = 3,
  hand = 4,
  earLobe = 5,
  foot = 6,
}
export enum InsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}
export enum PhysicalEffortEstimationType {
  activityLookup = 1,
  deviceSensed = 2,
}
export enum SwimmingStrokeStyle {
  unknown = 0,
  mixed = 1,
  freestyle = 2,
  backstroke = 3,
  breaststroke = 4,
  butterfly = 5,
  kickboard = 6,
}
export enum UserMotionContext {
  notSet = 0,
  stationary = 1,
  active = 2,
}
export enum VO2MaxTestType {
  maxExercise = 1,
  predictionSubMaxExercise = 2,
  predictionNonExercise = 3,
  predictionStepTest = 4,
}
export enum WaterSalinity {
  freshWater = 1,
  saltWater = 2,
}
export enum WeatherCondition {
  none = 0,
  clear = 1,
  fair = 2,
  partlyCloudy = 3,
  mostlyCloudy = 4,
  cloudy = 5,
  foggy = 6,
  haze = 7,
  windy = 8,
  blustery = 9,
  smoky = 10,
  dust = 11,
  snow = 12,
  hail = 13,
  sleet = 14,
  freezingDrizzle = 15,
  freezingRain = 16,
  mixedRainAndHail = 17,
  mixedRainAndSnow = 18,
  mixedRainAndSleet = 19,
  mixedSnowAndSleet = 20,
  drizzle = 21,
  scatteredShowers = 22,
  showers = 23,
  thunderstorms = 24,
  tropicalStorm = 25,
  hurricane = 26,
  tornado = 27,
}
export enum WorkoutActivityType {
  americanFootball = 1,
  archery = 2,
  australianFootball = 3,
  badminton = 4,
  baseball = 5,
  basketball = 6,
  bowling = 7,
  boxing = 8,
  climbing = 9,
  cricket = 10,
  crossTraining = 11,
  curling = 12,
  cycling = 13,
  dance = 14,
  danceInspiredTraining = 15,
  elliptical = 16,
  equestrianSports = 17,
  fencing = 18,
  fishing = 19,
  functionalStrengthTraining = 20,
  golf = 21,
  gymnastics = 22,
  handball = 23,
  hiking = 24,
  hockey = 25,
  hunting = 26,
  lacrosse = 27,
  martialArts = 28,
  mindAndBody = 29,
  mixedMetabolicCardioTraining = 30,
  paddleSports = 31,
  play = 32,
  preparationAndRecovery = 33,
  racquetball = 34,
  rowing = 35,
  rugby = 36,
  running = 37,
  sailing = 38,
  skatingSports = 39,
  snowSports = 40,
  soccer = 41,
  softball = 42,
  squash = 43,
  stairClimbing = 44,
  surfingSports = 45,
  swimming = 46,
  tableTennis = 47,
  tennis = 48,
  trackAndField = 49,
  traditionalStrengthTraining = 50,
  volleyball = 51,
  walking = 52,
  waterFitness = 53,
  waterPolo = 54,
  waterSports = 55,
  wrestling = 56,
  yoga = 57,
  barre = 58,
  coreTraining = 59,
  crossCountrySkiing = 60,
  downhillSkiing = 61,
  flexibility = 62,
  highIntensityIntervalTraining = 63,
  jumpRope = 64,
  kickboxing = 65,
  pilates = 66,
  snowboarding = 67,
  stairs = 68,
  stepTraining = 69,
  wheelchairWalkPace = 70,
  wheelchairRunPace = 71,
  taiChi = 72,
  mixedCardio = 73,
  handCycling = 74,
  discSports = 75,
  fitnessGaming = 76,
  cardioDance = 77,
  socialDance = 78,
  pickleball = 79,
  cooldown = 80,
  swimBikeRun = 82,
  transition = 83,
  underwaterDiving = 84,
  other = 3000,
}
export enum WorkoutEventType {
  pause = 1,
  resume = 2,
  lap = 3,
  marker = 4,
  motionPaused = 5,
  motionResumed = 6,
  segment = 7,
  pauseOrResumeRequest = 8,
}
export enum WorkoutSwimmingLocationType {
  unknown = 0,
  pool = 1,
  openWater = 2,
}
export interface CategoryValueByIdentifierMap {
  readonly HKCategoryTypeIdentifierAbdominalCramps: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierAcne: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierAppetiteChanges: CategoryValueAppetiteChanges
  readonly HKCategoryTypeIdentifierAppleStandHour: CategoryValueAppleStandHour
  readonly HKCategoryTypeIdentifierAppleWalkingSteadinessEvent: CategoryValueAppleWalkingSteadinessEvent
  readonly HKCategoryTypeIdentifierBladderIncontinence: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierBleedingAfterPregnancy: CategoryValueVaginalBleeding
  readonly HKCategoryTypeIdentifierBleedingDuringPregnancy: CategoryValueVaginalBleeding
  readonly HKCategoryTypeIdentifierBloating: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierBreastPain: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierCervicalMucusQuality: CategoryValueCervicalMucusQuality
  readonly HKCategoryTypeIdentifierChestTightnessOrPain: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierChills: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierConstipation: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierContraceptive: CategoryValueContraceptive
  readonly HKCategoryTypeIdentifierCoughing: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierDiarrhea: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierDizziness: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierDrySkin: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent: CategoryValueEnvironmentalAudioExposureEvent
  readonly HKCategoryTypeIdentifierFainting: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierFatigue: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierFever: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierGeneralizedBodyAche: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierHairLoss: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierHandwashingEvent: CategoryValue
  readonly HKCategoryTypeIdentifierHeadache: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierHeadphoneAudioExposureEvent: CategoryValueHeadphoneAudioExposureEvent
  readonly HKCategoryTypeIdentifierHeartburn: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierHighHeartRateEvent: CategoryValue
  readonly HKCategoryTypeIdentifierHotFlashes: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierHypertensionEvent: CategoryValue
  readonly HKCategoryTypeIdentifierInfrequentMenstrualCycles: CategoryValue
  readonly HKCategoryTypeIdentifierIntermenstrualBleeding: CategoryValue
  readonly HKCategoryTypeIdentifierIrregularHeartRhythmEvent: CategoryValue
  readonly HKCategoryTypeIdentifierIrregularMenstrualCycles: CategoryValue
  readonly HKCategoryTypeIdentifierLactation: CategoryValue
  readonly HKCategoryTypeIdentifierLossOfSmell: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierLossOfTaste: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierLowCardioFitnessEvent: CategoryValueLowCardioFitnessEvent
  readonly HKCategoryTypeIdentifierLowerBackPain: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierLowHeartRateEvent: CategoryValue
  readonly HKCategoryTypeIdentifierMemoryLapse: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierMenstrualFlow: CategoryValueMenstrualFlow
  readonly HKCategoryTypeIdentifierMindfulSession: CategoryValue
  readonly HKCategoryTypeIdentifierMoodChanges: CategoryValuePresence
  readonly HKCategoryTypeIdentifierNausea: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierNightSweats: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierOvulationTestResult: CategoryValueOvulationTestResult
  readonly HKCategoryTypeIdentifierPelvicPain: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierPersistentIntermenstrualBleeding: CategoryValue
  readonly HKCategoryTypeIdentifierPregnancy: CategoryValue
  readonly HKCategoryTypeIdentifierPregnancyTestResult: CategoryValuePregnancyTestResult
  readonly HKCategoryTypeIdentifierProgesteroneTestResult: CategoryValueProgesteroneTestResult
  readonly HKCategoryTypeIdentifierProlongedMenstrualPeriods: CategoryValue
  readonly HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierRunnyNose: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierSexualActivity: CategoryValue
  readonly HKCategoryTypeIdentifierShortnessOfBreath: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierSinusCongestion: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierSkippedHeartbeat: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierSleepAnalysis: CategoryValueSleepAnalysis
  readonly HKCategoryTypeIdentifierSleepApneaEvent: CategoryValue
  readonly HKCategoryTypeIdentifierSleepChanges: CategoryValuePresence
  readonly HKCategoryTypeIdentifierSoreThroat: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierToothbrushingEvent: CategoryValue
  readonly HKCategoryTypeIdentifierVaginalDryness: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierVomiting: CategoryValueSeverity
  readonly HKCategoryTypeIdentifierWheezing: CategoryValueSeverity
}
export type CategoryValueForIdentifierGenerated<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = T extends keyof CategoryValueByIdentifierMap
  ? CategoryValueByIdentifierMap[T]
  : number
export interface KnownObjectMetadata {
  readonly HKDeviceManufacturerName?: string
  readonly HKDeviceName?: string
  readonly HKDeviceSerialNumber?: string
  readonly HKDigitalSignature?: string
  readonly HKExternalUUID?: string
  readonly HKFoodType?: string
  readonly HKReferenceRangeLowerLimit?: number
  readonly HKReferenceRangeUpperLimit?: number
  readonly HKSyncIdentifier?: string
  readonly HKSyncVersion?: number
  readonly HKTimeZone?: string
  readonly HKUDIDeviceIdentifier?: string
  readonly HKUDIProductionIdentifier?: string
  readonly HKWasTakenInLab?: boolean
  readonly HKWasUserEntered?: boolean
}
export interface KnownSampleMetadata extends KnownObjectMetadata {
  readonly HKActivityType?: WorkoutActivityType
  readonly HKAlgorithmVersion?: number
  readonly HKAudioExposureDuration?: Quantity
  readonly HKBarometricPressure?: Quantity
  readonly HKMaximumLightIntensity?: Quantity
  readonly HKPhysicalEffortEstimationType?: PhysicalEffortEstimationType
  readonly HKUserMotionContext?: UserMotionContext
  readonly HKWaterSalinity?: WaterSalinity
  readonly HKWeatherCondition?: WeatherCondition
  readonly HKWeatherHumidity?: Quantity
  readonly HKWeatherTemperature?: Quantity
}
export interface CategoryTypedMetadata extends KnownSampleMetadata {
  readonly HKMenstrualCycleStart?: boolean
  readonly HKSexualActivityProtectionUsed?: boolean
}
export interface QuantityTypedMetadata extends KnownSampleMetadata {
  readonly HKHeartRateMotionContext?: HeartRateMotionContext
  readonly HKHeartRateRecoveryActivityDuration?: Quantity
  readonly HKHeartRateRecoveryActivityType?: WorkoutActivityType
  readonly HKHeartRateRecoveryMaxObservedRecoveryHeartRate?: Quantity
  readonly HKHeartRateRecoveryTestType?: HeartRateRecoveryTestType
  readonly HKHeartRateSensorLocation?: HeartRateSensorLocation
  readonly HKSessionEstimate?: Quantity
  readonly HKBloodGlucoseMealTime?: BloodGlucoseMealTime
  readonly HKBodyTemperatureSensorLocation?: BodyTemperatureSensorLocation
  readonly HKInsulinDeliveryReason?: InsulinDeliveryReason
  readonly HKVO2MaxTestType?: VO2MaxTestType
}
export interface WorkoutTypedMetadata extends KnownSampleMetadata {
  readonly HKAlpineSlopeGrade?: Quantity
  readonly HKAppleFitnessPlusCatalogIdentifier?: string
  readonly HKAppleFitnessPlusSession?: boolean
  readonly HKAverageMETs?: Quantity
  readonly HKAverageSpeed?: Quantity
  readonly HKCoachedWorkout?: boolean
  readonly HKCrossTrainerDistance?: Quantity
  readonly HKElevationAscended?: Quantity
  readonly HKElevationDescended?: Quantity
  readonly HKFitnessMachineDuration?: Quantity
  readonly HKGroupFitness?: boolean
  readonly HKIndoorBikeDistance?: Quantity
  readonly HKIndoorWorkout?: boolean
  readonly HKLapLength?: Quantity
  readonly HKMaximumSpeed?: Quantity
  readonly HKSwimmingLocationType?: WorkoutSwimmingLocationType
  readonly HKSWOLFScore?: number
  readonly HKWeatherCondition?: WeatherCondition
  readonly HKWeatherHumidity?: Quantity
  readonly HKWeatherTemperature?: Quantity
  readonly HKWorkoutBrandName?: string
}
export interface WorkoutEventTypedMetadata {
  readonly HKSwimmingStrokeStyle?: SwimmingStrokeStyle
}
export interface CategorySpecificMetadataByIdentifierMap {
  readonly HKCategoryTypeIdentifierMenstrualFlow: Pick<
    CategoryTypedMetadata,
    'HKMenstrualCycleStart'
  >
  readonly HKCategoryTypeIdentifierSexualActivity: Pick<
    CategoryTypedMetadata,
    'HKSexualActivityProtectionUsed'
  >
}
export type CategoryTypedMetadataForIdentifierGenerated<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = KnownSampleMetadata &
  (T extends keyof CategorySpecificMetadataByIdentifierMap
    ? CategorySpecificMetadataByIdentifierMap[T]
    : Record<string, never>)
export interface QuantitySpecificMetadataByIdentifierMap {
  readonly HKQuantityTypeIdentifierBasalBodyTemperature: Pick<
    QuantityTypedMetadata,
    'HKBodyTemperatureSensorLocation'
  >
  readonly HKQuantityTypeIdentifierBloodGlucose: Pick<
    QuantityTypedMetadata,
    'HKBloodGlucoseMealTime'
  >
  readonly HKQuantityTypeIdentifierBodyTemperature: Pick<
    QuantityTypedMetadata,
    'HKBodyTemperatureSensorLocation'
  >
  readonly HKQuantityTypeIdentifierInsulinDelivery: Pick<
    QuantityTypedMetadata,
    'HKInsulinDeliveryReason'
  >
  readonly HKQuantityTypeIdentifierVO2Max: Pick<
    QuantityTypedMetadata,
    'HKVO2MaxTestType'
  >
}
export type QuantityTypedMetadataForIdentifierGenerated<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = KnownSampleMetadata &
  Pick<
    QuantityTypedMetadata,
    | 'HKHeartRateMotionContext'
    | 'HKHeartRateRecoveryActivityDuration'
    | 'HKHeartRateRecoveryActivityType'
    | 'HKHeartRateRecoveryMaxObservedRecoveryHeartRate'
    | 'HKHeartRateRecoveryTestType'
    | 'HKHeartRateSensorLocation'
    | 'HKSessionEstimate'
  > &
  (T extends keyof QuantitySpecificMetadataByIdentifierMap
    ? QuantitySpecificMetadataByIdentifierMap[T]
    : Record<string, never>)
export interface QuantityUnitByIdentifierMap {
  readonly HKQuantityTypeIdentifierActiveEnergyBurned: EnergyUnit
  readonly HKQuantityTypeIdentifierAppleExerciseTime: TimeUnit
  readonly HKQuantityTypeIdentifierAppleMoveTime: TimeUnit
  readonly HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances: 'count'
  readonly HKQuantityTypeIdentifierAppleSleepingWristTemperature: TemperatureUnit
  readonly HKQuantityTypeIdentifierAppleStandTime: TimeUnit
  readonly HKQuantityTypeIdentifierAppleWalkingSteadiness: '%'
  readonly HKQuantityTypeIdentifierAtrialFibrillationBurden: '%'
  readonly HKQuantityTypeIdentifierBasalBodyTemperature: TemperatureUnit
  readonly HKQuantityTypeIdentifierBasalEnergyBurned: EnergyUnit
  readonly HKQuantityTypeIdentifierBloodAlcoholContent: '%'
  readonly HKQuantityTypeIdentifierBloodGlucose: BloodGlucoseUnit
  readonly HKQuantityTypeIdentifierBloodPressureDiastolic: PressureUnit
  readonly HKQuantityTypeIdentifierBloodPressureSystolic: PressureUnit
  readonly HKQuantityTypeIdentifierBodyFatPercentage: '%'
  readonly HKQuantityTypeIdentifierBodyMass: MassUnit
  readonly HKQuantityTypeIdentifierBodyMassIndex: 'count'
  readonly HKQuantityTypeIdentifierBodyTemperature: TemperatureUnit
  readonly HKQuantityTypeIdentifierCrossCountrySkiingSpeed: SpeedUnit<
    LengthUnit,
    TimeUnit
  >
  readonly HKQuantityTypeIdentifierCyclingCadence: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierCyclingFunctionalThresholdPower: string
  readonly HKQuantityTypeIdentifierCyclingPower: string
  readonly HKQuantityTypeIdentifierCyclingSpeed: SpeedUnit<LengthUnit, TimeUnit>
  readonly HKQuantityTypeIdentifierDietaryBiotin: MassUnit
  readonly HKQuantityTypeIdentifierDietaryCaffeine: MassUnit
  readonly HKQuantityTypeIdentifierDietaryCalcium: MassUnit
  readonly HKQuantityTypeIdentifierDietaryCarbohydrates: MassUnit
  readonly HKQuantityTypeIdentifierDietaryChloride: MassUnit
  readonly HKQuantityTypeIdentifierDietaryCholesterol: MassUnit
  readonly HKQuantityTypeIdentifierDietaryChromium: MassUnit
  readonly HKQuantityTypeIdentifierDietaryCopper: MassUnit
  readonly HKQuantityTypeIdentifierDietaryEnergyConsumed: EnergyUnit
  readonly HKQuantityTypeIdentifierDietaryFatMonounsaturated: MassUnit
  readonly HKQuantityTypeIdentifierDietaryFatPolyunsaturated: MassUnit
  readonly HKQuantityTypeIdentifierDietaryFatSaturated: MassUnit
  readonly HKQuantityTypeIdentifierDietaryFatTotal: MassUnit
  readonly HKQuantityTypeIdentifierDietaryFiber: MassUnit
  readonly HKQuantityTypeIdentifierDietaryFolate: MassUnit
  readonly HKQuantityTypeIdentifierDietaryIodine: MassUnit
  readonly HKQuantityTypeIdentifierDietaryIron: MassUnit
  readonly HKQuantityTypeIdentifierDietaryMagnesium: MassUnit
  readonly HKQuantityTypeIdentifierDietaryManganese: MassUnit
  readonly HKQuantityTypeIdentifierDietaryMolybdenum: MassUnit
  readonly HKQuantityTypeIdentifierDietaryNiacin: MassUnit
  readonly HKQuantityTypeIdentifierDietaryPantothenicAcid: MassUnit
  readonly HKQuantityTypeIdentifierDietaryPhosphorus: MassUnit
  readonly HKQuantityTypeIdentifierDietaryPotassium: MassUnit
  readonly HKQuantityTypeIdentifierDietaryProtein: MassUnit
  readonly HKQuantityTypeIdentifierDietaryRiboflavin: MassUnit
  readonly HKQuantityTypeIdentifierDietarySelenium: MassUnit
  readonly HKQuantityTypeIdentifierDietarySodium: MassUnit
  readonly HKQuantityTypeIdentifierDietarySugar: MassUnit
  readonly HKQuantityTypeIdentifierDietaryThiamin: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminA: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminB12: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminB6: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminC: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminD: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminE: MassUnit
  readonly HKQuantityTypeIdentifierDietaryVitaminK: MassUnit
  readonly HKQuantityTypeIdentifierDietaryWater: string
  readonly HKQuantityTypeIdentifierDietaryZinc: MassUnit
  readonly HKQuantityTypeIdentifierDistanceCrossCountrySkiing: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceCycling: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceDownhillSnowSports: LengthUnit
  readonly HKQuantityTypeIdentifierDistancePaddleSports: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceRowing: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceSkatingSports: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceSwimming: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceWalkingRunning: LengthUnit
  readonly HKQuantityTypeIdentifierDistanceWheelchair: LengthUnit
  readonly HKQuantityTypeIdentifierElectrodermalActivity: string
  readonly HKQuantityTypeIdentifierEnvironmentalAudioExposure: PressureUnit
  readonly HKQuantityTypeIdentifierEnvironmentalSoundReduction: PressureUnit
  readonly HKQuantityTypeIdentifierEstimatedWorkoutEffortScore: 'appleEffortScore'
  readonly HKQuantityTypeIdentifierFlightsClimbed: 'count'
  readonly HKQuantityTypeIdentifierForcedExpiratoryVolume1: string
  readonly HKQuantityTypeIdentifierForcedVitalCapacity: string
  readonly HKQuantityTypeIdentifierHeadphoneAudioExposure: PressureUnit
  readonly HKQuantityTypeIdentifierHeartRate: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierHeartRateRecoveryOneMinute: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierHeartRateVariabilitySDNN: string
  readonly HKQuantityTypeIdentifierHeight: LengthUnit
  readonly HKQuantityTypeIdentifierInhalerUsage: 'count'
  readonly HKQuantityTypeIdentifierInsulinDelivery: 'IU'
  readonly HKQuantityTypeIdentifierLeanBodyMass: MassUnit
  readonly HKQuantityTypeIdentifierNikeFuel: 'count'
  readonly HKQuantityTypeIdentifierNumberOfAlcoholicBeverages: 'count'
  readonly HKQuantityTypeIdentifierNumberOfTimesFallen: 'count'
  readonly HKQuantityTypeIdentifierOxygenSaturation: '%'
  readonly HKQuantityTypeIdentifierPaddleSportsSpeed: SpeedUnit<
    LengthUnit,
    TimeUnit
  >
  readonly HKQuantityTypeIdentifierPeakExpiratoryFlowRate: string
  readonly HKQuantityTypeIdentifierPeripheralPerfusionIndex: '%'
  readonly HKQuantityTypeIdentifierPhysicalEffort: string
  readonly HKQuantityTypeIdentifierPushCount: 'count'
  readonly HKQuantityTypeIdentifierRespiratoryRate: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierRestingHeartRate: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierRowingSpeed: SpeedUnit<LengthUnit, TimeUnit>
  readonly HKQuantityTypeIdentifierRunningGroundContactTime: string
  readonly HKQuantityTypeIdentifierRunningPower: string
  readonly HKQuantityTypeIdentifierRunningSpeed: SpeedUnit<LengthUnit, TimeUnit>
  readonly HKQuantityTypeIdentifierRunningStrideLength: LengthUnit
  readonly HKQuantityTypeIdentifierRunningVerticalOscillation: LengthUnit
  readonly HKQuantityTypeIdentifierSixMinuteWalkTestDistance: LengthUnit
  readonly HKQuantityTypeIdentifierStairAscentSpeed: SpeedUnit<
    LengthUnit,
    TimeUnit
  >
  readonly HKQuantityTypeIdentifierStairDescentSpeed: SpeedUnit<
    LengthUnit,
    TimeUnit
  >
  readonly HKQuantityTypeIdentifierStepCount: 'count'
  readonly HKQuantityTypeIdentifierSwimmingStrokeCount: 'count'
  readonly HKQuantityTypeIdentifierTimeInDaylight: TimeUnit
  readonly HKQuantityTypeIdentifierUnderwaterDepth: LengthUnit
  readonly HKQuantityTypeIdentifierUVExposure: string
  readonly HKQuantityTypeIdentifierVO2Max: string
  readonly HKQuantityTypeIdentifierWaistCircumference: LengthUnit
  readonly HKQuantityTypeIdentifierWalkingAsymmetryPercentage: '%'
  readonly HKQuantityTypeIdentifierWalkingDoubleSupportPercentage: '%'
  readonly HKQuantityTypeIdentifierWalkingHeartRateAverage: CountPerTime<TimeUnit>
  readonly HKQuantityTypeIdentifierWalkingSpeed: SpeedUnit<LengthUnit, TimeUnit>
  readonly HKQuantityTypeIdentifierWalkingStepLength: LengthUnit
  readonly HKQuantityTypeIdentifierWaterTemperature: TemperatureUnit
  readonly HKQuantityTypeIdentifierWorkoutEffortScore: 'appleEffortScore'
}
export type UnitForIdentifierGenerated<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = T extends keyof QuantityUnitByIdentifierMap
  ? QuantityUnitByIdentifierMap[T]
  : string
