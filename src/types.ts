import type { EmitterSubscription } from 'react-native';

// Straight mapping to https://developer.apple.com/documentation/healthkit/hkcharacteristictypeidentifier
export enum HKCharacteristicTypeIdentifier {
  fitzpatrickSkinType = 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  biologicalSex = 'HKCharacteristicTypeIdentifierBiologicalSex',
  bloodType = 'HKCharacteristicTypeIdentifierBloodType',
  dateOfBirth = 'HKCharacteristicTypeIdentifierDateOfBirth',
  wheelchairUse = 'HKCharacteristicTypeIdentifierWheelchairUse',
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

export enum HKUnitNonSI {
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
}

export enum HKOtherUnit {
  Mmol_glucose = 'mol<180.15588000005408>',
}

export type HKUnit = HKUnitSI | HKUnitNonSI | HKOtherUnit;

export const SIUnitWithPrefix = (prefix: HKUnitSIPrefix, unit: HKUnitSI) => {
  return `${prefix}${unit}` as HKUnit;
};

export type QuantitySampleRaw = {
  startDate: number;
  endDate: number;
  quantity: number;
  unit: HKUnit;
};

export type QuantitySample = {
  startDate: Date;
  endDate: Date;
  quantity: number;
  unit: HKUnit;
};

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

  uvExposure = 'HKQuantityTypeIdentifierUvExposure', // Scalar (Count), Discrete
}

export type WritePermssions = {
  [key in HKCharacteristicTypeIdentifier | HKQuantityTypeIdentifier]: boolean;
};

export type ReadPermssions = {
  [key in HKQuantityTypeIdentifier]: boolean;
};

export enum HKAuthorizationRequestStatus {
  unknown = 0,
  shouldRequest = 1,
  unnecessary = 2,
}

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

export type TypeToUnitMapping = {
  [key in HKQuantityTypeIdentifier]: HKUnit;
};

export type ReactNativeHealthkit = {
  isHealthDataAvailable(): Promise<boolean>;
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<Date>;
  getBiologicalSex(): Promise<HKBiologicalSex>;

  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
  authorizationStatusFor(
    type: HKQuantityTypeIdentifier | HKCharacteristicTypeIdentifier
  ): Promise<boolean>;
  getRequestStatusForAuthorization(
    write: WritePermssions | {},
    read: ReadPermssions | {}
  ): Promise<HKAuthorizationRequestStatus>;
  requestAuthorization: (
    read: (HKCharacteristicTypeIdentifier | HKQuantityTypeIdentifier)[],
    write?: HKQuantityTypeIdentifier[]
  ) => Promise<boolean>;
  observe(identifier: HKQuantityTypeIdentifier, unit: HKUnit): Promise<boolean>;
  writeSample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    options?: {
      start?: Date;
      end?: Date;
      metadata?: any;
    }
  ) => Promise<boolean>;
  getLastSample: (
    identifier: HKQuantityTypeIdentifier,
    unit?: HKUnit
  ) => Promise<QuantitySample>;
  getLastSamples: (
    identifier: HKQuantityTypeIdentifier,
    limit?: number,
    unit?: HKUnit
  ) => Promise<QuantitySample[]>;
  getSamplesBetween: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: Date,
    to?: Date
  ) => Promise<QuantitySample[]>;
  getPreferredUnits: (
    identifiers: [HKQuantityTypeIdentifier]
  ) => Promise<TypeToUnitMapping>;
  getPreferredUnit: (identifier: HKQuantityTypeIdentifier) => Promise<HKUnit>;
  on: (
    identifier: HKQuantityTypeIdentifier,
    callback: (samples: QuantitySample[]) => void,
    unit?: HKUnit
  ) => Promise<EmitterSubscription>;
  off: (subscription: EmitterSubscription) => void;
};
