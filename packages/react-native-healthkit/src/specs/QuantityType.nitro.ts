import type { HybridObject } from "react-native-nitro-modules";
import type { HKGenericMetadata, HKQuantity } from "./Shared";
import type { HKWorkoutRaw } from "../types/HKWorkoutRaw";
import type { BloodGlucoseUnit, CountPerTime, EnergyUnit, HKUnit, LengthUnit, MassUnit, SpeedUnit, TemperatureUnit, TimeUnit, VolumeUnit } from "../types/Units";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKQuantitySampleRaw } from "../types/HKQuantitySampleRaw";

export interface DeletedQuantitySampleRaw {
  readonly uuid: string;
  readonly metadata: HKGenericMetadata;
};


interface QuantityDateInterval {
  readonly from: string;
  readonly to: string;
};

export interface QueryStatisticsResponseRaw {
  readonly averageQuantity?: HKQuantity;
  readonly maximumQuantity?: HKQuantity;
  readonly minimumQuantity?: HKQuantity;
  readonly sumQuantity?: HKQuantity;
  readonly mostRecentQuantity?: HKQuantity;
  readonly mostRecentQuantityDateInterval?: QuantityDateInterval;
  readonly duration?: HKQuantity;
};


export interface QueryQuantitySamplesResponseRaw {
  readonly samples: readonly HKQuantitySampleRaw[];
  readonly deletedSamples: readonly DeletedQuantitySampleRaw[];
  readonly newAnchor: string;
};

export interface HKQuantityRaw {
  readonly unit: string;
  readonly quantity: number;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason Apple Docs }
 */
export enum HKInsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}

export enum HKHeartRateMotionContext {
  active = 2,
  notSet = 0,
  sedentary = 1,
}


export interface IntervalComponents {
  readonly minute?: number;
  readonly hour?: number;
  readonly day?: number;
  readonly month?: number;
  readonly year?: number;
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstatisticsoptions Apple Docs }
 */
export type HKStatisticsOptions =
  | 'cumulativeSum'
  | 'discreteAverage'
  | 'discreteMax'
  | 'discreteMin'
  | 'discreteMostRecent'
  | 'duration'
  | 'mostRecent'
  | 'separateBySource'

export type MetadataMapperForQuantityIdentifier<
  TQuantityTypeIdentifier = HKQuantityTypeIdentifier
> = TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierInsulinDelivery'
  ? HKGenericMetadata & {
    readonly HKInsulinDeliveryReason: HKInsulinDeliveryReason;
  }
  : TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierBloodGlucose'
    ? HKGenericMetadata & {
      readonly HKBloodGlucoseMealTime?: number;
    }
    : TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierHeartRate'
      ? HKGenericMetadata & {
        readonly HKHeartRateMotionContext?: HKHeartRateMotionContext;
      }
      : HKGenericMetadata;

export type UnitForIdentifier<T extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier> =
  T extends 'HKQuantityTypeIdentifierBloodGlucose'
    ? BloodGlucoseUnit
    : T extends
    | 'HKQuantityTypeIdentifierAppleExerciseTime'
    | 'HKQuantityTypeIdentifierAppleMoveTime'
    | 'HKQuantityTypeIdentifierAppleStandTime'
      ? TimeUnit
      : T extends
      | 'HKQuantityTypeIdentifierActiveEnergyBurned'
      | 'HKQuantityTypeIdentifierBasalEnergyBurned'
      | 'HKQuantityTypeIdentifierDietaryEnergyConsumed'
        ? EnergyUnit
        : T extends
        | 'HKQuantityTypeIdentifierDistanceCycling'
        | 'HKQuantityTypeIdentifierDistanceDownhillSnowSports'
        | 'HKQuantityTypeIdentifierDistanceSwimming'
        | 'HKQuantityTypeIdentifierDistanceWalkingRunning'
        | 'HKQuantityTypeIdentifierDistanceWheelchair'
        | 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance'
        | 'HKQuantityTypeIdentifierWaistCircumference'
          ? LengthUnit
          : T extends
          | 'HKQuantityTypeIdentifierBodyFatPercentage'
          | 'HKQuantityTypeIdentifierOxygenSaturation'
          | 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage'
          | 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage'
            ? '%'
            : T extends
            | 'HKQuantityTypeIdentifierBasalBodyTemperature'

              ? TemperatureUnit
              : T extends
              | 'HKQuantityTypeIdentifierRunningSpeed'
              | 'HKQuantityTypeIdentifierStairAscentSpeed'
              | 'HKQuantityTypeIdentifierStairDescentSpeed'
              | 'HKQuantityTypeIdentifierWalkingSpeed'

                ? SpeedUnit<LengthUnit, TimeUnit>
                : T extends
                | 'HKQuantityTypeIdentifierFlightsClimbed'
                | 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages'
                | 'HKQuantityTypeIdentifierNumberOfTimesFallen'
                | 'HKQuantityTypeIdentifierPushCount'
                | 'HKQuantityTypeIdentifierStepCount'
                | 'HKQuantityTypeIdentifierSwimmingStrokeCount'
                  ? 'count'
                  : T extends
                  | 'HKQuantityTypeIdentifierDietaryBiotin'
                  | 'HKQuantityTypeIdentifierDietaryCaffeine'
                  | 'HKQuantityTypeIdentifierDietaryCalcium'
                  | 'HKQuantityTypeIdentifierDietaryCarbohydrates'
                  | 'HKQuantityTypeIdentifierDietaryChloride'
                  | 'HKQuantityTypeIdentifierDietaryCholesterol'
                  | 'HKQuantityTypeIdentifierDietaryChromium'
                  | 'HKQuantityTypeIdentifierDietaryCopper'
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
                  | 'HKQuantityTypeIdentifierDietaryVitaminB6'
                  | 'HKQuantityTypeIdentifierDietaryVitaminB12'
                  | 'HKQuantityTypeIdentifierDietaryVitaminC'
                  | 'HKQuantityTypeIdentifierDietaryVitaminD'
                  | 'HKQuantityTypeIdentifierDietaryVitaminE'
                  | 'HKQuantityTypeIdentifierDietaryVitaminK'
                  | 'HKQuantityTypeIdentifierDietaryZinc'
                    ? MassUnit
                    : T extends 'HKQuantityTypeIdentifierDietaryWater'
                      ? VolumeUnit
                      : T extends 'HKQuantityTypeIdentifierInsulinDelivery'
                        ? 'IU'
                        : T extends
                        | 'HKQuantityTypeIdentifierHeartRate'
                        | 'HKQuantityTypeIdentifierRestingHeartRate'
                        | 'HKQuantityTypeIdentifierWalkingHeartRateAverage'
                          ? CountPerTime<TimeUnit>
                          : HKUnit;



export interface QuantityType extends HybridObject<{ ios: 'swift' }> {

  readonly saveQuantitySample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    start: string,
    end: string,
    metadata: HKGenericMetadata
  ) => Promise<boolean>;

  readonly deleteQuantitySample: (
    identifier: HKQuantityTypeIdentifier,
    uuid: string
  ) => Promise<boolean>;
  
  readonly deleteSamples: (
    identifier: HKQuantityTypeIdentifier,  
    start: string,
    end: string
  ) => Promise<boolean>;
  
  readonly queryWorkoutSamples: (
    energyUnit: EnergyUnit,
    distanceUnit: LengthUnit,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKWorkoutRaw[]>;
  
  readonly queryQuantitySamples: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKQuantitySampleRaw[]>;

  readonly queryStatisticsForQuantity: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: string,
    to: string,
    options: readonly HKStatisticsOptions[],
  ) => Promise<QueryStatisticsResponseRaw>;

  readonly queryStatisticsCollectionForQuantity: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    options: readonly HKStatisticsOptions[],
    anchorDate: string,
    intervalComponents: IntervalComponents,
    startDate: string,
    endDate: string
  ) => Promise<readonly QueryStatisticsResponseRaw[]>;


  readonly queryQuantitySamplesWithAnchor: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryQuantitySamplesResponseRaw>;
}