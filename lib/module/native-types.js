import { NativeEventEmitter, NativeModules } from 'react-native';
/**
 * See https://developer.apple.com/documentation/healthkit/hkworkouttypeidentifier
 */
export const HKWorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier';
export const HKAudiogramTypeIdentifier = 'HKAudiogramTypeIdentifier';

/**
 * See https://developer.apple.com/documentation/healthkit/hkworkoutroutetypeidentifier
 */
export const HKWorkoutRouteTypeIdentifier = 'HKWorkoutRouteTypeIdentifier';
export const HKDataTypeIdentifierHeartbeatSeries = 'HKDataTypeIdentifierHeartbeatSeries';

/**
 * See https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier
 */
export let HKQuantityTypeIdentifier = /*#__PURE__*/function (HKQuantityTypeIdentifier) {
  HKQuantityTypeIdentifier["bodyMassIndex"] = "HKQuantityTypeIdentifierBodyMassIndex";
  HKQuantityTypeIdentifier["bodyFatPercentage"] = "HKQuantityTypeIdentifierBodyFatPercentage";
  HKQuantityTypeIdentifier["height"] = "HKQuantityTypeIdentifierHeight";
  HKQuantityTypeIdentifier["bodyMass"] = "HKQuantityTypeIdentifierBodyMass";
  HKQuantityTypeIdentifier["leanBodyMass"] = "HKQuantityTypeIdentifierLeanBodyMass";
  HKQuantityTypeIdentifier["waistCircumference"] = "HKQuantityTypeIdentifierWaistCircumference";
  HKQuantityTypeIdentifier["stepCount"] = "HKQuantityTypeIdentifierStepCount";
  HKQuantityTypeIdentifier["distanceWalkingRunning"] = "HKQuantityTypeIdentifierDistanceWalkingRunning";
  HKQuantityTypeIdentifier["distanceCycling"] = "HKQuantityTypeIdentifierDistanceCycling";
  HKQuantityTypeIdentifier["distanceWheelchair"] = "HKQuantityTypeIdentifierDistanceWheelchair";
  HKQuantityTypeIdentifier["basalEnergyBurned"] = "HKQuantityTypeIdentifierBasalEnergyBurned";
  HKQuantityTypeIdentifier["activeEnergyBurned"] = "HKQuantityTypeIdentifierActiveEnergyBurned";
  HKQuantityTypeIdentifier["flightsClimbed"] = "HKQuantityTypeIdentifierFlightsClimbed";
  HKQuantityTypeIdentifier["nikeFuel"] = "HKQuantityTypeIdentifierNikeFuel";
  HKQuantityTypeIdentifier["appleExerciseTime"] = "HKQuantityTypeIdentifierAppleExerciseTime";
  HKQuantityTypeIdentifier["pushCount"] = "HKQuantityTypeIdentifierPushCount";
  HKQuantityTypeIdentifier["distanceSwimming"] = "HKQuantityTypeIdentifierDistanceSwimming";
  HKQuantityTypeIdentifier["swimmingStrokeCount"] = "HKQuantityTypeIdentifierSwimmingStrokeCount";
  HKQuantityTypeIdentifier["vo2Max"] = "HKQuantityTypeIdentifierVO2Max";
  HKQuantityTypeIdentifier["distanceDownhillSnowSports"] = "HKQuantityTypeIdentifierDistanceDownhillSnowSports";
  HKQuantityTypeIdentifier["appleStandTime"] = "HKQuantityTypeIdentifierAppleStandTime";
  HKQuantityTypeIdentifier["heartRate"] = "HKQuantityTypeIdentifierHeartRate";
  HKQuantityTypeIdentifier["bodyTemperature"] = "HKQuantityTypeIdentifierBodyTemperature";
  HKQuantityTypeIdentifier["basalBodyTemperature"] = "HKQuantityTypeIdentifierBasalBodyTemperature";
  HKQuantityTypeIdentifier["bloodPressureSystolic"] = "HKQuantityTypeIdentifierBloodPressureSystolic";
  HKQuantityTypeIdentifier["bloodPressureDiastolic"] = "HKQuantityTypeIdentifierBloodPressureDiastolic";
  HKQuantityTypeIdentifier["respiratoryRate"] = "HKQuantityTypeIdentifierRespiratoryRate";
  HKQuantityTypeIdentifier["restingHeartRate"] = "HKQuantityTypeIdentifierRestingHeartRate";
  HKQuantityTypeIdentifier["walkingHeartRateAverage"] = "HKQuantityTypeIdentifierWalkingHeartRateAverage";
  HKQuantityTypeIdentifier["heartRateVariabilitySDNN"] = "HKQuantityTypeIdentifierHeartRateVariabilitySDNN";
  HKQuantityTypeIdentifier["oxygenSaturation"] = "HKQuantityTypeIdentifierOxygenSaturation";
  HKQuantityTypeIdentifier["peripheralPerfusionIndex"] = "HKQuantityTypeIdentifierPeripheralPerfusionIndex";
  HKQuantityTypeIdentifier["bloodGlucose"] = "HKQuantityTypeIdentifierBloodGlucose";
  HKQuantityTypeIdentifier["numberOfTimesFallen"] = "HKQuantityTypeIdentifierNumberOfTimesFallen";
  HKQuantityTypeIdentifier["electrodermalActivity"] = "HKQuantityTypeIdentifierElectrodermalActivity";
  HKQuantityTypeIdentifier["inhalerUsage"] = "HKQuantityTypeIdentifierInhalerUsage";
  HKQuantityTypeIdentifier["insulinDelivery"] = "HKQuantityTypeIdentifierInsulinDelivery";
  HKQuantityTypeIdentifier["bloodAlcoholContent"] = "HKQuantityTypeIdentifierBloodAlcoholContent";
  HKQuantityTypeIdentifier["forcedVitalCapacity"] = "HKQuantityTypeIdentifierForcedVitalCapacity";
  HKQuantityTypeIdentifier["forcedExpiratoryVolume1"] = "HKQuantityTypeIdentifierForcedExpiratoryVolume1";
  HKQuantityTypeIdentifier["peakExpiratoryFlowRate"] = "HKQuantityTypeIdentifierPeakExpiratoryFlowRate";
  HKQuantityTypeIdentifier["environmentalAudioExposure"] = "HKQuantityTypeIdentifierEnvironmentalAudioExposure";
  HKQuantityTypeIdentifier["headphoneAudioExposure"] = "HKQuantityTypeIdentifierHeadphoneAudioExposure";
  HKQuantityTypeIdentifier["dietaryFatTotal"] = "HKQuantityTypeIdentifierDietaryFatTotal";
  HKQuantityTypeIdentifier["dietaryFatPolyunsaturated"] = "HKQuantityTypeIdentifierDietaryFatPolyunsaturated";
  HKQuantityTypeIdentifier["dietaryFatMonounsaturated"] = "HKQuantityTypeIdentifierDietaryFatMonounsaturated";
  HKQuantityTypeIdentifier["dietaryFatSaturated"] = "HKQuantityTypeIdentifierDietaryFatSaturated";
  HKQuantityTypeIdentifier["dietaryCholesterol"] = "HKQuantityTypeIdentifierDietaryCholesterol";
  HKQuantityTypeIdentifier["dietarySodium"] = "HKQuantityTypeIdentifierDietarySodium";
  HKQuantityTypeIdentifier["dietaryCarbohydrates"] = "HKQuantityTypeIdentifierDietaryCarbohydrates";
  HKQuantityTypeIdentifier["dietaryFiber"] = "HKQuantityTypeIdentifierDietaryFiber";
  HKQuantityTypeIdentifier["dietarySugar"] = "HKQuantityTypeIdentifierDietarySugar";
  HKQuantityTypeIdentifier["dietaryEnergyConsumed"] = "HKQuantityTypeIdentifierDietaryEnergyConsumed";
  HKQuantityTypeIdentifier["dietaryProtein"] = "HKQuantityTypeIdentifierDietaryProtein";
  HKQuantityTypeIdentifier["dietaryVitaminA"] = "HKQuantityTypeIdentifierDietaryVitaminA";
  HKQuantityTypeIdentifier["dietaryVitaminB6"] = "HKQuantityTypeIdentifierDietaryVitaminB6";
  HKQuantityTypeIdentifier["dietaryVitaminB12"] = "HKQuantityTypeIdentifierDietaryVitaminB12";
  HKQuantityTypeIdentifier["dietaryVitaminC"] = "HKQuantityTypeIdentifierDietaryVitaminC";
  HKQuantityTypeIdentifier["dietaryVitaminD"] = "HKQuantityTypeIdentifierDietaryVitaminD";
  HKQuantityTypeIdentifier["dietaryVitaminE"] = "HKQuantityTypeIdentifierDietaryVitaminE";
  HKQuantityTypeIdentifier["dietaryVitaminK"] = "HKQuantityTypeIdentifierDietaryVitaminK";
  HKQuantityTypeIdentifier["dietaryCalcium"] = "HKQuantityTypeIdentifierDietaryCalcium";
  HKQuantityTypeIdentifier["dietaryIron"] = "HKQuantityTypeIdentifierDietaryIron";
  HKQuantityTypeIdentifier["dietaryThiamin"] = "HKQuantityTypeIdentifierDietaryThiamin";
  HKQuantityTypeIdentifier["dietaryRiboflavin"] = "HKQuantityTypeIdentifierDietaryRiboflavin";
  HKQuantityTypeIdentifier["dietaryNiacin"] = "HKQuantityTypeIdentifierDietaryNiacin";
  HKQuantityTypeIdentifier["dietaryFolate"] = "HKQuantityTypeIdentifierDietaryFolate";
  HKQuantityTypeIdentifier["dietaryBiotin"] = "HKQuantityTypeIdentifierDietaryBiotin";
  HKQuantityTypeIdentifier["dietaryPantothenicAcid"] = "HKQuantityTypeIdentifierDietaryPantothenicAcid";
  HKQuantityTypeIdentifier["dietaryPhosphorus"] = "HKQuantityTypeIdentifierDietaryPhosphorus";
  HKQuantityTypeIdentifier["dietaryIodine"] = "HKQuantityTypeIdentifierDietaryIodine";
  HKQuantityTypeIdentifier["dietaryMagnesium"] = "HKQuantityTypeIdentifierDietaryMagnesium";
  HKQuantityTypeIdentifier["dietaryZinc"] = "HKQuantityTypeIdentifierDietaryZinc";
  HKQuantityTypeIdentifier["dietarySelenium"] = "HKQuantityTypeIdentifierDietarySelenium";
  HKQuantityTypeIdentifier["dietaryCopper"] = "HKQuantityTypeIdentifierDietaryCopper";
  HKQuantityTypeIdentifier["dietaryManganese"] = "HKQuantityTypeIdentifierDietaryManganese";
  HKQuantityTypeIdentifier["dietaryChromium"] = "HKQuantityTypeIdentifierDietaryChromium";
  HKQuantityTypeIdentifier["dietaryMolybdenum"] = "HKQuantityTypeIdentifierDietaryMolybdenum";
  HKQuantityTypeIdentifier["dietaryChloride"] = "HKQuantityTypeIdentifierDietaryChloride";
  HKQuantityTypeIdentifier["dietaryPotassium"] = "HKQuantityTypeIdentifierDietaryPotassium";
  HKQuantityTypeIdentifier["dietaryCaffeine"] = "HKQuantityTypeIdentifierDietaryCaffeine";
  HKQuantityTypeIdentifier["dietaryWater"] = "HKQuantityTypeIdentifierDietaryWater";
  HKQuantityTypeIdentifier["sixMinuteWalkTestDistance"] = "HKQuantityTypeIdentifierSixMinuteWalkTestDistance";
  HKQuantityTypeIdentifier["walkingSpeed"] = "HKQuantityTypeIdentifierWalkingSpeed";
  HKQuantityTypeIdentifier["walkingStepLength"] = "HKQuantityTypeIdentifierWalkingStepLength";
  HKQuantityTypeIdentifier["walkingAsymmetryPercentage"] = "HKQuantityTypeIdentifierWalkingAsymmetryPercentage";
  HKQuantityTypeIdentifier["walkingDoubleSupportPercentage"] = "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage";
  HKQuantityTypeIdentifier["stairAscentSpeed"] = "HKQuantityTypeIdentifierStairAscentSpeed";
  HKQuantityTypeIdentifier["stairDescentSpeed"] = "HKQuantityTypeIdentifierStairDescentSpeed";
  HKQuantityTypeIdentifier["uvExposure"] = "HKQuantityTypeIdentifierUVExposure";
  HKQuantityTypeIdentifier["appleMoveTime"] = "HKQuantityTypeIdentifierAppleMoveTime";
  HKQuantityTypeIdentifier["appleWalkingSteadiness"] = "HKQuantityTypeIdentifierAppleWalkingSteadiness";
  HKQuantityTypeIdentifier["numberOfAlcoholicBeverages"] = "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages";
  HKQuantityTypeIdentifier["atrialFibrillationBurden"] = "HKQuantityTypeIdentifierAtrialFibrillationBurden";
  HKQuantityTypeIdentifier["underwaterDepth"] = "HKQuantityTypeIdentifierUnderwaterDepth";
  HKQuantityTypeIdentifier["waterTemperature"] = "HKQuantityTypeIdentifierWaterTemperature";
  HKQuantityTypeIdentifier["appleSleepingWristTemperature"] = "HKQuantityTypeIdentifierAppleSleepingWristTemperature";
  HKQuantityTypeIdentifier["timeInDaylight"] = "HKQuantityTypeIdentifierTimeInDaylight";
  HKQuantityTypeIdentifier["physicalEffort"] = "HKQuantityTypeIdentifierPhysicalEffort";
  HKQuantityTypeIdentifier["cyclingSpeed"] = "HKQuantityTypeIdentifierCyclingSpeed";
  HKQuantityTypeIdentifier["cyclingPower"] = "HKQuantityTypeIdentifierCyclingPower";
  HKQuantityTypeIdentifier["cyclingFunctionalThresholdPower"] = "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower";
  HKQuantityTypeIdentifier["cyclingCadence"] = "HKQuantityTypeIdentifierCyclingCadence";
  HKQuantityTypeIdentifier["environmentalSoundReduction"] = "HKQuantityTypeIdentifierEnvironmentalSoundReduction";
  HKQuantityTypeIdentifier["heartRateRecoveryOneMinute"] = "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute";
  return HKQuantityTypeIdentifier;
}({});
export let HKCategoryValueLowCardioFitnessEvent = /*#__PURE__*/function (HKCategoryValueLowCardioFitnessEvent) {
  HKCategoryValueLowCardioFitnessEvent[HKCategoryValueLowCardioFitnessEvent["lowFitness"] = 1] = "lowFitness";
  return HKCategoryValueLowCardioFitnessEvent;
}({});
export let HKHeartRateMotionContext = /*#__PURE__*/function (HKHeartRateMotionContext) {
  HKHeartRateMotionContext[HKHeartRateMotionContext["active"] = 2] = "active";
  HKHeartRateMotionContext[HKHeartRateMotionContext["notSet"] = 0] = "notSet";
  HKHeartRateMotionContext[HKHeartRateMotionContext["sedentary"] = 1] = "sedentary";
  return HKHeartRateMotionContext;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcorrelationtypeidentifier
 */
export let HKCorrelationTypeIdentifier = /*#__PURE__*/function (HKCorrelationTypeIdentifier) {
  HKCorrelationTypeIdentifier["bloodPressure"] = "HKCorrelationTypeIdentifierBloodPressure";
  HKCorrelationTypeIdentifier["food"] = "HKCorrelationTypeIdentifierFood";
  return HKCorrelationTypeIdentifier;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier
 */
export let HKCategoryTypeIdentifier = /*#__PURE__*/function (HKCategoryTypeIdentifier) {
  HKCategoryTypeIdentifier["sleepAnalysis"] = "HKCategoryTypeIdentifierSleepAnalysis";
  HKCategoryTypeIdentifier["appleStandHour"] = "HKCategoryTypeIdentifierAppleStandHour";
  HKCategoryTypeIdentifier["cervicalMucusQuality"] = "HKCategoryTypeIdentifierCervicalMucusQuality";
  HKCategoryTypeIdentifier["ovulationTestResult"] = "HKCategoryTypeIdentifierOvulationTestResult";
  HKCategoryTypeIdentifier["menstrualFlow"] = "HKCategoryTypeIdentifierMenstrualFlow";
  HKCategoryTypeIdentifier["intermenstrualBleeding"] = "HKCategoryTypeIdentifierIntermenstrualBleeding";
  HKCategoryTypeIdentifier["sexualActivity"] = "HKCategoryTypeIdentifierSexualActivity";
  HKCategoryTypeIdentifier["mindfulSession"] = "HKCategoryTypeIdentifierMindfulSession";
  HKCategoryTypeIdentifier["highHeartRateEvent"] = "HKCategoryTypeIdentifierHighHeartRateEvent";
  HKCategoryTypeIdentifier["lowHeartRateEvent"] = "HKCategoryTypeIdentifierLowHeartRateEvent";
  HKCategoryTypeIdentifier["irregularHeartRhythmEvent"] = "HKCategoryTypeIdentifierIrregularHeartRhythmEvent";
  HKCategoryTypeIdentifier["audioExposureEvent"] = "HKCategoryTypeIdentifierAudioExposureEvent";
  HKCategoryTypeIdentifier["toothbrushingEvent"] = "HKCategoryTypeIdentifierToothbrushingEvent";
  HKCategoryTypeIdentifier["lowCardioFitnessEvent"] = "HKCategoryTypeIdentifierLowCardioFitnessEvent";
  HKCategoryTypeIdentifier["contraceptive"] = "HKCategoryTypeIdentifierContraceptive";
  HKCategoryTypeIdentifier["lactation"] = "HKCategoryTypeIdentifierLactation";
  HKCategoryTypeIdentifier["pregnancy"] = "HKCategoryTypeIdentifierPregnancy";
  HKCategoryTypeIdentifier["pregnancyTestResult"] = "HKCategoryTypeIdentifierPregnancyTestResult";
  HKCategoryTypeIdentifier["progesteroneTestResult"] = "HKCategoryTypeIdentifierProgesteroneTestResult";
  HKCategoryTypeIdentifier["environmentalAudioExposureEvent"] = "HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent";
  HKCategoryTypeIdentifier["headphoneAudioExposureEvent"] = "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent";
  HKCategoryTypeIdentifier["appleWalkingSteadinessEvent"] = "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent";
  HKCategoryTypeIdentifier["handwashingEvent"] = "HKCategoryTypeIdentifierHandwashingEvent";
  HKCategoryTypeIdentifier["abdominalCramps"] = "HKCategoryTypeIdentifierAbdominalCramps";
  HKCategoryTypeIdentifier["acne"] = "HKCategoryTypeIdentifierAcne";
  HKCategoryTypeIdentifier["appetiteChanges"] = "HKCategoryTypeIdentifierAppetiteChanges";
  HKCategoryTypeIdentifier["bladderIncontinence"] = "HKCategoryTypeIdentifierBladderIncontinence";
  HKCategoryTypeIdentifier["bloating"] = "HKCategoryTypeIdentifierBloating";
  HKCategoryTypeIdentifier["breastPain"] = "HKCategoryTypeIdentifierBreastPain";
  HKCategoryTypeIdentifier["chestTightnessOrPain"] = "HKCategoryTypeIdentifierChestTightnessOrPain";
  HKCategoryTypeIdentifier["chills"] = "HKCategoryTypeIdentifierChills";
  HKCategoryTypeIdentifier["constipation"] = "HKCategoryTypeIdentifierConstipation";
  HKCategoryTypeIdentifier["coughing"] = "HKCategoryTypeIdentifierCoughing";
  HKCategoryTypeIdentifier["diarrhea"] = "HKCategoryTypeIdentifierDiarrhea";
  HKCategoryTypeIdentifier["dizziness"] = "HKCategoryTypeIdentifierDizziness";
  HKCategoryTypeIdentifier["drySkin"] = "HKCategoryTypeIdentifierDrySkin";
  HKCategoryTypeIdentifier["fainting"] = "HKCategoryTypeIdentifierFainting";
  HKCategoryTypeIdentifier["fatigue"] = "HKCategoryTypeIdentifierFatigue";
  HKCategoryTypeIdentifier["fever"] = "HKCategoryTypeIdentifierFever";
  HKCategoryTypeIdentifier["generalizedBodyAche"] = "HKCategoryTypeIdentifierGeneralizedBodyAche";
  HKCategoryTypeIdentifier["hairLoss"] = "HKCategoryTypeIdentifierHairLoss";
  HKCategoryTypeIdentifier["headache"] = "HKCategoryTypeIdentifierHeadache";
  HKCategoryTypeIdentifier["heartburn"] = "HKCategoryTypeIdentifierHeartburn";
  HKCategoryTypeIdentifier["hotFlashes"] = "HKCategoryTypeIdentifierHotFlashes";
  HKCategoryTypeIdentifier["lossOfSmell"] = "HKCategoryTypeIdentifierLossOfSmell";
  HKCategoryTypeIdentifier["lossOfTaste"] = "HKCategoryTypeIdentifierLossOfTaste";
  HKCategoryTypeIdentifier["lowerBackPain"] = "HKCategoryTypeIdentifierLowerBackPain";
  HKCategoryTypeIdentifier["memoryLapse"] = "HKCategoryTypeIdentifierMemoryLapse";
  HKCategoryTypeIdentifier["moodChanges"] = "HKCategoryTypeIdentifierMoodChanges";
  HKCategoryTypeIdentifier["nausea"] = "HKCategoryTypeIdentifierNausea";
  HKCategoryTypeIdentifier["nightSweats"] = "HKCategoryTypeIdentifierNightSweats";
  HKCategoryTypeIdentifier["pelvicPain"] = "HKCategoryTypeIdentifierPelvicPain";
  HKCategoryTypeIdentifier["rapidPoundingOrFlutteringHeartbeat"] = "HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat";
  HKCategoryTypeIdentifier["runnyNose"] = "HKCategoryTypeIdentifierRunnyNose";
  HKCategoryTypeIdentifier["shortnessOfBreath"] = "HKCategoryTypeIdentifierShortnessOfBreath";
  HKCategoryTypeIdentifier["sinusCongestion"] = "HKCategoryTypeIdentifierSinusCongestion";
  HKCategoryTypeIdentifier["skippedHeartbeat"] = "HKCategoryTypeIdentifierSkippedHeartbeat";
  HKCategoryTypeIdentifier["sleepChanges"] = "HKCategoryTypeIdentifierSleepChanges";
  HKCategoryTypeIdentifier["soreThroat"] = "HKCategoryTypeIdentifierSoreThroat";
  HKCategoryTypeIdentifier["vaginalDryness"] = "HKCategoryTypeIdentifierVaginalDryness";
  HKCategoryTypeIdentifier["vomiting"] = "HKCategoryTypeIdentifierVomiting";
  HKCategoryTypeIdentifier["wheezing"] = "HKCategoryTypeIdentifierWheezing";
  return HKCategoryTypeIdentifier;
}({}); // HKCategoryValueSeverity
export let HKCategoryValueAppleStandHour = /*#__PURE__*/function (HKCategoryValueAppleStandHour) {
  HKCategoryValueAppleStandHour[HKCategoryValueAppleStandHour["stood"] = 0] = "stood";
  HKCategoryValueAppleStandHour[HKCategoryValueAppleStandHour["idle"] = 1] = "idle";
  return HKCategoryValueAppleStandHour;
}({});
export let HKWorkoutActivityType = /*#__PURE__*/function (HKWorkoutActivityType) {
  HKWorkoutActivityType[HKWorkoutActivityType["americanFootball"] = 1] = "americanFootball";
  HKWorkoutActivityType[HKWorkoutActivityType["archery"] = 2] = "archery";
  HKWorkoutActivityType[HKWorkoutActivityType["australianFootball"] = 3] = "australianFootball";
  HKWorkoutActivityType[HKWorkoutActivityType["badminton"] = 4] = "badminton";
  HKWorkoutActivityType[HKWorkoutActivityType["baseball"] = 5] = "baseball";
  HKWorkoutActivityType[HKWorkoutActivityType["basketball"] = 6] = "basketball";
  HKWorkoutActivityType[HKWorkoutActivityType["bowling"] = 7] = "bowling";
  HKWorkoutActivityType[HKWorkoutActivityType["boxing"] = 8] = "boxing";
  HKWorkoutActivityType[HKWorkoutActivityType["climbing"] = 9] = "climbing";
  HKWorkoutActivityType[HKWorkoutActivityType["cricket"] = 10] = "cricket";
  HKWorkoutActivityType[HKWorkoutActivityType["crossTraining"] = 11] = "crossTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["curling"] = 12] = "curling";
  HKWorkoutActivityType[HKWorkoutActivityType["cycling"] = 13] = "cycling";
  HKWorkoutActivityType[HKWorkoutActivityType["dance"] = 14] = "dance";
  HKWorkoutActivityType[HKWorkoutActivityType["danceInspiredTraining"] = 15] = "danceInspiredTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["elliptical"] = 16] = "elliptical";
  HKWorkoutActivityType[HKWorkoutActivityType["equestrianSports"] = 17] = "equestrianSports";
  HKWorkoutActivityType[HKWorkoutActivityType["fencing"] = 18] = "fencing";
  HKWorkoutActivityType[HKWorkoutActivityType["fishing"] = 19] = "fishing";
  HKWorkoutActivityType[HKWorkoutActivityType["functionalStrengthTraining"] = 20] = "functionalStrengthTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["golf"] = 21] = "golf";
  HKWorkoutActivityType[HKWorkoutActivityType["gymnastics"] = 22] = "gymnastics";
  HKWorkoutActivityType[HKWorkoutActivityType["handball"] = 23] = "handball";
  HKWorkoutActivityType[HKWorkoutActivityType["hiking"] = 24] = "hiking";
  HKWorkoutActivityType[HKWorkoutActivityType["hockey"] = 25] = "hockey";
  HKWorkoutActivityType[HKWorkoutActivityType["hunting"] = 26] = "hunting";
  HKWorkoutActivityType[HKWorkoutActivityType["lacrosse"] = 27] = "lacrosse";
  HKWorkoutActivityType[HKWorkoutActivityType["martialArts"] = 28] = "martialArts";
  HKWorkoutActivityType[HKWorkoutActivityType["mindAndBody"] = 29] = "mindAndBody";
  HKWorkoutActivityType[HKWorkoutActivityType["mixedMetabolicCardioTraining"] = 30] = "mixedMetabolicCardioTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["paddleSports"] = 31] = "paddleSports";
  HKWorkoutActivityType[HKWorkoutActivityType["play"] = 32] = "play";
  HKWorkoutActivityType[HKWorkoutActivityType["preparationAndRecovery"] = 33] = "preparationAndRecovery";
  HKWorkoutActivityType[HKWorkoutActivityType["racquetball"] = 34] = "racquetball";
  HKWorkoutActivityType[HKWorkoutActivityType["rowing"] = 35] = "rowing";
  HKWorkoutActivityType[HKWorkoutActivityType["rugby"] = 36] = "rugby";
  HKWorkoutActivityType[HKWorkoutActivityType["running"] = 37] = "running";
  HKWorkoutActivityType[HKWorkoutActivityType["sailing"] = 38] = "sailing";
  HKWorkoutActivityType[HKWorkoutActivityType["skatingSports"] = 39] = "skatingSports";
  HKWorkoutActivityType[HKWorkoutActivityType["snowSports"] = 40] = "snowSports";
  HKWorkoutActivityType[HKWorkoutActivityType["soccer"] = 41] = "soccer";
  HKWorkoutActivityType[HKWorkoutActivityType["softball"] = 42] = "softball";
  HKWorkoutActivityType[HKWorkoutActivityType["squash"] = 43] = "squash";
  HKWorkoutActivityType[HKWorkoutActivityType["stairClimbing"] = 44] = "stairClimbing";
  HKWorkoutActivityType[HKWorkoutActivityType["surfingSports"] = 45] = "surfingSports";
  HKWorkoutActivityType[HKWorkoutActivityType["swimming"] = 46] = "swimming";
  HKWorkoutActivityType[HKWorkoutActivityType["tableTennis"] = 47] = "tableTennis";
  HKWorkoutActivityType[HKWorkoutActivityType["tennis"] = 48] = "tennis";
  HKWorkoutActivityType[HKWorkoutActivityType["trackAndField"] = 49] = "trackAndField";
  HKWorkoutActivityType[HKWorkoutActivityType["traditionalStrengthTraining"] = 50] = "traditionalStrengthTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["volleyball"] = 51] = "volleyball";
  HKWorkoutActivityType[HKWorkoutActivityType["walking"] = 52] = "walking";
  HKWorkoutActivityType[HKWorkoutActivityType["waterFitness"] = 53] = "waterFitness";
  HKWorkoutActivityType[HKWorkoutActivityType["waterPolo"] = 54] = "waterPolo";
  HKWorkoutActivityType[HKWorkoutActivityType["waterSports"] = 55] = "waterSports";
  HKWorkoutActivityType[HKWorkoutActivityType["wrestling"] = 56] = "wrestling";
  HKWorkoutActivityType[HKWorkoutActivityType["yoga"] = 57] = "yoga";
  HKWorkoutActivityType[HKWorkoutActivityType["barre"] = 58] = "barre";
  HKWorkoutActivityType[HKWorkoutActivityType["coreTraining"] = 59] = "coreTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["crossCountrySkiing"] = 60] = "crossCountrySkiing";
  HKWorkoutActivityType[HKWorkoutActivityType["downhillSkiing"] = 61] = "downhillSkiing";
  HKWorkoutActivityType[HKWorkoutActivityType["flexibility"] = 62] = "flexibility";
  HKWorkoutActivityType[HKWorkoutActivityType["highIntensityIntervalTraining"] = 63] = "highIntensityIntervalTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["jumpRope"] = 64] = "jumpRope";
  HKWorkoutActivityType[HKWorkoutActivityType["kickboxing"] = 65] = "kickboxing";
  HKWorkoutActivityType[HKWorkoutActivityType["pilates"] = 66] = "pilates";
  HKWorkoutActivityType[HKWorkoutActivityType["snowboarding"] = 67] = "snowboarding";
  HKWorkoutActivityType[HKWorkoutActivityType["stairs"] = 68] = "stairs";
  HKWorkoutActivityType[HKWorkoutActivityType["stepTraining"] = 69] = "stepTraining";
  HKWorkoutActivityType[HKWorkoutActivityType["wheelchairWalkPace"] = 70] = "wheelchairWalkPace";
  HKWorkoutActivityType[HKWorkoutActivityType["wheelchairRunPace"] = 71] = "wheelchairRunPace";
  HKWorkoutActivityType[HKWorkoutActivityType["taiChi"] = 72] = "taiChi";
  HKWorkoutActivityType[HKWorkoutActivityType["mixedCardio"] = 73] = "mixedCardio";
  HKWorkoutActivityType[HKWorkoutActivityType["handCycling"] = 74] = "handCycling";
  HKWorkoutActivityType[HKWorkoutActivityType["discSports"] = 75] = "discSports";
  HKWorkoutActivityType[HKWorkoutActivityType["fitnessGaming"] = 76] = "fitnessGaming";
  HKWorkoutActivityType[HKWorkoutActivityType["other"] = 3000] = "other";
  return HKWorkoutActivityType;
}({});
// documented at https://developer.apple.com/documentation/healthkit/hkweathercondition
export let HKWeatherCondition = /*#__PURE__*/function (HKWeatherCondition) {
  HKWeatherCondition[HKWeatherCondition["none"] = 0] = "none";
  HKWeatherCondition[HKWeatherCondition["clear"] = 1] = "clear";
  HKWeatherCondition[HKWeatherCondition["fair"] = 2] = "fair";
  HKWeatherCondition[HKWeatherCondition["partlyCloudy"] = 3] = "partlyCloudy";
  HKWeatherCondition[HKWeatherCondition["mostlyCloudy"] = 4] = "mostlyCloudy";
  HKWeatherCondition[HKWeatherCondition["cloudy"] = 5] = "cloudy";
  HKWeatherCondition[HKWeatherCondition["foggy"] = 6] = "foggy";
  HKWeatherCondition[HKWeatherCondition["haze"] = 7] = "haze";
  HKWeatherCondition[HKWeatherCondition["windy"] = 8] = "windy";
  HKWeatherCondition[HKWeatherCondition["blustery"] = 9] = "blustery";
  HKWeatherCondition[HKWeatherCondition["smoky"] = 10] = "smoky";
  HKWeatherCondition[HKWeatherCondition["dust"] = 11] = "dust";
  HKWeatherCondition[HKWeatherCondition["snow"] = 12] = "snow";
  HKWeatherCondition[HKWeatherCondition["hail"] = 13] = "hail";
  HKWeatherCondition[HKWeatherCondition["sleet"] = 14] = "sleet";
  HKWeatherCondition[HKWeatherCondition["freezingDrizzle"] = 15] = "freezingDrizzle";
  HKWeatherCondition[HKWeatherCondition["freezingRain"] = 16] = "freezingRain";
  HKWeatherCondition[HKWeatherCondition["mixedRainAndHail"] = 17] = "mixedRainAndHail";
  HKWeatherCondition[HKWeatherCondition["mixedRainAndSnow"] = 18] = "mixedRainAndSnow";
  HKWeatherCondition[HKWeatherCondition["mixedRainAndSleet"] = 19] = "mixedRainAndSleet";
  HKWeatherCondition[HKWeatherCondition["mixedSnowAndSleet"] = 20] = "mixedSnowAndSleet";
  HKWeatherCondition[HKWeatherCondition["drizzle"] = 21] = "drizzle";
  HKWeatherCondition[HKWeatherCondition["scatteredShowers"] = 22] = "scatteredShowers";
  HKWeatherCondition[HKWeatherCondition["showers"] = 23] = "showers";
  HKWeatherCondition[HKWeatherCondition["thunderstorms"] = 24] = "thunderstorms";
  HKWeatherCondition[HKWeatherCondition["tropicalStorm"] = 25] = "tropicalStorm";
  HKWeatherCondition[HKWeatherCondition["hurricane"] = 26] = "hurricane";
  HKWeatherCondition[HKWeatherCondition["tornado"] = 27] = "tornado";
  return HKWeatherCondition;
}({});
var HKIndoorWorkout = /*#__PURE__*/function (HKIndoorWorkout) {
  HKIndoorWorkout[HKIndoorWorkout["false"] = 0] = "false";
  HKIndoorWorkout[HKIndoorWorkout["true"] = 1] = "true";
  return HKIndoorWorkout;
}(HKIndoorWorkout || {});
/**
 * See https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus
 */
export let HKAuthorizationRequestStatus = /*#__PURE__*/function (HKAuthorizationRequestStatus) {
  HKAuthorizationRequestStatus[HKAuthorizationRequestStatus["unknown"] = 0] = "unknown";
  HKAuthorizationRequestStatus[HKAuthorizationRequestStatus["shouldRequest"] = 1] = "shouldRequest";
  HKAuthorizationRequestStatus[HKAuthorizationRequestStatus["unnecessary"] = 2] = "unnecessary";
  return HKAuthorizationRequestStatus;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkauthorizationstatus
 */
export let HKAuthorizationStatus = /*#__PURE__*/function (HKAuthorizationStatus) {
  HKAuthorizationStatus[HKAuthorizationStatus["notDetermined"] = 0] = "notDetermined";
  HKAuthorizationStatus[HKAuthorizationStatus["sharingDenied"] = 1] = "sharingDenied";
  HKAuthorizationStatus[HKAuthorizationStatus["sharingAuthorized"] = 2] = "sharingAuthorized";
  return HKAuthorizationStatus;
}({});
/**
 * See https://developer.apple.com/documentation/healthkit/hkbloodtype
 */
export let HKBloodType = /*#__PURE__*/function (HKBloodType) {
  HKBloodType[HKBloodType["notSet"] = 0] = "notSet";
  HKBloodType[HKBloodType["aPositive"] = 1] = "aPositive";
  HKBloodType[HKBloodType["aNegative"] = 2] = "aNegative";
  HKBloodType[HKBloodType["bPositive"] = 3] = "bPositive";
  HKBloodType[HKBloodType["bNegative"] = 4] = "bNegative";
  HKBloodType[HKBloodType["abPositive"] = 5] = "abPositive";
  HKBloodType[HKBloodType["abNegative"] = 6] = "abNegative";
  HKBloodType[HKBloodType["oPositive"] = 7] = "oPositive";
  HKBloodType[HKBloodType["oNegative"] = 8] = "oNegative";
  return HKBloodType;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkbiologicalsex
 */
export let HKBiologicalSex = /*#__PURE__*/function (HKBiologicalSex) {
  HKBiologicalSex[HKBiologicalSex["notSet"] = 0] = "notSet";
  HKBiologicalSex[HKBiologicalSex["female"] = 1] = "female";
  HKBiologicalSex[HKBiologicalSex["male"] = 2] = "male";
  HKBiologicalSex[HKBiologicalSex["other"] = 3] = "other";
  return HKBiologicalSex;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkfitzpatrickskintype
 */
export let HKFitzpatrickSkinType = /*#__PURE__*/function (HKFitzpatrickSkinType) {
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["notSet"] = 0] = "notSet";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["I"] = 1] = "I";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["II"] = 2] = "II";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["III"] = 3] = "III";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["IV"] = 4] = "IV";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["V"] = 5] = "V";
  HKFitzpatrickSkinType[HKFitzpatrickSkinType["VI"] = 6] = "VI";
  return HKFitzpatrickSkinType;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkstatisticsoptions
 */
export let HKStatisticsOptions = /*#__PURE__*/function (HKStatisticsOptions) {
  HKStatisticsOptions["cumulativeSum"] = "cumulativeSum";
  HKStatisticsOptions["discreteAverage"] = "discreteAverage";
  HKStatisticsOptions["discreteMax"] = "discreteMax";
  HKStatisticsOptions["discreteMin"] = "discreteMin";
  HKStatisticsOptions["discreteMostRecent"] = "discreteMostRecent";
  HKStatisticsOptions["duration"] = "duration";
  HKStatisticsOptions["mostRecent"] = "mostRecent";
  HKStatisticsOptions["separateBySource"] = "separateBySource";
  return HKStatisticsOptions;
}({});
/**
 * https://developer.apple.com/documentation/healthkit/hkcategoryvaluecervicalmucusquality
 */
export let HKCategoryValueCervicalMucusQuality = /*#__PURE__*/function (HKCategoryValueCervicalMucusQuality) {
  HKCategoryValueCervicalMucusQuality[HKCategoryValueCervicalMucusQuality["dry"] = 1] = "dry";
  HKCategoryValueCervicalMucusQuality[HKCategoryValueCervicalMucusQuality["sticky"] = 2] = "sticky";
  HKCategoryValueCervicalMucusQuality[HKCategoryValueCervicalMucusQuality["creamy"] = 3] = "creamy";
  HKCategoryValueCervicalMucusQuality[HKCategoryValueCervicalMucusQuality["watery"] = 4] = "watery";
  HKCategoryValueCervicalMucusQuality[HKCategoryValueCervicalMucusQuality["eggWhite"] = 5] = "eggWhite";
  return HKCategoryValueCervicalMucusQuality;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvaluemenstrualflow
 */
export let HKCategoryValueMenstrualFlow = /*#__PURE__*/function (HKCategoryValueMenstrualFlow) {
  HKCategoryValueMenstrualFlow[HKCategoryValueMenstrualFlow["unspecified"] = 1] = "unspecified";
  HKCategoryValueMenstrualFlow[HKCategoryValueMenstrualFlow["none"] = 5] = "none";
  HKCategoryValueMenstrualFlow[HKCategoryValueMenstrualFlow["light"] = 2] = "light";
  HKCategoryValueMenstrualFlow[HKCategoryValueMenstrualFlow["medium"] = 3] = "medium";
  HKCategoryValueMenstrualFlow[HKCategoryValueMenstrualFlow["heavy"] = 4] = "heavy";
  return HKCategoryValueMenstrualFlow;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvalueovulationtestresult
 */
export let HKCategoryValueOvulationTestResult = /*#__PURE__*/function (HKCategoryValueOvulationTestResult) {
  HKCategoryValueOvulationTestResult[HKCategoryValueOvulationTestResult["negative"] = 1] = "negative";
  HKCategoryValueOvulationTestResult[HKCategoryValueOvulationTestResult["luteinizingHormoneSurge"] = 2] = "luteinizingHormoneSurge";
  HKCategoryValueOvulationTestResult[HKCategoryValueOvulationTestResult["indeterminate"] = 3] = "indeterminate";
  HKCategoryValueOvulationTestResult[HKCategoryValueOvulationTestResult["estrogenSurge"] = 4] = "estrogenSurge";
  return HKCategoryValueOvulationTestResult;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis
 */
export let HKCategoryValueSleepAnalysis = /*#__PURE__*/function (HKCategoryValueSleepAnalysis) {
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["inBed"] = 0] = "inBed";
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["asleepUnspecified"] = 1] = "asleepUnspecified";
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["awake"] = 2] = "awake";
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["asleepCore"] = 3] = "asleepCore";
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["asleepDeep"] = 4] = "asleepDeep";
  HKCategoryValueSleepAnalysis[HKCategoryValueSleepAnalysis["asleepREM"] = 5] = "asleepREM";
  return HKCategoryValueSleepAnalysis;
}({});

/**
 * https://developer.apple.com/documentation/healthkit/hkcategoryvalueappetitechanges
 */
export let HKCategoryValueAppetiteChanges = /*#__PURE__*/function (HKCategoryValueAppetiteChanges) {
  HKCategoryValueAppetiteChanges[HKCategoryValueAppetiteChanges["decreased"] = 2] = "decreased";
  HKCategoryValueAppetiteChanges[HKCategoryValueAppetiteChanges["increased"] = 3] = "increased";
  HKCategoryValueAppetiteChanges[HKCategoryValueAppetiteChanges["noChange"] = 1] = "noChange";
  HKCategoryValueAppetiteChanges[HKCategoryValueAppetiteChanges["unspecified"] = 0] = "unspecified";
  return HKCategoryValueAppetiteChanges;
}({});

/**
 * https://developer.apple.com/documentation/healthkit/hkcategoryvaluepresence
 */
export let HKCategoryValuePresence = /*#__PURE__*/function (HKCategoryValuePresence) {
  HKCategoryValuePresence[HKCategoryValuePresence["notPresent"] = 1] = "notPresent";
  HKCategoryValuePresence[HKCategoryValuePresence["present"] = 0] = "present";
  return HKCategoryValuePresence;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvalueseverity
 */
export let HKCategoryValueSeverity = /*#__PURE__*/function (HKCategoryValueSeverity) {
  HKCategoryValueSeverity[HKCategoryValueSeverity["notPresent"] = 1] = "notPresent";
  HKCategoryValueSeverity[HKCategoryValueSeverity["mild"] = 2] = "mild";
  HKCategoryValueSeverity[HKCategoryValueSeverity["moderate"] = 3] = "moderate";
  HKCategoryValueSeverity[HKCategoryValueSeverity["severe"] = 4] = "severe";
  HKCategoryValueSeverity[HKCategoryValueSeverity["unspecified"] = 0] = "unspecified";
  return HKCategoryValueSeverity;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvalue/notapplicable
 */
export let HKCategoryValueNotApplicable = /*#__PURE__*/function (HKCategoryValueNotApplicable) {
  HKCategoryValueNotApplicable[HKCategoryValueNotApplicable["notApplicable"] = 0] = "notApplicable";
  return HKCategoryValueNotApplicable;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvalue
 */

/**
 * See https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason
 */
export let HKInsulinDeliveryReason = /*#__PURE__*/function (HKInsulinDeliveryReason) {
  HKInsulinDeliveryReason[HKInsulinDeliveryReason["basal"] = 1] = "basal";
  HKInsulinDeliveryReason[HKInsulinDeliveryReason["bolus"] = 2] = "bolus";
  return HKInsulinDeliveryReason;
}({});
/**
 * See https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult
 */
var HKCategoryValuePregnancyTestResult = /*#__PURE__*/function (HKCategoryValuePregnancyTestResult) {
  HKCategoryValuePregnancyTestResult[HKCategoryValuePregnancyTestResult["positive"] = 2] = "positive";
  HKCategoryValuePregnancyTestResult[HKCategoryValuePregnancyTestResult["negative"] = 1] = "negative";
  HKCategoryValuePregnancyTestResult[HKCategoryValuePregnancyTestResult["indeterminate"] = 3] = "indeterminate";
  return HKCategoryValuePregnancyTestResult;
}(HKCategoryValuePregnancyTestResult || {});
/* needs further mapping

contraceptive = 'HKCategoryTypeIdentifierContraceptive',
  lactation = 'HKCategoryTypeIdentifierLactation',
  pregnancy = 'HKCategoryTypeIdentifierPregnancy',

  progesteroneTestResult = 'HKCategoryTypeIdentifierProgesteroneTestResult',
  environmentalAudioExposureEvent = 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent',
  headphoneAudioExposureEvent = 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
  appleWalkingSteadinessEvent = 'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent',
  handwashingEvent = 'HKCategoryTypeIdentifierHandwashingEvent', // HKCategoryValue */
// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export let HKWheelchairUse = /*#__PURE__*/function (HKWheelchairUse) {
  HKWheelchairUse[HKWheelchairUse["notSet"] = 0] = "notSet";
  HKWheelchairUse[HKWheelchairUse["no"] = 1] = "no";
  HKWheelchairUse[HKWheelchairUse["yes"] = 2] = "yes";
  return HKWheelchairUse;
}({});

// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export let HKMetricPrefix = /*#__PURE__*/function (HKMetricPrefix) {
  HKMetricPrefix["None"] = "";
  HKMetricPrefix["Pico"] = "p";
  HKMetricPrefix["Nano"] = "n";
  HKMetricPrefix["Micro"] = "mc";
  HKMetricPrefix["Milli"] = "m";
  HKMetricPrefix["Centi"] = "c";
  HKMetricPrefix["Deci"] = "d";
  HKMetricPrefix["Deca"] = "da";
  HKMetricPrefix["Hecto"] = "h";
  HKMetricPrefix["Kilo"] = "k";
  HKMetricPrefix["Mega"] = "M";
  HKMetricPrefix["Giga"] = "G";
  HKMetricPrefix["Tera"] = "T";
  HKMetricPrefix["Femto"] = "f";
  return HKMetricPrefix;
}({});
export let HKUnitMetric = /*#__PURE__*/function (HKUnitMetric) {
  HKUnitMetric["Gram"] = "g";
  HKUnitMetric["Joule"] = "J";
  HKUnitMetric["Kelvin"] = "K";
  HKUnitMetric["Liter"] = "l";
  HKUnitMetric["Meter"] = "m";
  HKUnitMetric["Pascal"] = "Pa";
  HKUnitMetric["Second"] = "s";
  HKUnitMetric["Siemen"] = "S";
  HKUnitMetric["Hertz"] = "Hz";
  HKUnitMetric["Volt"] = "V";
  return HKUnitMetric;
}({});
export let HKUnits = /*#__PURE__*/function (HKUnits) {
  HKUnits["DecibelHearingLevel"] = "dBHL";
  HKUnits["DecibelSoundPressureLevel"] = "dBASPL";
  HKUnits["Percent"] = "%";
  HKUnits["Count"] = "count";
  HKUnits["InternationalUnit"] = "IU";
  return HKUnits;
}({});

// not 100% sure about these

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'cm', 'km'
 */
export let UnitOfLength = /*#__PURE__*/function (UnitOfLength) {
  UnitOfLength["Feet"] = "ft";
  UnitOfLength["Meter"] = "m";
  UnitOfLength["Inches"] = "in";
  UnitOfLength["Yards"] = "yd";
  UnitOfLength["Miles"] = "mi";
  return UnitOfLength;
}({});
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ml', 'cl'
 */
export let UnitOfVolume = /*#__PURE__*/function (UnitOfVolume) {
  UnitOfVolume["ImperialCup"] = "cup_imp";
  UnitOfVolume["ImperialFluidOunces"] = "fl_oz_imp";
  UnitOfVolume["ImperialPint"] = "pt_imp";
  UnitOfVolume["USCup"] = "cup_us";
  UnitOfVolume["USFluidOunces"] = "fl_oz_us";
  UnitOfVolume["USPint"] = "pt_us";
  UnitOfVolume["Liter"] = "l";
  return UnitOfVolume;
}({});
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export let UnitOfMass = /*#__PURE__*/function (UnitOfMass) {
  UnitOfMass["Ounces"] = "oz";
  UnitOfMass["Stones"] = "st";
  UnitOfMass["Pounds"] = "lb";
  UnitOfMass["Gram"] = "g";
  return UnitOfMass;
}({});
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export let UnitOfPressure = /*#__PURE__*/function (UnitOfPressure) {
  UnitOfPressure["Atmospheres"] = "atm";
  UnitOfPressure["CentimetersOfWater"] = "cmAq";
  UnitOfPressure["MillimetersOfMercury"] = "mmHg";
  UnitOfPressure["InchesOfMercury"] = "inHg";
  UnitOfPressure["DecibelAWeightedSoundPressureLevel"] = "dBASPL";
  UnitOfPressure["Pascals"] = "Pa";
  return UnitOfPressure;
}({});

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export let UnitOfTime = /*#__PURE__*/function (UnitOfTime) {
  UnitOfTime["Days"] = "d";
  UnitOfTime["Minutes"] = "min";
  UnitOfTime["Hours"] = "hr";
  UnitOfTime["Seconds"] = "s";
  return UnitOfTime;
}({});
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */

export let TemperatureUnit = /*#__PURE__*/function (TemperatureUnit) {
  TemperatureUnit["DegreesCelsius"] = "degC";
  TemperatureUnit["DegreesFahrenheit"] = "degF";
  TemperatureUnit["Kelvin"] = "K";
  return TemperatureUnit;
}({});

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kJ'
 */
export let UnitOfEnergy = /*#__PURE__*/function (UnitOfEnergy) {
  UnitOfEnergy["Kilocalories"] = "kcal";
  UnitOfEnergy["LargeCalories"] = "Cal";
  UnitOfEnergy["SmallCalories"] = "cal";
  UnitOfEnergy["Joules"] = "J";
  return UnitOfEnergy;
}({});
export let BloodGlucoseUnit = /*#__PURE__*/function (BloodGlucoseUnit) {
  BloodGlucoseUnit["GlucoseMmolPerL"] = "mmol<180.15588000005408>/l";
  BloodGlucoseUnit["GlucoseMgPerDl"] = "mg/dL";
  return BloodGlucoseUnit;
}({});

/**
 * See https://developer.apple.com/documentation/healthkit/hkdevice
 */

/**
 * See https://developer.apple.com/documentation/healthkit/hkobject/1615781-source
 */

/**
 * See https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision
 */

/**
 * See https://developer.apple.com/documentation/healthkit/hkquantitysample
 */

// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export let HKCharacteristicTypeIdentifier = /*#__PURE__*/function (HKCharacteristicTypeIdentifier) {
  HKCharacteristicTypeIdentifier["fitzpatrickSkinType"] = "HKCharacteristicTypeIdentifierFitzpatrickSkinType";
  HKCharacteristicTypeIdentifier["biologicalSex"] = "HKCharacteristicTypeIdentifierBiologicalSex";
  HKCharacteristicTypeIdentifier["bloodType"] = "HKCharacteristicTypeIdentifierBloodType";
  HKCharacteristicTypeIdentifier["dateOfBirth"] = "HKCharacteristicTypeIdentifierDateOfBirth";
  HKCharacteristicTypeIdentifier["wheelchairUse"] = "HKCharacteristicTypeIdentifierWheelchairUse";
  HKCharacteristicTypeIdentifier["activityMoveMode"] = "HKCharacteristicTypeIdentifierActivityMoveMode";
  return HKCharacteristicTypeIdentifier;
}({}); // HKActivityMoveModeObject
/** See https://developer.apple.com/documentation/healthkit/hkupdatefrequency */
export let HKUpdateFrequency = /*#__PURE__*/function (HKUpdateFrequency) {
  HKUpdateFrequency[HKUpdateFrequency["immediate"] = 1] = "immediate";
  HKUpdateFrequency[HKUpdateFrequency["hourly"] = 2] = "hourly";
  HKUpdateFrequency[HKUpdateFrequency["daily"] = 3] = "daily";
  HKUpdateFrequency[HKUpdateFrequency["weekly"] = 4] = "weekly";
  return HKUpdateFrequency;
}({});
const Native = NativeModules.ReactNativeHealthkit;
export const EventEmitter = new NativeEventEmitter(NativeModules.ReactNativeHealthkit);
export default Native;
//# sourceMappingURL=native-types.js.map