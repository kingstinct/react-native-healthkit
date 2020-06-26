import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

export enum HKCharacteristicTypeIdentifier {
  fitzpatrickSkinType = 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  biologicalSex = 'HKCharacteristicTypeIdentifierBiologicalSex',
  bloodType = 'HKCharacteristicTypeIdentifierBloodType',
  dateOfBirth = 'HKCharacteristicTypeIdentifierDateOfBirth',
}

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

export enum OtherUnit {
  Mmol_glucose = 'mol<180.15588000005408>',
}

export type HKUnit = HKUnitSI | HKUnitNonSI | OtherUnit;

export const UnitWithPrefix = (prefix: HKUnitSIPrefix, unit: HKUnitSI) => {
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

type WritePermssions = {
  [key in HKCharacteristicTypeIdentifier | HKQuantityTypeIdentifier]: boolean;
};

type ReadPermssions = {
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

type TypeToUnitMapping = {
  [key in HKQuantityTypeIdentifier]: HKUnit;
};

type ReactNativeHealthkitTypeNative = {
  isHealthDataAvailable(): Promise<boolean>;
  getBloodType(): Promise<HKBloodType>;
  getDateOfBirth(): Promise<number>;
  getBiologicalSex(): Promise<HKBiologicalSex>;
  getFitzpatrickSkinType(): Promise<HKFitzpatrickSkinType>;
  authorizationStatusFor(
    type: HKQuantityTypeIdentifier | HKCharacteristicTypeIdentifier
  ): Promise<boolean>;
  getRequestStatusForAuthorization(
    write: WritePermssions | {},
    read: ReadPermssions | {}
  ): Promise<HKAuthorizationRequestStatus>;
  requestAuthorization(
    write: WritePermssions | {},
    read: ReadPermssions | {}
  ): Promise<boolean>;
  observe(identifier: HKQuantityTypeIdentifier, unit: HKUnit): Promise<boolean>;
  writeSample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    start: string,
    end: string,
    metadata: any
  ) => Promise<boolean>;
  getLastSamples: (
    identifier: HKQuantityTypeIdentifier,
    limit: number,
    unit: HKUnit
  ) => Promise<QuantitySampleRaw[]>;
  getSamplesBetween: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: string,
    to: string
  ) => Promise<QuantitySampleRaw[]>;
  getPreferredUnits: (
    identifiers: [HKQuantityTypeIdentifier]
  ) => Promise<TypeToUnitMapping>;
};

const Native = NativeModules.ReactNativeHealthkit as ReactNativeHealthkitTypeNative;

/*export default {
  isHealthDataAvailable: ReactNativeHealthkit.isHealthDataAvailable,
};*/

const getPreferredUnit = async (type: HKQuantityTypeIdentifier) => {
  const unit = await Native.getPreferredUnits([type]);
  return unit[type];
};

const iosTimestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

const deserializeSample = (sample: QuantitySampleRaw): QuantitySample => {
  return {
    ...sample,
    startDate: iosTimestampToDate(sample.startDate),
    endDate: iosTimestampToDate(sample.endDate),
  };
};

const HealthkitEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeHealthkit
);

const getLastSamples = async (
  identifier: HKQuantityTypeIdentifier,
  limit: number = 1,
  unit?: HKUnit
) => {
  let actualUnit = unit || (await getPreferredUnit(identifier));
  const samples = await Native.getLastSamples(identifier, limit, actualUnit);
  return samples.map((s) => deserializeSample(s));
};

export default {
  ...Native,
  getPreferredUnit,
  getDateOfBirth: async () => {
    const dateOfBirth = await Native.getDateOfBirth();
    return new Date(dateOfBirth * 1000);
  },
  getSamplesBetween: async (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: Date,
    to: Date = new Date()
  ) => {
    const samples = await Native.getSamplesBetween(
      identifier,
      unit,
      from.toISOString(),
      to.toISOString()
    );
    return samples.map(deserializeSample);
  },
  getLastSamples,
  getLastSample: async (
    identifier: HKQuantityTypeIdentifier,
    unit?: HKUnit
  ) => {
    const samples = await getLastSamples(identifier, 1, unit);
    return samples[0];
  },
  on: async (
    identifier: HKQuantityTypeIdentifier,
    callback: (samples: QuantitySample[]) => void,
    unit?: HKUnit
  ) => {
    let actualUnit = unit || (await getPreferredUnit(identifier));
    const listener = ({
      samples,
      sampleTypeIdentifier,
    }: {
      samples: QuantitySampleRaw[];
      sampleTypeIdentifier: HKQuantityTypeIdentifier;
    }) => {
      if (sampleTypeIdentifier === identifier) {
        callback(samples.map(deserializeSample));
      }
    };
    const subscription = HealthkitEmitter.addListener(
      'onQueryUpdated',
      listener
    );
    await Native.observe(identifier, actualUnit).catch((error) => {
      HealthkitEmitter.removeSubscription(subscription);
      throw new error();
    });
    return subscription;
  },
  off: (subscription: EmitterSubscription) => {
    HealthkitEmitter.removeSubscription(subscription);
  },
  writeSample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    options?: {
      start?: Date;
      end?: Date;
      metadata?: any;
    }
  ) => {
    const start = options?.start || options?.end || new Date();
    const end = options?.end || options?.start || new Date();
    const metadata = options?.metadata || {};

    return Native.writeSample(
      identifier,
      unit,
      value,
      start.toISOString(),
      end.toISOString(),
      metadata
    );
  },
};
