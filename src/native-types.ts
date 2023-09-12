import { NativeEventEmitter, NativeModules } from 'react-native'

import type { EmitterSubscription, NativeModule } from 'react-native'

/**
 * Represents a workout type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkouttypeidentifier Apple Docs HKWorkoutTypeIdentifier}
 */
export const HKWorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier' as const

/**
 * Represents a type that identifies activity summary objects.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummarytype Apple Docs HKActivitySummaryType}
 */
export const HKActivitySummaryTypeIdentifier = 'HKActivitySummaryTypeIdentifier' as const

/**
 * Represents an audiogram type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKAudiogramSampleType Apple Docs HKAudiogramSampleType}
 */
export const HKAudiogramTypeIdentifier = 'HKAudiogramSampleType' as const

/**
 * Represents a workout route type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutroutetypeidentifier Apple Docs HKWorkoutRouteTypeIdentifier}
 */
export const HKWorkoutRouteTypeIdentifier = 'HKWorkoutRouteTypeIdentifier' as const

/**
 * Represents a series sample containing heartbeat data..
 * @see {@link https://developer.apple.com/documentation/healthkit/HKDataTypeIdentifierHeartbeatSeries Apple Docs HKDataTypeIdentifierHeartbeatSeries}
 */
export declare const HKDataTypeIdentifierHeartbeatSeries: 'HKDataTypeIdentifierHeartbeatSeries'

/**
 * Represents a quantity type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier Apple Docs HKQuantityTypeIdentifier}
 */
export enum HKQuantityTypeIdentifier {
  /**
   * Body Mass Index
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodymassindex Apple Docs HKQuantityTypeIdentifierBodyMassIndex}
   */
  bodyMassIndex = 'HKQuantityTypeIdentifierBodyMassIndex',

  /**
   * Body Fat Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodyfatpercentage Apple Docs HKQuantityTypeIdentifierBodyFatPercentage}
   */
  bodyFatPercentage = 'HKQuantityTypeIdentifierBodyFatPercentage',

  /**
   * Height
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheight Apple Docs HKQuantityTypeIdentifierHeight}
   */
  height = 'HKQuantityTypeIdentifierHeight',

  /**
   * Body Mass
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodymass Apple Docs HKQuantityTypeIdentifierBodyMass}
   */
  bodyMass = 'HKQuantityTypeIdentifierBodyMass',

  /**
   * Lean Body Mass
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierleanbodymass Apple Docs HKQuantityTypeIdentifierLeanBodyMass}
   */
  leanBodyMass = 'HKQuantityTypeIdentifierLeanBodyMass',

  /**
   * Waist Circumference
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwaistcircumference Apple Docs HKQuantityTypeIdentifierWaistCircumference}
   */
  waistCircumference = 'HKQuantityTypeIdentifierWaistCircumference',

  /**
   * Step Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstepcount Apple Docs HKQuantityTypeIdentifierStepCount}
   */
  stepCount = 'HKQuantityTypeIdentifierStepCount',

  /**
   * Distance Walking Running
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancewalkingrunning Apple Docs HKQuantityTypeIdentifierDistanceWalkingRunning}
   */
  distanceWalkingRunning = 'HKQuantityTypeIdentifierDistanceWalkingRunning',

  /**
   * Distance Cycling
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancecycling Apple Docs HKQuantityTypeIdentifierDistanceCycling}
   */
  distanceCycling = 'HKQuantityTypeIdentifierDistanceCycling',

  /**
   * Distance Wheelchair
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancewheelchair Apple Docs HKQuantityTypeIdentifierDistanceWheelchair}
   */
  distanceWheelchair = 'HKQuantityTypeIdentifierDistanceWheelchair',
  /**
   * Basal Energy Burned
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbasalenergyburned Apple Docs HKQuantityTypeIdentifierBasalEnergyBurned}
   */
  basalEnergyBurned = 'HKQuantityTypeIdentifierBasalEnergyBurned', // Energy,                      Cumulative
  /**
   * Active Energy Burned
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieractiveenergyburned Apple Docs HKQuantityTypeIdentifierActiveEnergyBurned}
   */
  activeEnergyBurned = 'HKQuantityTypeIdentifierActiveEnergyBurned', // Energy,                      Cumulative
  /**
   * Flights Climbed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierflightsclimbed Apple Docs HKQuantityTypeIdentifierFlightsClimbed}
   */
  flightsClimbed = 'HKQuantityTypeIdentifierFlightsClimbed', // Scalar(Count),               Cumulative
  /**
   * Nike Fuel
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernikefuel Apple Docs HKQuantityTypeIdentifierNikeFuel}
   */
  nikeFuel = 'HKQuantityTypeIdentifierNikeFuel', // Scalar(Count),               Cumulative
  /**
   * Apple Exercise Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierappleexercisetime Apple Docs HKQuantityTypeIdentifierAppleExerciseTime}
   */
  appleExerciseTime = 'HKQuantityTypeIdentifierAppleExerciseTime', // Time                         Cumulative
  /**
   * Push Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierpushcount Apple Docs HKQuantityTypeIdentifierPushCount}
   */
  pushCount = 'HKQuantityTypeIdentifierPushCount', // Scalar(Count),               Cumulative
  /**
   * Distance Swimming
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistanceswimming Apple Docs HKQuantityTypeIdentifierDistanceSwimming}
   */
  distanceSwimming = 'HKQuantityTypeIdentifierDistanceSwimming', // Length,                      Cumulative
  /**
   * Swimming Stroke Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierswimmingstrokecount Apple Docs HKQuantityTypeIdentifierSwimmingStrokeCount}
   */
  swimmingStrokeCount = 'HKQuantityTypeIdentifierSwimmingStrokeCount', // Scalar(Count),               Cumulative
  /**
   * VO2 Max
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiervo2max Apple Docs HKQuantityTypeIdentifierVO2Max}
   */
  vo2Max = 'HKQuantityTypeIdentifierVO2Max', // ml/(kg*min)                  Discrete
  /**
   * Distance Downhill Snow Sports
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancedownhillsnowsports Apple Docs HKQuantityTypeIdentifierDistanceDownhillSnowSports}
   */
  distanceDownhillSnowSports = 'HKQuantityTypeIdentifierDistanceDownhillSnowSports', // Length,                      Cumulative

  /**
   * Apple Stand Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplestandtime Apple Docs HKQuantityTypeIdentifierAppleStandTime}
   */
  appleStandTime = 'HKQuantityTypeIdentifierAppleStandTime', // Time,                        Cumulative
  // Vitals
  /**
   * Heart Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartrate Apple Docs HKQuantityTypeIdentifierHeartRate}
   */
  heartRate = 'HKQuantityTypeIdentifierHeartRate', // Scalar(Count)/Time,          Discrete
  /**
   * Body Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodytemperature Apple Docs HKQuantityTypeIdentifierBodyTemperature}
   */
  bodyTemperature = 'HKQuantityTypeIdentifierBodyTemperature', // Temperature,                 Discrete
  /**
   * Basal Body Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbasalbodytemperature Apple Docs HKQuantityTypeIdentifierBasalBodyTemperature}
   */
  basalBodyTemperature = 'HKQuantityTypeIdentifierBasalBodyTemperature', // Basal Body Temperature,      Discrete
  /**
   * Blood Pressure Systolic
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodpressuresystolic Apple Docs HKQuantityTypeIdentifierBloodPressureSystolic}
   */
  bloodPressureSystolic = 'HKQuantityTypeIdentifierBloodPressureSystolic', // Pressure,                    Discrete
  /**
   * Blood Pressure Diastolic
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodpressurediastolic Apple Docs HKQuantityTypeIdentifierBloodPressureDiastolic}
   */
  bloodPressureDiastolic = 'HKQuantityTypeIdentifierBloodPressureDiastolic', // Pressure,                    Discrete
  /**
   * Respiratory Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrespiratoryrate Apple Docs HKQuantityTypeIdentifierRespiratoryRate}
   */
  respiratoryRate = 'HKQuantityTypeIdentifierRespiratoryRate', // Scalar(Count)/Time,          Discrete
  /**
   * Resting Heart Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrestingheartrate Apple Docs HKQuantityTypeIdentifierRestingHeartRate}
   */
  restingHeartRate = 'HKQuantityTypeIdentifierRestingHeartRate', // Scalar(Count)/Time,          Discrete
  /**
   * Walking Heart Rate Average
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingheartrateaverage Apple Docs HKQuantityTypeIdentifierWalkingHeartRateAverage}
   * @since iOS 11.0
   */
  walkingHeartRateAverage = 'HKQuantityTypeIdentifierWalkingHeartRateAverage', // Scalar(Count)/Time,          Discrete
  /**
   * Heart Rate Variability SDNN
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartratevariabilitysdnn Apple Docs HKQuantityTypeIdentifierHeartRateVariabilitySDNN}
   * @since iOS 11.0
   */
  heartRateVariabilitySDNN = 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN', // Time (ms),                   Discrete
  /**
   * Oxygen Saturation
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieroxygensaturation Apple Docs HKQuantityTypeIdentifierOxygenSaturation}
   * @since iOS 8.0
   */
  oxygenSaturation = 'HKQuantityTypeIdentifierOxygenSaturation',
  /**
   * Peripheral Perfusion Index
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierperipheralperfusionindex Apple Docs HKQuantityTypeIdentifierPeripheralPerfusionIndex}
   * @since iOS 8.0
   */
  peripheralPerfusionIndex = 'HKQuantityTypeIdentifierPeripheralPerfusionIndex', // Scalar(Percent, 0.0 - 1.0),  Discrete
  /**
   * Blood Glucose
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodglucose Apple Docs HKQuantityTypeIdentifierBloodGlucose}
   */
  bloodGlucose = 'HKQuantityTypeIdentifierBloodGlucose',

  /**
   * Number Of Times Fallen
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernumberoftimesfallen Apple Docs HKQuantityTypeIdentifierNumberOfTimesFallen}
   */
  numberOfTimesFallen = 'HKQuantityTypeIdentifierNumberOfTimesFallen',

  /**
   * Electrodermal Activity
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierelectrodermalactivity Apple Docs HKQuantityTypeIdentifierElectrodermalActivity}
   */
  electrodermalActivity = 'HKQuantityTypeIdentifierElectrodermalActivity',

  /**
   * Inhaler Usage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierinhalerusage Apple Docs HKQuantityTypeIdentifierInhalerUsage}
   * @since iOS 8
   */
  inhalerUsage = 'HKQuantityTypeIdentifierInhalerUsage',

  /**
   * Insulin Delivery
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierinsulindelivery Apple Docs HKQuantityTypeIdentifierInsulinDelivery}
   * @since iOS 11
   */
  insulinDelivery = 'HKQuantityTypeIdentifierInsulinDelivery',

  /**
   * Blood Alcohol Content
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodalcoholcontent Apple Docs HKQuantityTypeIdentifierBloodAlcoholContent}
   * @since iOS 8
   */
  bloodAlcoholContent = 'HKQuantityTypeIdentifierBloodAlcoholContent',

  /**
   * Forced Vital Capacity
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierforcedvitalcapacity Apple Docs HKQuantityTypeIdentifierForcedVitalCapacity}
   */
  forcedVitalCapacity = 'HKQuantityTypeIdentifierForcedVitalCapacity',

  /**
   * Forced Expiratory Volume1
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierforcedexpiratoryvolume1 Apple Docs HKQuantityTypeIdentifierForcedExpiratoryVolume1}
   * @since iOS 8
   */
  forcedExpiratoryVolume1 = 'HKQuantityTypeIdentifierForcedExpiratoryVolume1',

  /**
   * Peak Expiratory Flow Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierpeakexpiratoryflowrate Apple Docs HKQuantityTypeIdentifierPeakExpiratoryFlowRate}
   * @since iOS 8
   */
  peakExpiratoryFlowRate = 'HKQuantityTypeIdentifierPeakExpiratoryFlowRate',

  /**
   * Environmental Audio Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierenvironmentalaudioexposure Apple Docs HKQuantityTypeIdentifierEnvironmentalAudioExposure}
   * @since iOS 13
   */
  environmentalAudioExposure = 'HKQuantityTypeIdentifierEnvironmentalAudioExposure',

  /**
   * Headphone Audio Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheadphoneaudioexposure Apple Docs HKQuantityTypeIdentifierHeadphoneAudioExposure}
   * @since iOS 13
   */
  headphoneAudioExposure = 'HKQuantityTypeIdentifierHeadphoneAudioExposure', // Pressure, Cumulative

  // Nutrition
  /**
   * Dietary Fat Total
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfattotal Apple Docs HKQuantityTypeIdentifierDietaryFatTotal}
   * @since iOS 8
   */
  dietaryFatTotal = 'HKQuantityTypeIdentifierDietaryFatTotal', // Mass, Cumulative

  /**
   * Dietary Fat Polyunsaturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatpolyunsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatPolyunsaturated}
   */
  dietaryFatPolyunsaturated = 'HKQuantityTypeIdentifierDietaryFatPolyunsaturated', // Mass, Cumulative

  /**
   * Dietary Fat Monounsaturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatmonounsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatMonounsaturated}
   */
  dietaryFatMonounsaturated = 'HKQuantityTypeIdentifierDietaryFatMonounsaturated', // Mass, Cumulative
  /**
   * Dietary Fat Saturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatSaturated}
   */
  dietaryFatSaturated = 'HKQuantityTypeIdentifierDietaryFatSaturated', // Mass, Cumulative

  /**
   * Dietary Cholesterol
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycholesterol Apple Docs HKQuantityTypeIdentifierDietaryCholesterol}
   */
  dietaryCholesterol = 'HKQuantityTypeIdentifierDietaryCholesterol', // Mass, Cumulative

  /**
   * Dietary Sodium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarysodium Apple Docs HKQuantityTypeIdentifierDietarySodium}
   */
  dietarySodium = 'HKQuantityTypeIdentifierDietarySodium', // Mass, Cumulative

  /**
   * Dietary Carbohydrates
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycarbohydrates Apple Docs HKQuantityTypeIdentifierDietaryCarbohydrates}
   */
  dietaryCarbohydrates = 'HKQuantityTypeIdentifierDietaryCarbohydrates', // Mass, Cumulative

  /**
   * Dietary Fiber
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfiber Apple Docs HKQuantityTypeIdentifierDietaryFiber}
   */
  dietaryFiber = 'HKQuantityTypeIdentifierDietaryFiber', // Mass, Cumulative
  /**
   * Dietary Sugar
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarysugar Apple Docs HKQuantityTypeIdentifierDietarySugar}
   */
  dietarySugar = 'HKQuantityTypeIdentifierDietarySugar', // Mass, Cumulative

  /**
   * Dietary Energy Consumed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryenergyconsumed Apple Docs HKQuantityTypeIdentifierDietaryEnergyConsumed}
   */
  dietaryEnergyConsumed = 'HKQuantityTypeIdentifierDietaryEnergyConsumed', // Energy, Cumulative

  /**
   * Dietary Protein
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryprotein Apple Docs HKQuantityTypeIdentifierDietaryProtein}
   */
  dietaryProtein = 'HKQuantityTypeIdentifierDietaryProtein', // Mass, Cumulative

  /**
   * Dietary Vitamin A
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamina Apple Docs HKQuantityTypeIdentifierDietaryVitaminA}
   */
  dietaryVitaminA = 'HKQuantityTypeIdentifierDietaryVitaminA', // Mass, Cumulative

  /**
   * Dietary Vitamin B6
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminb6 Apple Docs HKQuantityTypeIdentifierDietaryVitaminB6}
   */
  dietaryVitaminB6 = 'HKQuantityTypeIdentifierDietaryVitaminB6', // Mass, Cumulative

  /**
   * Dietary Vitamin B12
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminb12 Apple Docs HKQuantityTypeIdentifierDietaryVitaminB12}
   */
  dietaryVitaminB12 = 'HKQuantityTypeIdentifierDietaryVitaminB12', // Mass, Cumulative

  /**
   * Dietary Vitamin C
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminc Apple Docs HKQuantityTypeIdentifierDietaryVitaminC}
   */
  dietaryVitaminC = 'HKQuantityTypeIdentifierDietaryVitaminC', // Mass, Cumulative

  /**
   * Dietary Vitamin D
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamind Apple Docs HKQuantityTypeIdentifierDietaryVitaminD}
   */
  dietaryVitaminD = 'HKQuantityTypeIdentifierDietaryVitaminD', // Mass, Cumulative

  /**
   * Dietary Vitamin E
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamine Apple Docs HKQuantityTypeIdentifierDietaryVitaminE}
   */
  dietaryVitaminE = 'HKQuantityTypeIdentifierDietaryVitaminE', // Mass, Cumulative

  /**
   * Dietary Vitamin K
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamink Apple Docs HKQuantityTypeIdentifierDietaryVitaminK}
   */
  dietaryVitaminK = 'HKQuantityTypeIdentifierDietaryVitaminK', // Mass, Cumulative
  /**
   * Dietary Calcium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycalcium Apple Docs HKQuantityTypeIdentifierDietaryCalcium}
   */
  dietaryCalcium = 'HKQuantityTypeIdentifierDietaryCalcium', // Mass, Cumulative

  /**
   * Dietary Iron
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryiron Apple Docs HKQuantityTypeIdentifierDietaryIron}
   */
  dietaryIron = 'HKQuantityTypeIdentifierDietaryIron', // Mass, Cumulative

  /**
   * Dietary Thiamin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarythiamin Apple Docs HKQuantityTypeIdentifierDietaryThiamin}
   */
  dietaryThiamin = 'HKQuantityTypeIdentifierDietaryThiamin', // Mass, Cumulative

  /**
   * Dietary Riboflavin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryriboflavin Apple Docs HKQuantityTypeIdentifierDietaryRiboflavin}
   */
  dietaryRiboflavin = 'HKQuantityTypeIdentifierDietaryRiboflavin', // Mass, Cumulative

  /**
   * Dietary Niacin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryniacin Apple Docs HKQuantityTypeIdentifierDietaryNiacin}
   */
  dietaryNiacin = 'HKQuantityTypeIdentifierDietaryNiacin', // Mass, Cumulative

  /**
   * Dietary Folate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfolate Apple Docs HKQuantityTypeIdentifierDietaryFolate}
   */
  dietaryFolate = 'HKQuantityTypeIdentifierDietaryFolate', // Mass, Cumulative

  /**
   * Dietary Biotin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarybiotin Apple Docs HKQuantityTypeIdentifierDietaryBiotin}
   */
  dietaryBiotin = 'HKQuantityTypeIdentifierDietaryBiotin', // Mass, Cumulative

  /**
   * Dietary Pantothenic Acid
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarypantothenicacid Apple Docs HKQuantityTypeIdentifierDietaryPantothenicAcid}
   */
  dietaryPantothenicAcid = 'HKQuantityTypeIdentifierDietaryPantothenicAcid', // Mass, Cumulative

  /**
   * Dietary Phosphorus
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryphosphorus Apple Docs HKQuantityTypeIdentifierDietaryPhosphorus}
   */
  dietaryPhosphorus = 'HKQuantityTypeIdentifierDietaryPhosphorus', // Mass, Cumulative

  /**
   * Dietary Iodine
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryiodine Apple Docs HKQuantityTypeIdentifierDietaryIodine}
   */
  dietaryIodine = 'HKQuantityTypeIdentifierDietaryIodine', // Mass, Cumulative
  /**
   * Dietary Magnesium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymagnesium Apple Docs HKQuantityTypeIdentifierDietaryMagnesium}
   */
  dietaryMagnesium = 'HKQuantityTypeIdentifierDietaryMagnesium', // Mass, Cumulative

  /**
   * Dietary Zinc
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryzinc Apple Docs HKQuantityTypeIdentifierDietaryZinc}
   */
  dietaryZinc = 'HKQuantityTypeIdentifierDietaryZinc', // Mass, Cumulative

  /**
   * Dietary Selenium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryselenium Apple Docs HKQuantityTypeIdentifierDietarySelenium}
   */
  dietarySelenium = 'HKQuantityTypeIdentifierDietarySelenium', // Mass, Cumulative

  /**
   * Dietary Copper
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycopper Apple Docs HKQuantityTypeIdentifierDietaryCopper}
   */
  dietaryCopper = 'HKQuantityTypeIdentifierDietaryCopper', // Mass, Cumulative

  /**
   * Dietary Manganese
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymanganese Apple Docs HKQuantityTypeIdentifierDietaryManganese}
   */
  dietaryManganese = 'HKQuantityTypeIdentifierDietaryManganese', // Mass, Cumulative

  /**
   * Dietary Chromium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarychromium Apple Docs HKQuantityTypeIdentifierDietaryChromium}
   */
  dietaryChromium = 'HKQuantityTypeIdentifierDietaryChromium', // Mass, Cumulative

  /**
   * Dietary Molybdenum
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymolybdenum Apple Docs HKQuantityTypeIdentifierDietaryMolybdenum}
   */
  dietaryMolybdenum = 'HKQuantityTypeIdentifierDietaryMolybdenum', // Mass, Cumulative

  /**
   * Dietary Chloride
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarychloride Apple Docs HKQuantityTypeIdentifierDietaryChloride}
   * @since iOS 8
   */
  dietaryChloride = 'HKQuantityTypeIdentifierDietaryChloride', // Mass, Cumulative

  /**
   * Dietary Potassium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarypotassium Apple Docs HKQuantityTypeIdentifierDietaryPotassium}
   * @since iOS 8
   */
  dietaryPotassium = 'HKQuantityTypeIdentifierDietaryPotassium', // Mass, Cumulative

  /**
   * Dietary Caffeine
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycaffeine Apple Docs HKQuantityTypeIdentifierDietaryCaffeine}
   * @since iOS 8
   */
  dietaryCaffeine = 'HKQuantityTypeIdentifierDietaryCaffeine', // Mass, Cumulative

  /**
   * Dietary Water
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarywater Apple Docs HKQuantityTypeIdentifierDietaryWater}
   * @since iOS 9
   */
  dietaryWater = 'HKQuantityTypeIdentifierDietaryWater', // Volume, Cumulative

  // Mobility
  /**
   * Six Minute Walk Test Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiersixminutewalktestdistance Apple Docs HKQuantityTypeIdentifierSixMinuteWalkTestDistance}
   * @since iOS 14
   */
  sixMinuteWalkTestDistance = 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance',

  /**
   * Walking Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingspeed Apple Docs HKQuantityTypeIdentifierWalkingSpeed}
   * @since iOS 14
   */
  walkingSpeed = 'HKQuantityTypeIdentifierWalkingSpeed',

  /**
   * Walking Step Length
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingsteplength Apple Docs HKQuantityTypeIdentifierWalkingStepLength}
   * @since iOS 14
   */
  walkingStepLength = 'HKQuantityTypeIdentifierWalkingStepLength',

  /**
   * Walking Asymmetry Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingasymmetrypercentage Apple Docs HKQuantityTypeIdentifierWalkingAsymmetryPercentage}
   * @since iOS 14
   */
  walkingAsymmetryPercentage = 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage',

  /**
   * Walking Double Support Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingdoublesupportpercentage Apple Docs HKQuantityTypeIdentifierWalkingDoubleSupportPercentage}
   * @since iOS 14
   */
  walkingDoubleSupportPercentage = 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage',

  /**
   * Stair Ascent Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstairascentspeed Apple Docs HKQuantityTypeIdentifierStairAscentSpeed}
   * @since iOS 14
   */
  stairAscentSpeed = 'HKQuantityTypeIdentifierStairAscentSpeed',

  /**
   * Stair Descent Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstairdescentspeed Apple Docs HKQuantityTypeIdentifierStairDescentSpeed}
   * @since iOS 14
   */
  stairDescentSpeed = 'HKQuantityTypeIdentifierStairDescentSpeed',

  /**
   * UV Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieruvexposure Apple Docs HKQuantityTypeIdentifierUVExposure}
   * @since iOS 9
   */
  uvExposure = 'HKQuantityTypeIdentifierUVExposure', // Scalar (Count), Discrete

  /**
   * Apple Move Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplemovetime Apple Docs HKQuantityTypeIdentifierAppleMoveTime}
   * @since iOS 14.5
   */
  appleMoveTime = 'HKQuantityTypeIdentifierAppleMoveTime', // Time, Cumulative

  /**
   * Apple Walking Steadiness
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplewalkingsteadiness Apple Docs HKQuantityTypeIdentifierAppleWalkingSteadiness}
   * @since iOS 15
   */
  appleWalkingSteadiness = 'HKQuantityTypeIdentifierAppleWalkingSteadiness', // Scalar(Percent, 0.0 - 1.0), Discrete

  /**
   * Number Of Alcoholic Beverages
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernumberofalcoholicbeverages Apple Docs HKQuantityTypeIdentifierNumberOfAlcoholicBeverages}
   * @since iOS 15
   */
  numberOfAlcoholicBeverages = 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages', // Scalar(Count), Cumulative

  /**
   * Atrial Fibrillation Burden
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieratrialfibrillationburden Apple Docs HKQuantityTypeIdentifierAtrialFibrillationBurden}
   * @since iOS 16
   */
  atrialFibrillationBurden = 'HKQuantityTypeIdentifierAtrialFibrillationBurden', // Scalar(Percent, 0.0 - 1.0), Discrete

  /**
   * Underwater Depth
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierunderwaterdepth Apple Docs HKQuantityTypeIdentifierUnderwaterDepth}
   * @since iOS 16
   */
  underwaterDepth = 'HKQuantityTypeIdentifierUnderwaterDepth', // Length, Discrete

  /**
   * Water Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwatertemperature Apple Docs HKQuantityTypeIdentifierWaterTemperature}
   * @since iOS 16
   */
  waterTemperature = 'HKQuantityTypeIdentifierWaterTemperature', // Temperature, Discrete

  /**
   * Apple Sleeping Wrist Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplesleepingwristtemperature Apple Docs HKQuantityTypeIdentifierAppleSleepingWristTemperature}
   * @since iOS 17
   */
  appleSleepingWristTemperature = 'HKQuantityTypeIdentifierAppleSleepingWristTemperature', // Temperature, Discrete

  /**
   * Time In Daylight
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiertimeindaylight Apple Docs HKQuantityTypeIdentifierTimeInDaylight}
   * @since iOS 17
   */
  timeInDaylight = 'HKQuantityTypeIdentifierTimeInDaylight', // Time, Cumulative

  /**
   * Physical Effort
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierphysicaleffort Apple Docs HKQuantityTypeIdentifierPhysicalEffort}
   * @since iOS 17
   */
  physicalEffort = 'HKQuantityTypeIdentifierPhysicalEffort', // Scalar (Percent, 0.0 - 1.0), Discrete

  /**
   * Cycling Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingspeed Apple Docs HKQuantityTypeIdentifierCyclingSpeed}
   * @since iOS 17
   */
  cyclingSpeed = 'HKQuantityTypeIdentifierCyclingSpeed',

  /**
   * Cycling Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingpower Apple Docs HKQuantityTypeIdentifierCyclingPower}
   * @since iOS 17
   */
  cyclingPower = 'HKQuantityTypeIdentifierCyclingPower',

  /**
   * Cycling Functional Threshold Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingfunctionalthresholdpower Apple Docs HKQuantityTypeIdentifierCyclingFunctionalThresholdPower}
   * @since iOS 17
   */
  cyclingFunctionalThresholdPower = 'HKQuantityTypeIdentifierCyclingFunctionalThresholdPower',

  /**
   * Cycling Cadence
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingcadence Apple Docs HKQuantityTypeIdentifierCyclingCadence}
   * @since iOS 17
   */
  cyclingCadence = 'HKQuantityTypeIdentifierCyclingCadence',

  /**
   * Environmental Sound Reduction
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierenvironmentalsoundreduction Apple Docs HKQuantityTypeIdentifierEnvironmentalSoundReduction}
   * @since iOS 16
   */
  environmentalSoundReduction = 'HKQuantityTypeIdentifierEnvironmentalSoundReduction',

  /**
   * Heart Rate Recovery One Minute
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartraterecoveryoneminute Apple Docs HKQuantityTypeIdentifierHeartRateRecoveryOneMinute}
   * @since iOS 16
   */
  heartRateRecoveryOneMinute = 'HKQuantityTypeIdentifierHeartRateRecoveryOneMinute',

  /**
   * Running Ground Contact Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunninggroundcontacttime Apple Docs HKQuantityTypeIdentifierRunningGroundContactTime}
   * @since iOS 16
   */
  runningGroundContactTime = 'HKQuantityTypeIdentifierRunningGroundContactTime',

  /**
   * Running Stride Length
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningstridelength Apple Docs HKQuantityTypeIdentifierRunningStrideLength}
   * @since iOS 16
   */
  runningStrideLength = 'HKQuantityTypeIdentifierRunningStrideLength',

  /**
   * Running Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningpower Apple Docs HKQuantityTypeIdentifierRunningPower}
   * @since iOS 16
   */
  runningPower = 'HKQuantityTypeIdentifierRunningPower',

  /**
   * Running Vertical Oscillation
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningverticaloscillation Apple Docs HKQuantityTypeIdentifierRunningVerticalOscillation}
   * @since iOS 16
   */
  runningVerticalOscillation = 'HKQuantityTypeIdentifierRunningVerticalOscillation',

  /**
   * Running Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningspeed Apple Docs HKQuantityTypeIdentifierRunningSpeed}
   * @since iOS 16
   */
  runningSpeed = 'HKQuantityTypeIdentifierRunningSpeed',
}

export type TypeToUnitMapping = {
  readonly [key in HKQuantityTypeIdentifier]: HKUnit;
};

export enum HKCategoryValueLowCardioFitnessEvent {
  lowFitness = 1,
}

export enum HKHeartRateMotionContext {
  active = 2,
  notSet = 0,
  sedentary = 1,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcorrelationtypeidentifier Apple Docs }
 */
export enum HKCorrelationTypeIdentifier {
  bloodPressure = 'HKCorrelationTypeIdentifierBloodPressure',
  food = 'HKCorrelationTypeIdentifierFood',
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier Apple Docs }
 */
export enum HKCategoryTypeIdentifier {
  sleepAnalysis = 'HKCategoryTypeIdentifierSleepAnalysis',
  appleStandHour = 'HKCategoryTypeIdentifierAppleStandHour',
  cervicalMucusQuality = 'HKCategoryTypeIdentifierCervicalMucusQuality',
  ovulationTestResult = 'HKCategoryTypeIdentifierOvulationTestResult',
  menstrualFlow = 'HKCategoryTypeIdentifierMenstrualFlow',
  intermenstrualBleeding = 'HKCategoryTypeIdentifierIntermenstrualBleeding',
  sexualActivity = 'HKCategoryTypeIdentifierSexualActivity',
  mindfulSession = 'HKCategoryTypeIdentifierMindfulSession',
  highHeartRateEvent = 'HKCategoryTypeIdentifierHighHeartRateEvent',
  lowHeartRateEvent = 'HKCategoryTypeIdentifierLowHeartRateEvent',
  irregularHeartRhythmEvent = 'HKCategoryTypeIdentifierIrregularHeartRhythmEvent',
  /**
   * @deprecated Use environmentalAudioExposureEvent instead.
   */
  audioExposureEvent = 'HKCategoryTypeIdentifierAudioExposureEvent',
  toothbrushingEvent = 'HKCategoryTypeIdentifierToothbrushingEvent',
  lowCardioFitnessEvent = 'HKCategoryTypeIdentifierLowCardioFitnessEvent',
  contraceptive = 'HKCategoryTypeIdentifierContraceptive',
  lactation = 'HKCategoryTypeIdentifierLactation',
  pregnancy = 'HKCategoryTypeIdentifierPregnancy',
  pregnancyTestResult = 'HKCategoryTypeIdentifierPregnancyTestResult',
  progesteroneTestResult = 'HKCategoryTypeIdentifierProgesteroneTestResult',
  environmentalAudioExposureEvent = 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent',
  headphoneAudioExposureEvent = 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
  appleWalkingSteadinessEvent = 'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent',
  handwashingEvent = 'HKCategoryTypeIdentifierHandwashingEvent', // HKCategoryValue

  // Symptoms
  abdominalCramps = 'HKCategoryTypeIdentifierAbdominalCramps', // HKCategoryValueSeverity
  acne = 'HKCategoryTypeIdentifierAcne', // HKCategoryValueSeverity
  appetiteChanges = 'HKCategoryTypeIdentifierAppetiteChanges', // HKCategoryValueAppetiteChanges
  bladderIncontinence = 'HKCategoryTypeIdentifierBladderIncontinence', // HKCategoryValueSeverity
  bloating = 'HKCategoryTypeIdentifierBloating', // HKCategoryValueSeverity
  breastPain = 'HKCategoryTypeIdentifierBreastPain', // HKCategoryValueSeverity
  chestTightnessOrPain = 'HKCategoryTypeIdentifierChestTightnessOrPain', // HKCategoryValueSeverity
  chills = 'HKCategoryTypeIdentifierChills', // HKCategoryValueSeverity
  constipation = 'HKCategoryTypeIdentifierConstipation', // HKCategoryValueSeverity
  coughing = 'HKCategoryTypeIdentifierCoughing', // HKCategoryValueSeverity
  diarrhea = 'HKCategoryTypeIdentifierDiarrhea', // HKCategoryValueSeverity
  dizziness = 'HKCategoryTypeIdentifierDizziness', // HKCategoryValueSeverity
  drySkin = 'HKCategoryTypeIdentifierDrySkin', // HKCategoryValueSeverity
  fainting = 'HKCategoryTypeIdentifierFainting', // HKCategoryValueSeverity
  fatigue = 'HKCategoryTypeIdentifierFatigue', // HKCategoryValueSeverity
  fever = 'HKCategoryTypeIdentifierFever', // HKCategoryValueSeverity
  generalizedBodyAche = 'HKCategoryTypeIdentifierGeneralizedBodyAche', // HKCategoryValueSeverity
  hairLoss = 'HKCategoryTypeIdentifierHairLoss', // HKCategoryValueSeverity
  headache = 'HKCategoryTypeIdentifierHeadache', // HKCategoryValueSeverity
  heartburn = 'HKCategoryTypeIdentifierHeartburn', // HKCategoryValueSeverity
  hotFlashes = 'HKCategoryTypeIdentifierHotFlashes', // HKCategoryValueSeverity
  lossOfSmell = 'HKCategoryTypeIdentifierLossOfSmell', // HKCategoryValueSeverity
  lossOfTaste = 'HKCategoryTypeIdentifierLossOfTaste', // HKCategoryValueSeverity
  lowerBackPain = 'HKCategoryTypeIdentifierLowerBackPain', // HKCategoryValueSeverity
  memoryLapse = 'HKCategoryTypeIdentifierMemoryLapse', // HKCategoryValueSeverity
  moodChanges = 'HKCategoryTypeIdentifierMoodChanges', // HKCategoryValuePresence
  nausea = 'HKCategoryTypeIdentifierNausea', // HKCategoryValueSeverity
  nightSweats = 'HKCategoryTypeIdentifierNightSweats', // HKCategoryValueSeverity
  pelvicPain = 'HKCategoryTypeIdentifierPelvicPain', // HKCategoryValueSeverity
  rapidPoundingOrFlutteringHeartbeat = 'HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat', // HKCategoryValueSeverity
  runnyNose = 'HKCategoryTypeIdentifierRunnyNose', // HKCategoryValueSeverity
  shortnessOfBreath = 'HKCategoryTypeIdentifierShortnessOfBreath', // HKCategoryValueSeverity
  sinusCongestion = 'HKCategoryTypeIdentifierSinusCongestion', // HKCategoryValueSeverity
  skippedHeartbeat = 'HKCategoryTypeIdentifierSkippedHeartbeat', // HKCategoryValueSeverity
  sleepChanges = 'HKCategoryTypeIdentifierSleepChanges', // HKCategoryValuePresence
  soreThroat = 'HKCategoryTypeIdentifierSoreThroat', // HKCategoryValueSeverity
  vaginalDryness = 'HKCategoryTypeIdentifierVaginalDryness', // HKCategoryValueSeverity
  vomiting = 'HKCategoryTypeIdentifierVomiting', // HKCategoryValueSeverity
  wheezing = 'HKCategoryTypeIdentifierWheezing', // HKCategoryValueSeverity
}

export type HKSampleTypeIdentifier =
  | HKCategoryTypeIdentifier
  | HKCorrelationTypeIdentifier
  | HKQuantityTypeIdentifier
  | typeof HKActivitySummaryTypeIdentifier
  | typeof HKAudiogramTypeIdentifier
  | typeof HKDataTypeIdentifierHeartbeatSeries
  | typeof HKWorkoutRouteTypeIdentifier
  | typeof HKWorkoutTypeIdentifier
  | `${HKCategoryTypeIdentifier}`
  | `${HKCorrelationTypeIdentifier}`
  | `${HKQuantityTypeIdentifier}`;

export type HealthkitReadAuthorization =
  | HKCharacteristicTypeIdentifier
  | HKSampleTypeIdentifier
  | `${HKCharacteristicTypeIdentifier}`
  | `${HKSampleTypeIdentifier}`;
export type HealthkitWriteAuthorization = HKSampleTypeIdentifier;

export enum HKCategoryValueAppleStandHour {
  stood = 0,
  idle = 1,
}

export enum HKWorkoutActivityType {
  americanFootball = 1,
  archery = 2,
  australianFootball = 3,
  badminton = 4,
  baseball = 5,
  basketball = 6,
  bowling = 7,
  boxing = 8, // See also HKWorkoutActivityTypeKickboxing.,
  climbing = 9,
  cricket = 10,
  crossTraining = 11, // Any mix of cardio and/or strength training. See also HKWorkoutActivityTypeCoreTraining and HKWorkoutActivityTypeFlexibility.,
  curling = 12,
  cycling = 13,
  dance = 14,
  danceInspiredTraining = 15, // This enum remains available to access older data.,
  elliptical = 16,
  equestrianSports = 17, // Polo, Horse Racing, Horse Riding, etc.,
  fencing = 18,
  fishing = 19,
  functionalStrengthTraining = 20, // Primarily free weights and/or body weight and/or accessories,
  golf = 21,
  gymnastics = 22,
  handball = 23,
  hiking = 24,
  hockey = 25, // Ice Hockey, Field Hockey, etc.,
  hunting = 26,
  lacrosse = 27,
  martialArts = 28,
  mindAndBody = 29, // Qigong, meditation, etc.,
  mixedMetabolicCardioTraining = 30, // This enum remains available to access older data.,
  paddleSports = 31, // Canoeing, Kayaking, Outrigger, Stand Up Paddle Board, etc.,
  play = 32, // Dodge Ball, Hopscotch, Tetherball, Jungle Gym, etc.,
  preparationAndRecovery = 33, // Foam rolling, stretching, etc.,
  racquetball = 34,
  rowing = 35,
  rugby = 36,
  running = 37,
  sailing = 38,
  skatingSports = 39, // Ice Skating, Speed Skating, Inline Skating, Skateboarding, etc.,
  snowSports = 40, // Sledding, Snowmobiling, Building a Snowman, etc. See also HKWorkoutActivityTypeCrossCountrySkiing, HKWorkoutActivityTypeSnowboarding, and HKWorkoutActivityTypeDownhillSkiing.,
  soccer = 41,
  softball = 42,
  squash = 43,
  stairClimbing = 44, // See also HKWorkoutActivityTypeStairs and HKWorkoutActivityTypeStepTraining.,
  surfingSports = 45, // Traditional Surfing, Kite Surfing, Wind Surfing, etc.,
  swimming = 46,
  tableTennis = 47,
  tennis = 48,
  trackAndField = 49, // Shot Put, Javelin, Pole Vaulting, etc.,
  traditionalStrengthTraining = 50, // Primarily machines and/or free weights,
  volleyball = 51,
  walking = 52,
  waterFitness = 53,
  waterPolo = 54,
  waterSports = 55, // Water Skiing, Wake Boarding, etc.,
  wrestling = 56,
  yoga = 57,
  barre = 58, // HKWorkoutActivityTypeDanceInspiredTraining,
  coreTraining = 59,
  crossCountrySkiing = 60,
  downhillSkiing = 61,
  flexibility = 62,
  highIntensityIntervalTraining = 63,
  jumpRope = 64,
  kickboxing = 65,
  pilates = 66, // HKWorkoutActivityTypeDanceInspiredTraining,
  snowboarding = 67,
  stairs = 68,
  stepTraining = 69,
  wheelchairWalkPace = 70,
  wheelchairRunPace = 71,
  taiChi = 72,
  mixedCardio = 73, // HKWorkoutActivityTypeMixedMetabolicCardioTraining,
  handCycling = 74,
  discSports = 75,
  fitnessGaming = 76,
  other = 3000,
}

export type HKGenericMetadata = {
  readonly [key: string]: HKQuantity | boolean | number | string | undefined;
  readonly HKExternalUUID?: string;
  readonly HKTimeZone?: string;
  readonly HKWasUserEntered?: boolean;
  readonly HKDeviceSerialNumber?: string;
  readonly HKUDIDeviceIdentifier?: string;
  readonly HKUDIProductionIdentifier?: string;
  readonly HKDigitalSignature?: string;
  readonly HKDeviceName?: string;
  readonly HKDeviceManufacturerName?: string;
  readonly HKSyncIdentifier?: string;
  readonly HKSyncVersion?: number;
  readonly HKWasTakenInLab?: boolean;
  readonly HKReferenceRangeLowerLimit?: number;
  readonly HKReferenceRangeUpperLimit?: number;
};

// documented at https://developer.apple.com/documentation/healthkit/hkweathercondition
export enum HKWeatherCondition {
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

enum HKIndoorWorkout {
  false = 0,
  true = 1,
}

export interface HKWorkoutMetadata
  extends HKGenericMetadata /* <TTemperatureUnit extends HKUnit> */ {
  readonly HKWeatherCondition?: HKWeatherCondition;
  readonly HKWeatherHumidity?: HKQuantity<
  HKQuantityTypeIdentifier,
  HKUnits.Percent
  >;
  // HKWeatherTemperature: HKQuantity<TTemperatureUnit>
  readonly HKAverageMETs?: HKQuantity<HKQuantityTypeIdentifier, HKUnit>;
  readonly HKElevationAscended?: HKQuantity<
  HKQuantityTypeIdentifier,
  LengthUnit
  >;
  readonly HKIndoorWorkout?: HKIndoorWorkout;
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus Apple Docs }
 */
export enum HKAuthorizationRequestStatus {
  unknown = 0,
  shouldRequest = 1,
  unnecessary = 2,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
export enum HKAuthorizationStatus {
  notDetermined = 0,
  sharingDenied = 1,
  sharingAuthorized = 2,
}

export type HKQuantity<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>
> = {
  readonly unit: TUnit;
  readonly quantity: number;
};

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

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstatisticsoptions Apple Docs }
 */
export enum HKStatisticsOptions {
  cumulativeSum = 'cumulativeSum',
  discreteAverage = 'discreteAverage',
  discreteMax = 'discreteMax',
  discreteMin = 'discreteMin',
  discreteMostRecent = 'discreteMostRecent',
  duration = 'duration',
  mostRecent = 'mostRecent',
  separateBySource = 'separateBySource',
}

export type QueryStatisticsResponseRaw<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
> = {
  readonly averageQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly maximumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly minimumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly sumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly mostRecentQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly mostRecentQuantityDateInterval?: {
    readonly from: string;
    readonly to: string;
  };
  readonly duration?: HKQuantity<HKQuantityTypeIdentifier, TimeUnit>;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluecervicalmucusquality Apple Docs }
 */
export enum HKCategoryValueCervicalMucusQuality {
  dry = 1,
  sticky = 2,
  creamy = 3,
  watery = 4,
  eggWhite = 5,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluemenstrualflow Apple Docs }
 */
export enum HKCategoryValueMenstrualFlow {
  unspecified = 1,
  none = 5,
  light = 2,
  medium = 3,
  heavy = 4,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueovulationtestresult Apple Docs }
 */
export enum HKCategoryValueOvulationTestResult {
  negative = 1,
  luteinizingHormoneSurge = 2,
  indeterminate = 3,
  estrogenSurge = 4,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis Apple Docs }
 */
export enum HKCategoryValueSleepAnalysis {
  inBed = 0,
  asleepUnspecified = 1,
  awake = 2,
  asleepCore = 3,
  asleepDeep = 4,
  asleepREM = 5,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueappetitechanges
 */
export enum HKCategoryValueAppetiteChanges {
  decreased = 2,
  increased = 3,
  noChange = 1,
  unspecified = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepresence
 */
export enum HKCategoryValuePresence {
  notPresent = 1,
  present = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueseverity Apple Docs }
 */
export enum HKCategoryValueSeverity {
  notPresent = 1,
  mild = 2,
  moderate = 3,
  severe = 4,
  unspecified = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalue/notapplicable Apple Docs }
 */
export enum HKCategoryValueNotApplicable {
  notApplicable = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalue Apple Docs }
 */
export type HKCategoryValue =
  | HKCategoryValueAppetiteChanges
  | HKCategoryValueCervicalMucusQuality
  | HKCategoryValueLowCardioFitnessEvent
  | HKCategoryValueMenstrualFlow
  | HKCategoryValueOvulationTestResult
  | HKCategoryValuePresence
  | HKCategoryValueSeverity
  | HKCategoryValueSleepAnalysis
  | number;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason Apple Docs }
 */
export enum HKInsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}

export type MetadataMapperForQuantityIdentifier<
  TQuantityTypeIdentifier = HKQuantityTypeIdentifier
> = TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.insulinDelivery
  ? HKGenericMetadata & {
    readonly HKInsulinDeliveryReason: HKInsulinDeliveryReason;
  }
  : TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.bloodGlucose
    ? HKGenericMetadata & {
      readonly HKBloodGlucoseMealTime?: number;
    }
    : TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.heartRate
      ? HKGenericMetadata & {
        readonly HKHeartRateMotionContext?: HKHeartRateMotionContext;
      }
      : HKGenericMetadata;

export type MetadataMapperForCorrelationIdentifier<
  TCorrelationTypeIdentifier = HKCorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends HKCorrelationTypeIdentifier.food
  ? HKGenericMetadata & {
    readonly HKFoodType?: string;
  }
  : HKGenericMetadata;

export type UnitForIdentifier<T extends HKQuantityTypeIdentifier> =
  T extends HKQuantityTypeIdentifier.bloodGlucose
    ? BloodGlucoseUnit
    : T extends
    | HKQuantityTypeIdentifier.appleExerciseTime
    | HKQuantityTypeIdentifier.appleMoveTime
    | HKQuantityTypeIdentifier.appleStandTime
      ? TimeUnit
      : T extends
      | HKQuantityTypeIdentifier.activeEnergyBurned
      | HKQuantityTypeIdentifier.basalEnergyBurned
      | HKQuantityTypeIdentifier.dietaryEnergyConsumed
        ? EnergyUnit
        : T extends
        | HKQuantityTypeIdentifier.distanceCycling
        | HKQuantityTypeIdentifier.distanceDownhillSnowSports
        | HKQuantityTypeIdentifier.distanceSwimming
        | HKQuantityTypeIdentifier.distanceWalkingRunning
        | HKQuantityTypeIdentifier.distanceWheelchair
        | HKQuantityTypeIdentifier.sixMinuteWalkTestDistance
        | HKQuantityTypeIdentifier.waistCircumference
          ? LengthUnit
          : T extends
          | HKQuantityTypeIdentifier.bodyFatPercentage
          | HKQuantityTypeIdentifier.oxygenSaturation
          | HKQuantityTypeIdentifier.walkingAsymmetryPercentage
          | HKQuantityTypeIdentifier.walkingDoubleSupportPercentage
            ? HKUnits.Percent
            : T extends
            | HKQuantityTypeIdentifier.basalBodyTemperature
            | HKQuantityTypeIdentifier.basalBodyTemperature
              ? TemperatureUnit
              : T extends
              | HKQuantityTypeIdentifier.runningSpeed
              | HKQuantityTypeIdentifier.stairAscentSpeed
              | HKQuantityTypeIdentifier.stairDescentSpeed
              | HKQuantityTypeIdentifier.walkingSpeed
              | HKQuantityTypeIdentifier.walkingSpeed
                ? SpeedUnit<LengthUnit, TimeUnit>
                : T extends
                | HKQuantityTypeIdentifier.flightsClimbed
                | HKQuantityTypeIdentifier.numberOfAlcoholicBeverages
                | HKQuantityTypeIdentifier.numberOfTimesFallen
                | HKQuantityTypeIdentifier.pushCount
                | HKQuantityTypeIdentifier.stepCount
                | HKQuantityTypeIdentifier.swimmingStrokeCount
                  ? HKUnits.Count
                  : T extends
                  | HKQuantityTypeIdentifier.dietaryBiotin
                  | HKQuantityTypeIdentifier.dietaryCaffeine
                  | HKQuantityTypeIdentifier.dietaryCalcium
                  | HKQuantityTypeIdentifier.dietaryCarbohydrates
                  | HKQuantityTypeIdentifier.dietaryChloride
                  | HKQuantityTypeIdentifier.dietaryCholesterol
                  | HKQuantityTypeIdentifier.dietaryChromium
                  | HKQuantityTypeIdentifier.dietaryCopper
                  | HKQuantityTypeIdentifier.dietaryFatMonounsaturated
                  | HKQuantityTypeIdentifier.dietaryFatPolyunsaturated
                  | HKQuantityTypeIdentifier.dietaryFatSaturated
                  | HKQuantityTypeIdentifier.dietaryFatTotal
                  | HKQuantityTypeIdentifier.dietaryFiber
                  | HKQuantityTypeIdentifier.dietaryFolate
                  | HKQuantityTypeIdentifier.dietaryIodine
                  | HKQuantityTypeIdentifier.dietaryIodine
                  | HKQuantityTypeIdentifier.dietaryIron
                  | HKQuantityTypeIdentifier.dietaryMagnesium
                  | HKQuantityTypeIdentifier.dietaryManganese
                  | HKQuantityTypeIdentifier.dietaryMolybdenum
                  | HKQuantityTypeIdentifier.dietaryNiacin
                  | HKQuantityTypeIdentifier.dietaryPantothenicAcid
                  | HKQuantityTypeIdentifier.dietaryPhosphorus
                  | HKQuantityTypeIdentifier.dietaryPotassium
                  | HKQuantityTypeIdentifier.dietaryProtein
                  | HKQuantityTypeIdentifier.dietaryRiboflavin
                  | HKQuantityTypeIdentifier.dietarySelenium
                  | HKQuantityTypeIdentifier.dietarySodium
                  | HKQuantityTypeIdentifier.dietarySugar
                  | HKQuantityTypeIdentifier.dietaryThiamin
                  | HKQuantityTypeIdentifier.dietaryVitaminA
                  | HKQuantityTypeIdentifier.dietaryVitaminB6
                  | HKQuantityTypeIdentifier.dietaryVitaminB12
                  | HKQuantityTypeIdentifier.dietaryVitaminC
                  | HKQuantityTypeIdentifier.dietaryVitaminD
                  | HKQuantityTypeIdentifier.dietaryVitaminE
                  | HKQuantityTypeIdentifier.dietaryVitaminK
                  | HKQuantityTypeIdentifier.dietaryZinc
                    ? MassUnit
                    : T extends HKQuantityTypeIdentifier.dietaryWater
                      ? VolumeUnit
                      : T extends HKQuantityTypeIdentifier.insulinDelivery
                        ? HKUnits.InternationalUnit | `${HKUnits.InternationalUnit}`
                        : T extends
                        | HKQuantityTypeIdentifier.heartRate
                        | HKQuantityTypeIdentifier.restingHeartRate
                        | HKQuantityTypeIdentifier.walkingHeartRateAverage
                          ? CountPerTime<TimeUnit>
                          : HKUnit;

export type HKCategoryValueForIdentifier<T extends HKCategoryTypeIdentifier> =
  T extends HKCategoryTypeIdentifier.cervicalMucusQuality
    ? HKCategoryValueCervicalMucusQuality
    : T extends HKCategoryTypeIdentifier.menstrualFlow
      ? HKCategoryValueMenstrualFlow
      : T extends HKCategoryTypeIdentifier.ovulationTestResult
        ? HKCategoryValueOvulationTestResult
        : T extends HKCategoryTypeIdentifier.sleepAnalysis
          ? HKCategoryValueSleepAnalysis
          : T extends
          | HKCategoryTypeIdentifier.highHeartRateEvent
          | HKCategoryTypeIdentifier.intermenstrualBleeding
          | HKCategoryTypeIdentifier.mindfulSession
          | HKCategoryTypeIdentifier.sexualActivity
            ? HKCategoryValueNotApplicable
            : T extends
            | HKCategoryTypeIdentifier.abdominalCramps
            | HKCategoryTypeIdentifier.abdominalCramps
            | HKCategoryTypeIdentifier.acne
            | HKCategoryTypeIdentifier.bladderIncontinence
            | HKCategoryTypeIdentifier.bloating
            | HKCategoryTypeIdentifier.breastPain
            | HKCategoryTypeIdentifier.chestTightnessOrPain
            | HKCategoryTypeIdentifier.chills
            | HKCategoryTypeIdentifier.constipation
            | HKCategoryTypeIdentifier.coughing
            | HKCategoryTypeIdentifier.diarrhea
            | HKCategoryTypeIdentifier.dizziness
            | HKCategoryTypeIdentifier.drySkin
            | HKCategoryTypeIdentifier.fainting
            | HKCategoryTypeIdentifier.fatigue
            | HKCategoryTypeIdentifier.fever
            | HKCategoryTypeIdentifier.generalizedBodyAche
            | HKCategoryTypeIdentifier.hairLoss
            | HKCategoryTypeIdentifier.headache
            | HKCategoryTypeIdentifier.heartburn
            | HKCategoryTypeIdentifier.hotFlashes
            | HKCategoryTypeIdentifier.lossOfSmell
            | HKCategoryTypeIdentifier.lossOfTaste
            | HKCategoryTypeIdentifier.lowerBackPain
            | HKCategoryTypeIdentifier.memoryLapse
            | HKCategoryTypeIdentifier.moodChanges
            | HKCategoryTypeIdentifier.nausea
            | HKCategoryTypeIdentifier.nightSweats
            | HKCategoryTypeIdentifier.pelvicPain
            | HKCategoryTypeIdentifier.rapidPoundingOrFlutteringHeartbeat
            | HKCategoryTypeIdentifier.runnyNose
            | HKCategoryTypeIdentifier.shortnessOfBreath
            | HKCategoryTypeIdentifier.sinusCongestion
            | HKCategoryTypeIdentifier.skippedHeartbeat
            | HKCategoryTypeIdentifier.soreThroat
            | HKCategoryTypeIdentifier.vaginalDryness
            | HKCategoryTypeIdentifier.vomiting
            | HKCategoryTypeIdentifier.wheezing
              ? HKCategoryValueSeverity
              : T extends
              | HKCategoryTypeIdentifier.appetiteChanges
              | HKCategoryTypeIdentifier.sleepChanges
                ? HKCategoryValuePresence
                : T extends HKCategoryTypeIdentifier.lowCardioFitnessEvent
                  ? HKCategoryValueLowCardioFitnessEvent
                  : T extends HKCategoryTypeIdentifier.pregnancyTestResult
                    ? HKCategoryValuePregnancyTestResult
                    : T extends HKCategoryTypeIdentifier.pregnancyTestResult
                      ? HKCategoryValuePregnancyTestResult
                      : T extends HKCategoryTypeIdentifier.appleStandHour
                        ? HKCategoryValueAppleStandHour
                        : number;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
enum HKCategoryValuePregnancyTestResult {
  positive = 2,
  negative = 1,
  indeterminate = 3,
}
/* needs further mapping

contraceptive = 'HKCategoryTypeIdentifierContraceptive',
  lactation = 'HKCategoryTypeIdentifierLactation',
  pregnancy = 'HKCategoryTypeIdentifierPregnancy',

  progesteroneTestResult = 'HKCategoryTypeIdentifierProgesteroneTestResult',
  environmentalAudioExposureEvent = 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent',
  headphoneAudioExposureEvent = 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
  appleWalkingSteadinessEvent = 'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent',
  handwashingEvent = 'HKCategoryTypeIdentifierHandwashingEvent', // HKCategoryValue */

export type HKHeartbeatSeriesSampleMetadata = HKGenericMetadata & {
  readonly HKMetadataKeyAlgorithmVersion: string;
};

export type MetadataMapperForCategoryIdentifier<
  T extends HKCategoryTypeIdentifier
> = T extends HKCategoryTypeIdentifier.sexualActivity
  ? HKGenericMetadata & {
    readonly HKSexualActivityProtectionUsed: boolean;
  }
  : T extends HKCategoryTypeIdentifier.menstrualFlow
    ? HKGenericMetadata & {
      readonly HKMenstrualCycleStart: boolean;
    }
    : HKGenericMetadata;

// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export enum HKWheelchairUse {
  notSet = 0,
  no = 1,
  yes = 2,
}

// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export enum HKMetricPrefix {
  None = '',
  Pico = 'p',
  Nano = 'n',
  Micro = 'mc',
  Milli = 'm',
  Centi = 'c',
  Deci = 'd',
  Deca = 'da',
  Hecto = 'h',
  Kilo = 'k',
  Mega = 'M',
  Giga = 'G',
  Tera = 'T',
  Femto = 'f',
}

export enum HKUnitMetric {
  Gram = 'g',
  Joule = 'J',
  Kelvin = 'K',
  Liter = 'l',
  Meter = 'm',
  Pascal = 'Pa',
  Second = 's',
  Siemen = 'S',
  Hertz = 'Hz',
  Volt = 'V',
}

export enum HKUnits {
  DecibelHearingLevel = 'dBHL',
  DecibelSoundPressureLevel = 'dBASPL',

  Percent = '%',
  Count = 'count',
  InternationalUnit = 'IU',
}

export type MeterUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Meter}`;
export type LiterUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Liter}`;
export type GramUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Gram}`;
export type PascalUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Pascal}`;
export type SecondUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Second}`;
export type JouleUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Joule}`;
export type HertzUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Hertz}`;
export type VoltUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Volt}`;
export type SiemenUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
  `${Prefix}${HKUnitMetric.Siemen}`;

// not 100% sure about these
export type MoleUnit<MolarMass extends number> = `mol<${MolarMass}>`;
export type MoleUnitWith<
  MolarMass extends number,
  Prefix extends HKMetricPrefix = HKMetricPrefix.None
> = `${Prefix}mol<${MolarMass}>`;

export type FrequencyUnit = HertzUnit<HKMetricPrefix>;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'cm', 'km'
 */
export enum UnitOfLength {
  Feet = 'ft',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'cm', 'km'
   */
  Meter = 'm',
  Inches = 'in',
  Yards = 'yd',
  Miles = 'mi',
}
export type LengthUnit = MeterUnit<HKMetricPrefix> | UnitOfLength;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ml', 'cl'
 */
export enum UnitOfVolume {
  ImperialCup = 'cup_imp',
  ImperialFluidOunces = 'fl_oz_imp',
  ImperialPint = 'pt_imp',
  USCup = 'cup_us',
  USFluidOunces = 'fl_oz_us',
  USPint = 'pt_us',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'ml', 'cl'
   */
  Liter = 'l',
}
export type VolumeUnit = LiterUnit<HKMetricPrefix> | UnitOfVolume;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export enum UnitOfMass {
  Ounces = 'oz',
  Stones = 'st',
  Pounds = 'lb',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'mg', 'kg'
   */
  Gram = 'g',
}
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export type MassUnit = GramUnit<HKMetricPrefix> | UnitOfMass;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export enum UnitOfPressure {
  Atmospheres = 'atm',
  CentimetersOfWater = 'cmAq',
  MillimetersOfMercury = 'mmHg',
  InchesOfMercury = 'inHg',
  DecibelAWeightedSoundPressureLevel = 'dBASPL',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'kPa', 'hPa'
   */
  Pascals = 'Pa',
}

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export type PressureUnit = PascalUnit<HKMetricPrefix> | UnitOfPressure;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export enum UnitOfTime {
  Days = 'd',
  Minutes = 'min',
  Hours = 'hr',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'ms'
   */
  Seconds = 's',
}
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export type TimeUnit = SecondUnit<HKMetricPrefix> | UnitOfTime;
export enum TemperatureUnit {
  DegreesCelsius = 'degC',
  DegreesFahrenheit = 'degF',
  Kelvin = 'K',
}

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kJ'
 */
export enum UnitOfEnergy {
  Kilocalories = 'kcal',
  LargeCalories = 'Cal',
  SmallCalories = 'cal',
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'kJ'
   */
  Joules = 'J',
}
export type EnergyUnit = JouleUnit<HKMetricPrefix> | UnitOfEnergy;
export enum BloodGlucoseUnit {
  GlucoseMmolPerL = 'mmol<180.15588000005408>/l',
  GlucoseMgPerDl = 'mg/dL',
}

export type SpeedUnit<
  TLength extends LengthUnit,
  TTime extends TimeUnit
> = `${TLength}/${TTime}`;
export type CountPerTime<TTime extends TimeUnit> = `count/${TTime}`;

export type HKUnit =
  | BloodGlucoseUnit
  | CountPerTime<TimeUnit>
  | EnergyUnit
  | FrequencyUnit
  | HKUnits
  | LengthUnit
  | MassUnit
  | PressureUnit
  | SpeedUnit<LengthUnit, TimeUnit>
  | TemperatureUnit
  | TimeUnit
  | VolumeUnit
  | `${BloodGlucoseUnit}`
  | `${EnergyUnit}`
  | `${FrequencyUnit}`
  | `${HKUnits}`
  | `${LengthUnit}`
  | `${MassUnit}`
  | `${PressureUnit}`
  | `${TemperatureUnit}`
  | `${TimeUnit}`
  | `${VolumeUnit}`;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export type HKDevice = {
  readonly name: string; // ex: "Apple Watch"
  readonly firmwareVersion: string | null;
  readonly hardwareVersion: string; // ex: "Watch6,2",
  readonly localIdentifier: string | null;
  readonly manufacturer: string; // ex: "Apple Inc."
  readonly model: string; // ex: "Watch"
  readonly softwareVersion: string; // ex: "9.0"
  readonly udiDeviceIdentifier: string | null;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export type HKSource = {
  readonly name: string;
  readonly bundleIdentifier: string;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export type HKSourceRevision = {
  readonly source: HKSource;
  readonly version: string;
  readonly operatingSystemVersion?: string;
  readonly productType?: string;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export type HKQuantitySampleRaw<
  TQuantityIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TQuantityIdentifier> = UnitForIdentifier<TQuantityIdentifier>
> = {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly quantityType: TQuantityIdentifier;
  readonly startDate: string;
  readonly endDate: string;
  readonly quantity: number;
  readonly unit: TUnit;
  readonly metadata: MetadataMapperForQuantityIdentifier<TQuantityIdentifier>;
  readonly sourceRevision?: HKSourceRevision;
};

export type HKHeartbeatRaw = {
  readonly timeSinceSeriesStart: number;
  readonly precededByGap: boolean;
};

export type HKHeartbeatSeriesSampleRaw = {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly startDate: string;
  readonly endDate: string;
  readonly heartbeats: readonly HKHeartbeatRaw[];
  readonly metadata?: HKHeartbeatSeriesSampleMetadata;
  readonly sourceRevision?: HKSourceRevision;
};

export type CLLocationRawForSaving = {
  readonly latitude: number;
  readonly longitude: number;
  readonly altitude: number;
  readonly horizontalAccuracy: number;
  readonly verticalAccuracy: number;
  readonly course: number;
  readonly speed: number;
  readonly timestamp: string; // unix timestamp in milliseconds
};

export type HKQuantitySampleRawForSaving<
  TQuantityIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TQuantityIdentifier> = UnitForIdentifier<TQuantityIdentifier>
> = Omit<
HKQuantitySampleRaw<TQuantityIdentifier, TUnit>,
'device' | 'endDate' | 'startDate' | 'uuid'
> & {
  readonly startDate?: string;
  readonly endDate?: string;
};

export type HKCategorySampleRawForSaving<
  TCategory extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = Omit<
HKCategorySampleRaw<TCategory>,
'device' | 'endDate' | 'startDate' | 'uuid'
> & {
  readonly startDate?: string;
  readonly endDate?: string;
};

export interface HKWorkoutEvent {
  readonly type: HKWorkoutEventType;
  readonly startDate: string;
  readonly endDate: string;
}

export enum HKWorkoutEventType {
  pause = 1,
  resume = 2,
  lap = 3,
  marker = 4,
  motionPaused = 5,
  motionResumed = 6,
  segment = 7,
  pauseOrResumeRequest = 8,
}

export interface HKWorkoutActivity {
  readonly startDate: string;
  readonly endDate: string;
  readonly uuid: string;
  readonly duration: number;
}

export type HKWorkoutRaw<
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
> = {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly workoutActivityType: HKWorkoutActivityType;
  readonly duration: number;
  readonly totalDistance?: HKQuantity<HKQuantityTypeIdentifier, TDistance>;
  readonly totalEnergyBurned?: HKQuantity<HKQuantityTypeIdentifier, TEnergy>;
  readonly totalSwimmingStrokeCount?: HKQuantity<
  HKQuantityTypeIdentifier,
  HKUnits.Count
  >;
  readonly totalFlightsClimbed?: HKQuantity<
  HKQuantityTypeIdentifier,
  HKUnits.Count
  >;
  readonly startDate: string;
  readonly endDate: string;
  readonly metadata?: HKWorkoutMetadata;
  readonly sourceRevision?: HKSourceRevision;
  readonly events?: readonly HKWorkoutEvent[];
  readonly activities?: readonly HKWorkoutActivity[];
  readonly workoutPlanId?: string;
};

// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export enum HKCharacteristicTypeIdentifier {
  fitzpatrickSkinType = 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  biologicalSex = 'HKCharacteristicTypeIdentifierBiologicalSex',
  bloodType = 'HKCharacteristicTypeIdentifierBloodType',
  dateOfBirth = 'HKCharacteristicTypeIdentifierDateOfBirth',
  wheelchairUse = 'HKCharacteristicTypeIdentifierWheelchairUse',
  activityMoveMode = 'HKCharacteristicTypeIdentifierActivityMoveMode', // HKActivityMoveModeObject
}

export type WritePermissions = {
  readonly [key in
  | HKCategoryTypeIdentifier
  | HKCharacteristicTypeIdentifier
  | HKQuantityTypeIdentifier]: boolean;
};

export type ReadPermissions = {
  readonly [key in
  | HKCategoryTypeIdentifier
  | HKCharacteristicTypeIdentifier
  | HKQuantityTypeIdentifier]: boolean;
};

export type HKCategorySampleRaw<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly categoryType: T;
  readonly startDate: string;
  readonly endDate: string;
  readonly value: HKCategoryValueForIdentifier<T>;
  readonly metadata: MetadataMapperForCategoryIdentifier<T>;
  readonly sourceRevision?: HKSourceRevision;
};

export type DeletedCategorySampleRaw<T extends HKCategoryTypeIdentifier> = {
  readonly uuid: string;
  readonly metadata: MetadataMapperForCategoryIdentifier<T>;
};

export type DeletedHeartbeatSeriesSampleRaw = {
  readonly uuid: string;
  readonly metadata: HKHeartbeatSeriesSampleMetadata;
};

export type DeletedQuantitySampleRaw<T extends HKQuantityTypeIdentifier> = {
  readonly uuid: string;
  readonly metadata: MetadataMapperForQuantityIdentifier<T>;
};

export type QueryCategorySamplesResponseRaw<
  T extends HKCategoryTypeIdentifier
> = {
  readonly samples: readonly HKCategorySampleRaw<T>[];
  readonly deletedSamples: readonly DeletedCategorySampleRaw<T>[];
  readonly newAnchor: string;
};

export type QueryHeartbeatSeriesSamplesResponseRaw = {
  readonly samples: readonly HKHeartbeatSeriesSampleRaw[];
  readonly deletedSamples: readonly DeletedHeartbeatSeriesSampleRaw[];
  readonly newAnchor: string;
};

export type QueryQuantitySamplesResponseRaw<
  T extends HKQuantityTypeIdentifier
> = {
  readonly samples: readonly HKQuantitySampleRaw<T>[];
  readonly deletedSamples: readonly DeletedQuantitySampleRaw<T>[];
  readonly newAnchor: string;
};

export type HKCorrelationRaw<TIdentifier extends HKCorrelationTypeIdentifier> =
  {
    readonly correlationType: HKCorrelationTypeIdentifier;
    readonly objects: readonly (HKCategorySampleRaw | HKQuantitySampleRaw)[];
    readonly metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>;
    readonly startDate: string;
    readonly endDate: string;
  };

type QueryId = string;

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
export enum HKUpdateFrequency {
  immediate = 1,
  hourly = 2,
  daily = 3,
  weekly = 4,
}

export type WorkoutLocation = {
  readonly longitude: number;
  readonly latitude: number;
  readonly altitude: number;
  readonly speed: number;
  readonly timestamp: number;
  readonly horizontalAccuracy: number;
  readonly speedAccuracy: number;
  readonly verticalAccuracy: number;
  readonly distance: number | null;
};

export type WorkoutRoute = {
  readonly locations: readonly WorkoutLocation[];
  readonly HKMetadataKeySyncIdentifier?: string;
  readonly HKMetadataKeySyncVersion?: number;
};

type ReactNativeHealthkitTypeNative = {
  /**
   *  @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614180-ishealthdataavailable Apple Docs }
   */
  isHealthDataAvailable(): Promise<boolean>;
  // Todo [>8]: Rename to align with Apple function name (isProtectedDataAvailable) - remember to rename native code :)
  canAccessProtectedData(): Promise<boolean>;
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<string>;
  getBiologicalSex(): Promise<HKBiologicalSex>;
  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
  readonly getWheelchairUse: () => Promise<HKWheelchairUse>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614175-enablebackgrounddelivery Apple Docs }
   */
  readonly enableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier,
    updateFrequency: HKUpdateFrequency
  ) => Promise<boolean>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614177-disablebackgrounddelivery Apple Docs }
   */
  readonly disableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier
  ) => Promise<boolean>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614158-disableallbackgrounddelivery Apple Docs }
   */
  readonly disableAllBackgroundDelivery: () => Promise<boolean>;

  readonly saveCorrelationSample: <
    TIdentifier extends HKCorrelationTypeIdentifier,
    TSamples extends readonly (
      | HKCategorySampleRawForSaving
      | HKQuantitySampleRawForSaving
    )[]
  >(
    typeIdentifier: TIdentifier,
    samples: TSamples,
    start: string,
    end: string,
    metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>
  ) => Promise<boolean>;

  readonly saveWorkoutSample: (
    typeIdentifier: HKWorkoutActivityType,
    quantities: readonly HKQuantitySampleRawForSaving[],
    start: string,
    end: string,
    totals: {
      readonly distance?: number;
      readonly energyBurned?: number;
    },
    metadata: HKWorkoutMetadata
  ) => Promise<string | null>;

  readonly saveWorkoutRoute: (
    workoutUUID: string,
    locations: readonly CLLocationRawForSaving[]
  ) => Promise<boolean>;

  readonly queryCorrelationSamples: <
    TIdentifier extends HKCorrelationTypeIdentifier
  >(
    typeIdentifier: TIdentifier,
    from: string,
    to: string
  ) => Promise<readonly HKCorrelationRaw<TIdentifier>[]>;

  subscribeToObserverQuery(
    identifier: HKSampleTypeIdentifier
  ): Promise<QueryId>;
  unsubscribeQuery(queryId: QueryId): Promise<boolean>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614154-authorizationstatus Apple Docs }
   */
  authorizationStatusFor(
    type: HealthkitReadAuthorization
  ): Promise<HKAuthorizationStatus>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/2994346-getrequeststatusforauthorization Apple Docs }
   */
  getRequestStatusForAuthorization(
    write: WritePermissions,
    read: ReadPermissions
  ): Promise<HKAuthorizationRequestStatus>;
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs }
   */
  requestAuthorization(
    write: WritePermissions,
    read: ReadPermissions
  ): Promise<boolean>;
  readonly saveQuantitySample: <
    TType extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TType> = UnitForIdentifier<TType>
  >(
    identifier: TType,
    unit: TUnit,
    value: number,
    start: string,
    end: string,
    metadata: unknown
  ) => Promise<boolean>;
  readonly deleteQuantitySample: <TIdentifier extends HKQuantityTypeIdentifier>(
    typeIdentifier: TIdentifier,
    uuid: string
  ) => Promise<boolean>;
  readonly deleteSamples: <TIdentifier extends HKQuantityTypeIdentifier>(
    identifier: TIdentifier,
    start: string,
    end: string
  ) => Promise<boolean>;
  readonly queryWorkoutSamples: <
    TEnergy extends EnergyUnit,
    TDistance extends LengthUnit
  >(
    energyUnit: TEnergy,
    distanceUnit: TDistance,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKWorkoutRaw<TEnergy, TDistance>[]>;
  readonly queryCategorySamples: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKCategorySampleRaw<T>[]>;
  readonly queryQuantitySamples: <
    TIdentifier extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TIdentifier>
  >(
    identifier: TIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKQuantitySampleRaw<TIdentifier>[]>;
  readonly queryCategorySamplesWithAnchor: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryCategorySamplesResponseRaw<T>>;
  readonly queryQuantitySamplesWithAnchor: <
    TIdentifier extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TIdentifier>
  >(
    identifier: TIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryQuantitySamplesResponseRaw<TIdentifier>>;
  readonly queryHeartbeatSeriesSamples: (
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKHeartbeatSeriesSampleRaw[]>;
  readonly queryHeartbeatSeriesSamplesWithAnchor: (
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryHeartbeatSeriesSamplesResponseRaw>;
  readonly querySources: <
    TIdentifier extends HKCategoryTypeIdentifier | HKQuantityTypeIdentifier
  >(
    identifier: TIdentifier
  ) => Promise<readonly HKSource[]>;
  readonly saveCategorySample: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    value: HKCategoryValueForIdentifier<T>,
    start: string,
    end: string,
    metadata: unknown
  ) => Promise<boolean>;
  readonly queryStatisticsForQuantity: <
    TIdentifier extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TIdentifier>
  >(
    identifier: HKQuantityTypeIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    options: readonly HKStatisticsOptions[]
  ) => Promise<QueryStatisticsResponseRaw<TIdentifier, TUnit>>;
  readonly getPreferredUnits: (
    identifiers: readonly HKQuantityTypeIdentifier[]
  ) => Promise<TypeToUnitMapping>;
  readonly getWorkoutRoutes: (
    workoutUUID: string
  ) => Promise<readonly WorkoutRoute[]>;
  readonly getWorkoutPlanById: (workoutUUID: string) => Promise<{readonly id: string, readonly activityType: HKWorkoutActivityType} | null>;
};

const Native = NativeModules.ReactNativeHealthkit as ReactNativeHealthkitTypeNative

type OnChangeCallback = ({
  typeIdentifier,
}: {
  readonly typeIdentifier: HKSampleTypeIdentifier;
}) => void;

interface HealthkitEventEmitter extends NativeEventEmitter {
  readonly addListener: (
    eventType: 'onChange',
    callback: OnChangeCallback
  ) => EmitterSubscription;
}

export const EventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeHealthkit as NativeModule,
) as HealthkitEventEmitter

export default Native
