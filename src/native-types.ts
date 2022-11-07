import { NativeEventEmitter, NativeModules } from 'react-native'

import type { EmitterSubscription, NativeModule } from 'react-native'

export const HKWorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier' as const
export const HKAudiogramTypeIdentifier = 'HKAudiogramTypeIdentifier' as const
export const HKWorkoutRouteTypeIdentifier = 'HKWorkoutRouteTypeIdentifier' as const
export const HKDataTypeIdentifierHeartbeatSeries = 'HKDataTypeIdentifierHeartbeatSeries' as const

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

  appleMoveTime = 'HKQuantityTypeIdentifierAppleMoveTime', // Time,                        Cumulative
  appleWalkingSteadiness = 'HKQuantityTypeIdentifierAppleWalkingSteadiness', // Scalar(Percent, 0.0 - 1.0),  Discrete

  numberOfAlcoholicBeverages = 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages', // Scalar(Count),               Cumulative
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

export enum HKCorrelationTypeIdentifier {
  bloodPressure = 'HKCorrelationTypeIdentifierBloodPressure',
  food = 'HKCorrelationTypeIdentifierFood',
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

export type HKQuantity<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>
> = {
  readonly unit: TUnit;
  readonly quantity: number;
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
  | HKCategoryValueCervicalMucusQuality
  | HKCategoryValueLowCardioFitnessEvent
  | HKCategoryValueMenstrualFlow
  | HKCategoryValueOvulationTestResult
  | HKCategoryValuePresence
  | HKCategoryValueSeverity
  | HKCategoryValueSleepAnalysis
  | number;

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

export type HKDevice = {
  readonly name: string; // ex: "Apple Watch"
  readonly firmwareVersion: string | null;
  readonly hardwareVersion: string; // ex: "Watch6,2",
  readonly localIdentifier: string | null;
  readonly manufacturer: string; // ex: "Apple Inc."
  readonly model: string; // ex: "Watch"
  readonly softwareVersion: string; // ex: "9.0"
};

export type HKSource = {
  readonly name: string;
  readonly bundleIdentifier: string;
};

export type HKSourceRevision = {
  readonly source: HKSource;
  readonly version: string;
  readonly operatingSystemVersion?: string;
  readonly productType?: string;
};

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

export type HKQuantitySampleRawForSaving<
  TQuantityIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TQuantityIdentifier> = UnitForIdentifier<TQuantityIdentifier>
> = Omit<
HKQuantitySampleRaw<TQuantityIdentifier, TUnit>,
'device' | 'endDate' | 'startDate' | 'uuid'
>;

export type HKCategorySampleRawForSaving<
  TCategory extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = Omit<
HKCategorySampleRaw<TCategory>,
'device' | 'endDate' | 'startDate' | 'uuid'
>;

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

export type HKCorrelationRaw<TIdentifier extends HKCorrelationTypeIdentifier> =
  {
    readonly correlationType: HKCorrelationTypeIdentifier;
    readonly objects: readonly (HKCategorySampleRaw | HKQuantitySampleRaw)[];
    readonly metadata: MetadataMapperForCorrelationIdentifier<TIdentifier>;
    readonly startDate: string;
    readonly endDate: string;
  };

type QueryId = string;

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
  isHealthDataAvailable(): Promise<boolean>;
  canAccessProtectedData(): Promise<boolean>;
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<string>;
  getBiologicalSex(): Promise<HKBiologicalSex>;
  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
  readonly getWheelchairUse: () => Promise<HKWheelchairUse>;

  readonly enableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier,
    updateFrequency: HKUpdateFrequency
  ) => Promise<boolean>;
  readonly disableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier
  ) => Promise<boolean>;
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
    metadata: HKWorkoutMetadata
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
  authorizationStatusFor(type: HealthkitReadAuthorization): Promise<boolean>;
  getRequestStatusForAuthorization(
    write: WritePermissions,
    read: ReadPermissions
  ): Promise<HKAuthorizationRequestStatus>;
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
  ) => Promise<readonly HKQuantitySampleRaw<TIdentifier, TUnit>[]>;
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
