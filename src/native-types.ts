import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

export type HKWorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier';
export type HKAudiogramTypeIdentifier = 'HKAudiogramTypeIdentifier';

export type HKSampleTypeIdentifier =
  | HKWorkoutTypeIdentifier
  | HKQuantityTypeIdentifier
  | HKCategoryTypeIdentifier
  | HKAudiogramTypeIdentifier
  | HKCorrelationTypeIdentifier;

export type TypeToUnitMapping = {
  [key in HKQuantityTypeIdentifier]: HKUnit;
};

export enum HKHeartRateMotionContext {
  active = 2,
  notSet = 0,
  sedentary = 1,
}

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
  audioExposureEvent = 'HKCategoryTypeIdentifierAudioExposureEvent',
  toothbrushingEvent = 'HKCategoryTypeIdentifierToothbrushingEvent',
}

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
  [key: string]: string | number | boolean | HKQuantity | undefined;
  HKExternalUUID?: string;
  HKTimeZone?: string;
  HKWasUserEntered?: boolean;
  HKDeviceSerialNumber?: string;
  HKUDIDeviceIdentifier?: string;
  HKUDIProductionIdentifier?: string;
  HKDigitalSignature?: string;
  HKDeviceName?: string;
  HKDeviceManufacturerName?: string;
  HKSyncIdentifier?: string;
  HKSyncVersion?: number;
  HKWasTakenInLab?: boolean;
  HKReferenceRangeLowerLimit?: number;
  HKReferenceRangeUpperLimit?: number;
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

export interface HKWorkoutMetadata
  extends HKGenericMetadata /*<TTemperatureUnit extends HKUnit>*/ {
  HKWeatherCondition?: HKWeatherCondition;
  HKWeatherHumidity?: HKQuantity<HKUnit.Percent>;
  // HKWeatherTemperature: HKQuantity<TTemperatureUnit>
}

// Straight mapping to https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier
export enum HKQuantityTypeIdentifier {
  bodyMassIndex = 'HKQuantityTypeIdentifierBodyMassIndex',
  bodyFatPercentage = 'HKQuantityTypeIdentifierBodyFatPercentage', // Scalar(Percent, 0.0 - 1.0),  Discrete
  height = 'HKQuantityTypeIdentifierHeight', // Length,                      Discrete
  bodyMass = 'HKQuantityTypeIdentifierBodyMass', // Mass,                        Discrete
  leanBodyMass = 'HKQuantityTypeIdentifierLeanBodyMass', // Mass,                        Discrete

  waistCircumference = 'HKQuantityTypeIdentifierWaistCircumference', // Length,                      Discrete
  // Fitness
  stepCount = 'HKQuantityTypeIdentifierStepCount', // Scalar(Count),               Cumulative
  distanceWalkingRunning = 'HKQuantityTypeIdentifierDistanceWalkingRunning', // Length,                      Cumulative
  distanceCycling = 'HKQuantityTypeIdentifierDistanceCycling', // Length,                      Cumulative
  distanceWheelchair = 'HKQuantityTypeIdentifierDistanceWheelchair', // Length,                      Cumulative
  basalEnergyBurned = 'HKQuantityTypeIdentifierBasalEnergyBurned', // Energy,                      Cumulative
  activeEnergyBurned = 'HKQuantityTypeIdentifierActiveEnergyBurned', // Energy,                      Cumulative
  flightsClimbed = 'HKQuantityTypeIdentifierFlightsClimbed', // Scalar(Count),               Cumulative
  nikeFuel = 'HKQuantityTypeIdentifierNikeFuel', // Scalar(Count),               Cumulative
  appleExerciseTime = 'HKQuantityTypeIdentifierAppleExerciseTime', // Time                         Cumulative
  pushCount = 'HKQuantityTypeIdentifierPushCount', // Scalar(Count),               Cumulative
  distanceSwimming = 'HKQuantityTypeIdentifierDistanceSwimming', // Length,                      Cumulative
  swimmingStrokeCount = 'HKQuantityTypeIdentifierSwimmingStrokeCount', // Scalar(Count),               Cumulative
  vo2Max = 'HKQuantityTypeIdentifierVo2Max', // ml/(kg*min)                  Discrete
  distanceDownhillSnowSports = 'HKQuantityTypeIdentifierDistanceDownhillSnowSports', // Length,                      Cumulative

  appleStandTime = 'HKQuantityTypeIdentifierAppleStandTime', // Time,                        Cumulative
  // Vitals
  heartRate = 'HKQuantityTypeIdentifierHeartRate', // Scalar(Count)/Time,          Discrete
  bodyTemperature = 'HKQuantityTypeIdentifierBodyTemperature', // Temperature,                 Discrete
  basalBodyTemperature = 'HKQuantityTypeIdentifierBasalBodyTemperature', // Basal Body Temperature,      Discrete
  bloodPressureSystolic = 'HKQuantityTypeIdentifierBloodPressureSystolic', // Pressure,                    Discrete
  bloodPressureDiastolic = 'HKQuantityTypeIdentifierBloodPressureDiastolic', // Pressure,                    Discrete
  respiratoryRate = 'HKQuantityTypeIdentifierRespiratoryRate', // Scalar(Count)/Time,          Discrete
  // Beats per minute estimate of a user's lowest heart rate while at rest
  restingHeartRate = 'HKQuantityTypeIdentifierRestingHeartRate', // Scalar(Count)/Time,          Discrete
  // Average heartbeats per minute captured by an Apple Watch while a user is walking
  walkingHeartRateAverage = 'HKQuantityTypeIdentifierWalkingHeartRateAverage', // Scalar(Count)/Time,          Discrete
  // The standard deviation of heart beat-to-beat intevals (Standard Deviation of Normal to Normal)

  heartRateVariabilitySDNN = 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN', // Time (ms),                   Discrete
  // Results
  oxygenSaturation = 'HKQuantityTypeIdentifierOxygenSaturation', // Scalar (Percent, 0.0 - 1.0,  Discrete
  peripheralPerfusionIndex = 'HKQuantityTypeIdentifierPeripheralPerfusionIndex', // Scalar(Percent, 0.0 - 1.0),  Discrete
  bloodGlucose = 'HKQuantityTypeIdentifierBloodGlucose', // Mass/Volume,                 Discrete
  numberOfTimesFallen = 'HKQuantityTypeIdentifierNumberOfTimesFallen', // Scalar(Count),               Cumulative
  electrodermalActivity = 'HKQuantityTypeIdentifierElectrodermalActivity', // Conductance,                 Discrete
  inhalerUsage = 'HKQuantityTypeIdentifierInhalerUsage', // Scalar(Count),               Cumulative
  insulinDelivery = 'HKQuantityTypeIdentifierInsulinDelivery', // Pharmacology (IU)            Cumulative
  bloodAlcoholContent = 'HKQuantityTypeIdentifierBloodAlcoholContent', // Scalar(Percent, 0.0 - 1.0),  Discrete
  forcedVitalCapacity = 'HKQuantityTypeIdentifierForcedVitalCapacity', // Volume,                      Discrete
  forcedExpiratoryVolume1 = 'HKQuantityTypeIdentifierForcedExpiratoryVolume1', // Volume,                      Discrete
  peakExpiratoryFlowRate = 'HKQuantityTypeIdentifierPeakExpiratoryFlowRate', // Volume/Time,                 Discrete
  environmentalAudioExposure = 'HKQuantityTypeIdentifierEnvironmentalAudioExposure', // Pressure,                    Cumulative

  headphoneAudioExposure = 'HKQuantityTypeIdentifierHeadphoneAudioExposure', // Pressure,                    Cumulative
  // Nutrition
  dietaryFatTotal = 'HKQuantityTypeIdentifierDietaryFatTotal', // Mass,   Cumulative
  dietaryFatPolyunsaturated = 'HKQuantityTypeIdentifierDietaryFatPolyunsaturated', // Mass,   Cumulative
  dietaryFatMonounsaturated = 'HKQuantityTypeIdentifierDietaryFatMonounsaturated', // Mass,   Cumulative
  dietaryFatSaturated = 'HKQuantityTypeIdentifierDietaryFatSaturated', // Mass,   Cumulative
  dietaryCholesterol = 'HKQuantityTypeIdentifierDietaryCholesterol', // Mass,   Cumulative
  dietarySodium = 'HKQuantityTypeIdentifierDietarySodium', // Mass,   Cumulative
  dietaryCarbohydrates = 'HKQuantityTypeIdentifierDietaryCarbohydrates', // Mass,   Cumulative
  dietaryFiber = 'HKQuantityTypeIdentifierDietaryFiber', // Mass,   Cumulative
  dietarySugar = 'HKQuantityTypeIdentifierDietarySugar', // Mass,   Cumulative
  dietaryEnergyConsumed = 'HKQuantityTypeIdentifierDietaryEnergyConsumed', // Energy, Cumulative
  dietaryProtein = 'HKQuantityTypeIdentifierDietaryProtein', // Mass,   Cumulative

  dietaryVitaminA = 'HKQuantityTypeIdentifierDietaryVitaminA', // Mass, Cumulative
  dietaryVitaminB6 = 'HKQuantityTypeIdentifierDietaryVitaminB6', // Mass, Cumulative
  dietaryVitaminB12 = 'HKQuantityTypeIdentifierDietaryVitaminB12', // Mass, Cumulative
  dietaryVitaminC = 'HKQuantityTypeIdentifierDietaryVitaminC', // Mass, Cumulative
  dietaryVitaminD = 'HKQuantityTypeIdentifierDietaryVitaminD', // Mass, Cumulative
  dietaryVitaminE = 'HKQuantityTypeIdentifierDietaryVitaminE', // Mass, Cumulative
  dietaryVitaminK = 'HKQuantityTypeIdentifierDietaryVitaminK', // Mass, Cumulative
  dietaryCalcium = 'HKQuantityTypeIdentifierDietaryCalcium', // Mass, Cumulative
  dietaryIron = 'HKQuantityTypeIdentifierDietaryIron', // Mass, Cumulative
  dietaryThiamin = 'HKQuantityTypeIdentifierDietaryThiamin', // Mass, Cumulative
  dietaryRiboflavin = 'HKQuantityTypeIdentifierDietaryRiboflavin', // Mass, Cumulative
  dietaryNiacin = 'HKQuantityTypeIdentifierDietaryNiacin', // Mass, Cumulative
  dietaryFolate = 'HKQuantityTypeIdentifierDietaryFolate', // Mass, Cumulative
  dietaryBiotin = 'HKQuantityTypeIdentifierDietaryBiotin', // Mass, Cumulative
  dietaryPantothenicAcid = 'HKQuantityTypeIdentifierDietaryPantothenicAcid', // Mass, Cumulative
  dietaryPhosphorus = 'HKQuantityTypeIdentifierDietaryPhosphorus', // Mass, Cumulative
  dietaryIodine = 'HKQuantityTypeIdentifierDietaryIodine', // Mass, Cumulative
  dietaryMagnesium = 'HKQuantityTypeIdentifierDietaryMagnesium', // Mass, Cumulative
  dietaryZinc = 'HKQuantityTypeIdentifierDietaryZinc', // Mass, Cumulative
  dietarySelenium = 'HKQuantityTypeIdentifierDietarySelenium', // Mass, Cumulative
  dietaryCopper = 'HKQuantityTypeIdentifierDietaryCopper', // Mass, Cumulative
  dietaryManganese = 'HKQuantityTypeIdentifierDietaryManganese', // Mass, Cumulative
  dietaryChromium = 'HKQuantityTypeIdentifierDietaryChromium', // Mass, Cumulative
  dietaryMolybdenum = 'HKQuantityTypeIdentifierDietaryMolybdenum', // Mass, Cumulative
  dietaryChloride = 'HKQuantityTypeIdentifierDietaryChloride', // Mass, Cumulative
  dietaryPotassium = 'HKQuantityTypeIdentifierDietaryPotassium', // Mass, Cumulative
  dietaryCaffeine = 'HKQuantityTypeIdentifierDietaryCaffeine', // Mass, Cumulative
  dietaryWater = 'HKQuantityTypeIdentifierDietaryWater', // Volume, Cumulative

  // Mobility
  sixMinuteWalkTestDistance = 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance',
  walkingSpeed = 'HKQuantityTypeIdentifierWalkingSpeed',
  walkingStepLength = 'HKQuantityTypeIdentifierWalkingStepLength',
  walkingAsymmetryPercentage = 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage',
  walkingDoubleSupportPercentage = 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage',
  stairAscentSpeed = 'HKQuantityTypeIdentifierStairAscentSpeed',
  stairDescentSpeed = 'HKQuantityTypeIdentifierStairDescentSpeed',

  uvExposure = 'HKQuantityTypeIdentifierUvExposure', // Scalar (Count), Discrete
}

export enum HKAuthorizationRequestStatus {
  unknown = 0,
  shouldRequest = 1,
  unnecessary = 2,
}

export enum HKAuthorizationStatus {
  notDetermined = 0,
  sharingDenied = 1,
  sharingAuthorized = 2,
}

export type HKQuantity<T extends HKUnit = HKUnit> = {
  unit: T;
  quantity: number;
};

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

export enum HKBiologicalSex {
  notSet = 0,
  female = 1,
  male = 2,
  other = 3,
}

export enum HKFitzpatrickSkinType {
  notSet = 0,
  I = 1,
  II = 2,
  III = 3,
  IV = 4,
  V = 5,
  VI = 6,
}

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

export type QueryStatisticsResponseRaw<TUnit extends HKUnit = HKUnit> = {
  averageQuantity?: HKQuantity<TUnit>;
  maximumQuantity?: HKQuantity<TUnit>;
  minimumQuantity?: HKQuantity<TUnit>;
  sumQuantity?: HKQuantity<TUnit>;
  mostRecentQuantity?: HKQuantity<TUnit>;
  mostRecentQuantityDateInterval?: { from: string; to: string };
  duration?: HKQuantity<HKUnit.Seconds>;
};

export enum HKCategoryValueCervicalMucusQuality {
  dry = 1,
  sticky = 2,
  creamy = 3,
  watery = 4,
  eggWhite = 5,
}

export enum HKCategoryValueMenstrualFlow {
  unspecified = 1,
  none = 5,
  light = 2,
  medium = 3,
  heavy = 4,
}

export enum HKCategoryValueOvulationTestResult {
  negative = 1,
  luteinizingHormoneSurge = 2,
  indeterminate = 3,
  estrogenSurge = 4,
}

export enum HKCategoryValueSleepAnalysis {
  inBed = 0,
  asleep = 1,
  awake = 2,
}

export enum HKCategoryValueAppetiteChanges {
  decreased = 2,
  increased = 3,
  noChange = 1,
  unspecified = 0,
}

export enum HKCategoryValuePresence {
  notPresent = 1,
  present = 0,
}

export enum HKCategoryValueSeverity {
  notPresent = 1,
  mild = 2,
  moderate = 3,
  severe = 4,
  unspecified = 0,
}

export enum HKCategoryValueNotApplicable {
  notApplicable = 0,
}

export type HKCategoryValue =
  | HKCategoryValueAppetiteChanges
  | HKCategoryValuePresence
  | HKCategoryValueSeverity
  | HKCategoryValuePresence
  | HKCategoryValueMenstrualFlow
  | HKCategoryValueSleepAnalysis
  | HKCategoryValueCervicalMucusQuality
  | HKCategoryValueOvulationTestResult
  | number;

export enum HKInsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}

export type MetadataMapperForQuantityIdentifier<
  TQuantityTypeIdentifier = HKQuantityTypeIdentifier
> = TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.insulinDelivery
  ? HKGenericMetadata & {
      HKInsulinDeliveryReason: HKInsulinDeliveryReason;
    }
  : TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.bloodGlucose
  ? HKGenericMetadata & {
      HKBloodGlucoseMealTime?: number;
    }
  : TQuantityTypeIdentifier extends HKQuantityTypeIdentifier.heartRate
  ? HKGenericMetadata & {
      HKHeartRateMotionContext?: HKHeartRateMotionContext;
    }
  : HKGenericMetadata;

export type MetadataMapperForCorrelationIdentifier<
  TCorrelationTypeIdentifier = HKCorrelationTypeIdentifier
> = TCorrelationTypeIdentifier extends HKCorrelationTypeIdentifier.food
  ? HKGenericMetadata & {
      HKFoodType?: string;
    }
  : HKGenericMetadata;

export type HKCategoryValueForIdentifier<T extends HKCategoryTypeIdentifier> =
  T extends HKCategoryTypeIdentifier.cervicalMucusQuality
    ? HKCategoryValueCervicalMucusQuality
    : T extends HKCategoryTypeIdentifier.menstrualFlow
    ? HKCategoryValueMenstrualFlow
    : T extends HKCategoryTypeIdentifier.ovulationTestResult
    ? HKCategoryValueOvulationTestResult
    : T extends HKCategoryTypeIdentifier.sleepAnalysis
    ? HKCategoryValueSleepAnalysis
    : T extends HKCategoryTypeIdentifier.mindfulSession
    ? HKCategoryValueNotApplicable
    : T extends HKCategoryTypeIdentifier.intermenstrualBleeding
    ? HKCategoryValueNotApplicable
    : T extends HKCategoryTypeIdentifier.highHeartRateEvent
    ? HKCategoryValueNotApplicable
    : T extends HKCategoryTypeIdentifier.sexualActivity
    ? HKCategoryValueNotApplicable
    : T extends HKCategoryTypeIdentifier.appleStandHour
    ? HKCategoryValueAppleStandHour
    : number;

export type MetadataMapperForCategoryIdentifier<
  T extends HKCategoryTypeIdentifier
> = T extends HKCategoryTypeIdentifier.sexualActivity
  ? HKGenericMetadata & {
      HKSexualActivityProtectionUsed: boolean;
    }
  : T extends HKCategoryTypeIdentifier.menstrualFlow
  ? HKGenericMetadata & {
      HKMenstrualCycleStart: boolean;
    }
  : HKGenericMetadata;

// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export enum HKWheelchairUse {
  notSet = 0,
  no = 1,
  yes = 2,
}

// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export enum HKUnitSIPrefix {
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
}

export enum HKUnitSI {
  Grams = 'g',
  Joules = 'J',
  Kelvin = 'K',
  Liters = 'l',
  Meters = 'm',
  Pascals = 'Pa',
  Seconds = 's',
  Siemens = 'S',
}

export enum HKUnit {
  Grams = 'g',
  Joules = 'J',
  Kelvin = 'K',
  Liters = 'l',
  Meters = 'm',
  Pascals = 'Pa',
  Seconds = 's',
  Siemens = 'S',

  Atmospheres = 'atm',
  CentimetersOfWater = 'cmAq',
  Count = 'count',
  Days = 'd',
  DecibelHearingLevel = 'dBHL',
  DecibelSoundPressureLevel = 'dBASPL',
  DegreesCelsius = 'degC',
  DegreesFahrenheit = 'degF',
  Feet = 'ft',
  Hertz = 'Hz',
  Hours = 'hr',
  ImperialCup = 'cup_imp',
  ImperialFluidOunces = 'fl_oz_imp',
  ImperialPint = 'pt_imp',
  Inches = 'in',
  InternationalUnit = 'IU',
  Kilocalories = 'kcal',
  LargeCalories = 'Cal',
  Miles = 'mi',
  MillimetersOfMercury = 'mmHg',
  Minutes = 'min',
  Ounces = 'oz',
  Percent = '%',
  Pounds = 'lb',
  SmallCalories = 'cal',
  Stones = 'st',
  USCup = 'cup_us',
  USFluidOunces = 'fl_oz_us',
  USPint = 'pt_us',
  Yard = 'yd',

  GlucoseMmolPerL = 'mmol<180.15588000005408>/l',
  GlucoseMgPerDl = 'mg/dL',
}

export type HKDevice = {
  name: string;
  firmwareVersion: string;
  hardwareVersion: string;
  localIdentifier: string;
  manufacturer: string;
  model: string;
  softwareVersion: string;
};

export type HKSource = {
  name: string;
  bundleIdentifier: string;
};

export type HKSourceRevision = {
  source: HKSource;
  version: string;
  operatingSystemVersion?: string;
  productType?: string;
};

export type HKQuantitySampleRaw<
  TQuantityIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
> = {
  uuid: string;
  device?: HKDevice;
  quantityType: TQuantityIdentifier;
  startDate: string;
  endDate: string;
  quantity: number;
  unit: TUnit;
  metadata: MetadataMapperForQuantityIdentifier<TQuantityIdentifier>;
  sourceRevision?: HKSourceRevision;
};

export type HKWorkoutRaw<TEnergy extends HKUnit, TDistance extends HKUnit> = {
  workoutActivityType: HKWorkoutActivityType;
  duration: number;
  totalDistance?: HKQuantity<TDistance>;
  totalEnergyBurned?: HKQuantity<TEnergy>;
  totalSwimmingStrokeCount?: HKQuantity<HKUnit.Count>;
  totalFlightsClimbed?: HKQuantity<HKUnit.Count>;
  startDate: string;
  endDate: string;
  metadata?: HKWorkoutMetadata;
  sourceRevision?: HKSourceRevision;
};

// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export enum HKCharacteristicTypeIdentifier {
  fitzpatrickSkinType = 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  biologicalSex = 'HKCharacteristicTypeIdentifierBiologicalSex',
  bloodType = 'HKCharacteristicTypeIdentifierBloodType',
  dateOfBirth = 'HKCharacteristicTypeIdentifierDateOfBirth',
  wheelchairUse = 'HKCharacteristicTypeIdentifierWheelchairUse',
}

export type WritePermssions = {
  [key in
    | HKCharacteristicTypeIdentifier
    | HKQuantityTypeIdentifier
    | HKCategoryTypeIdentifier]: boolean;
};

export type ReadPermssions = {
  [key in
    | HKQuantityTypeIdentifier
    | HKCharacteristicTypeIdentifier
    | HKCategoryTypeIdentifier]: boolean;
};

export type HKCategorySampleRaw<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = {
  uuid: string;
  device?: HKDevice;
  categoryType: T;
  startDate: string;
  endDate: string;
  value: HKCategoryValueForIdentifier<T>;
  metadata: MetadataMapperForCategoryIdentifier<T>;
  sourceRevision?: HKSourceRevision;
};

export type HKCorrelationRaw<TIdentifier extends HKCorrelationTypeIdentifier> =
  {
    correlationType: HKCorrelationTypeIdentifier;
    objects: (HKQuantitySampleRaw | HKCategorySampleRaw)[];
    metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>;
    startDate: string;
    endDate: string;
  };

type QueryId = string;

export enum HKCorrelationTypeIdentifier {
  bloodPressure = 'HKCorrelationTypeIdentifierBloodPressure',
  food = 'HKCorrelationTypeIdentifierFood',
}

export enum HKUpdateFrequency {
  immediate = 1,
  hourly = 2,
  daily = 3,
  weekly = 4,
}

export type WorkoutLocation = {
  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;
  timestamp: number;
  horizontalAccuracy: number;
  speedAccuracy: number;
  verticalAccuracy: number;
};

export type WorkoutRoute = {
  locations: WorkoutLocation[];
  HKMetadataKeySyncIdentifier?: string;
  HKMetadataKeySyncVersion?: number;
};

type ReactNativeHealthkitTypeNative = {
  isHealthDataAvailable(): Promise<boolean>;
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<string>;
  getBiologicalSex(): Promise<HKBiologicalSex>;
  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
  getWheelchairUse: () => Promise<HKWheelchairUse>;

  enableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier,
    updateFrequency: HKUpdateFrequency
  ) => Promise<boolean>;
  disableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier
  ) => Promise<boolean>;
  disableAllBackgroundDelivery: () => Promise<boolean>;

  saveCorrelationSample: <TIdentifier extends HKCorrelationTypeIdentifier>(
    typeIdentifier: TIdentifier,
    samples: Omit<
      HKQuantitySampleRaw | HKCategorySampleRaw,
      'startDate' | 'endDate' | 'uuid' | 'device'
    >[],
    start: string,
    end: string,
    metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>
  ) => Promise<boolean>;

  saveWorkoutSample: (
    typeIdentifier: HKWorkoutActivityType,
    quantities: Omit<
      HKQuantitySampleRaw,
      'startDate' | 'endDate' | 'uuid' | 'device'
    >[],
    start: string,
    end: string,
    metadata: HKWorkoutMetadata
  ) => Promise<boolean>;

  queryCorrelationSamples: <TIdentifier extends HKCorrelationTypeIdentifier>(
    typeIdentifier: TIdentifier,
    from: string,
    to: string
  ) => Promise<HKCorrelationRaw<TIdentifier>[]>;

  subscribeToObserverQuery(
    identifier: HKSampleTypeIdentifier
  ): Promise<QueryId>;
  unsubscribeQuery(queryId: QueryId): Promise<boolean>;
  authorizationStatusFor(
    type: HKSampleTypeIdentifier | HKCharacteristicTypeIdentifier
  ): Promise<boolean>;
  getRequestStatusForAuthorization(
    write: WritePermssions | {},
    read: ReadPermssions | {}
  ): Promise<HKAuthorizationRequestStatus>;
  requestAuthorization(
    write: WritePermssions | {},
    read: ReadPermssions | {}
  ): Promise<boolean>;
  saveQuantitySample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    start: string,
    end: string,
    metadata: Object
  ) => Promise<boolean>;
  queryWorkoutSamples: <TEnergy extends HKUnit, TDistance extends HKUnit>(
    energyUnit: TEnergy,
    distanceUnit: TDistance,
    from: string,
    to: string,
    limit: Number,
    ascending: boolean
  ) => Promise<HKWorkoutRaw<TEnergy, TDistance>[]>;
  queryCategorySamples: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    from: string,
    to: string,
    limit: Number,
    ascending: boolean
  ) => Promise<HKCategorySampleRaw<T>[]>;
  queryQuantitySamples: <
    TUnit extends HKUnit,
    TIdentifier extends HKQuantityTypeIdentifier
  >(
    identifier: TIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    limit: Number,
    ascending: boolean
  ) => Promise<HKQuantitySampleRaw<TIdentifier, TUnit>[]>;
  saveCategorySample: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    value: HKCategoryValueForIdentifier<T>,
    start: string,
    end: string,
    metadata: Object
  ) => Promise<boolean>;
  queryStatisticsForQuantity: <TUnit extends HKUnit>(
    identifier: HKQuantityTypeIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    options: HKStatisticsOptions[]
  ) => Promise<QueryStatisticsResponseRaw<TUnit>>;
  getPreferredUnits: (
    identifiers: HKQuantityTypeIdentifier[]
  ) => Promise<TypeToUnitMapping>;
  getWorkoutRoutes: (workoutUUID: string) => Promise<WorkoutRoute[]>;
};

const Native =
  NativeModules.ReactNativeHealthkit as ReactNativeHealthkitTypeNative;

type OnChangeCallback = ({
  typeIdentifier,
}: {
  typeIdentifier: HKSampleTypeIdentifier;
}) => void;

interface HealthkitEventEmitter extends NativeEventEmitter {
  addListener: (
    eventType: 'onChange',
    callback: OnChangeCallback
  ) => EmitterSubscription;
}

export const EventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeHealthkit
) as HealthkitEventEmitter;

export default Native;
