import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { DeletedSample, GenericMetadata } from "./Shared";
import type { WorkoutSample } from "../types/WorkoutSample";
import type { BloodGlucoseUnit, CountPerTime, EnergyUnit, Unit, LengthUnit, MassUnit, SpeedUnit, TemperatureUnit, TimeUnit, VolumeUnit } from "../types/Units";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";
import type { QuantitySampleRaw } from "../types/QuantitySampleRaw";

interface QuantityDateInterval {
  readonly fromTimestamp: number;
  readonly toTimestamp: number;
};

export interface QueryStatisticsResponseRaw {
  readonly averageQuantity?: QuantityRaw;
  readonly maximumQuantity?: QuantityRaw;
  readonly minimumQuantity?: QuantityRaw;
  readonly sumQuantity?: QuantityRaw;
  readonly mostRecentQuantity?: QuantityRaw;
  readonly mostRecentQuantityDateInterval?: QuantityDateInterval;
  readonly duration?: QuantityRaw;
};


export interface QueryQuantitySamplesResponseRaw {
  readonly samples: readonly QuantitySampleRaw[];
  readonly deletedSamples: readonly DeletedSample[];
  readonly newAnchor: string;
};

export interface QuantityRaw {
  readonly unit: string;
  readonly quantity: number;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason Apple Docs }
 */
export enum InsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}

export enum HeartRateMotionContext {
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
export type StatisticsOptions =
  | 'cumulativeSum'
  | 'discreteAverage'
  | 'discreteMax'
  | 'discreteMin'
  | 'discreteMostRecent'
  | 'duration'
  | 'mostRecent'
  | 'separateBySource'

export type MetadataMapperForQuantityIdentifier<
  TQuantityTypeIdentifier = QuantityTypeIdentifier
> = TQuantityTypeIdentifier extends 'QuantityTypeIdentifierInsulinDelivery'
  ? GenericMetadata & {
    readonly HKInsulinDeliveryReason: InsulinDeliveryReason;
  }
  : TQuantityTypeIdentifier extends 'QuantityTypeIdentifierBloodGlucose'
    ? GenericMetadata & {
      readonly HKBloodGlucoseMealTime?: number;
    }
    : TQuantityTypeIdentifier extends 'QuantityTypeIdentifierHeartRate'
      ? GenericMetadata & {
        readonly HKHeartRateMotionContext?: HeartRateMotionContext;
      }
      : GenericMetadata;

export type UnitForIdentifier<T extends QuantityTypeIdentifier = QuantityTypeIdentifier> =
  T extends 'QuantityTypeIdentifierBloodGlucose'
    ? BloodGlucoseUnit
    : T extends
    | 'QuantityTypeIdentifierAppleExerciseTime'
    | 'QuantityTypeIdentifierAppleMoveTime'
    | 'QuantityTypeIdentifierAppleStandTime'
      ? TimeUnit
      : T extends
      | 'QuantityTypeIdentifierActiveEnergyBurned'
      | 'QuantityTypeIdentifierBasalEnergyBurned'
      | 'QuantityTypeIdentifierDietaryEnergyConsumed'
        ? EnergyUnit
        : T extends
        | 'QuantityTypeIdentifierDistanceCycling'
        | 'QuantityTypeIdentifierDistanceDownhillSnowSports'
        | 'QuantityTypeIdentifierDistanceSwimming'
        | 'QuantityTypeIdentifierDistanceWalkingRunning'
        | 'QuantityTypeIdentifierDistanceWheelchair'
        | 'QuantityTypeIdentifierSixMinuteWalkTestDistance'
        | 'QuantityTypeIdentifierWaistCircumference'
          ? LengthUnit
          : T extends
          | 'QuantityTypeIdentifierBodyFatPercentage'
          | 'QuantityTypeIdentifierOxygenSaturation'
          | 'QuantityTypeIdentifierWalkingAsymmetryPercentage'
          | 'QuantityTypeIdentifierWalkingDoubleSupportPercentage'
            ? '%'
            : T extends
            | 'QuantityTypeIdentifierBasalBodyTemperature'

              ? TemperatureUnit
              : T extends
              | 'QuantityTypeIdentifierRunningSpeed'
              | 'QuantityTypeIdentifierStairAscentSpeed'
              | 'QuantityTypeIdentifierStairDescentSpeed'
              | 'QuantityTypeIdentifierWalkingSpeed'

                ? SpeedUnit<LengthUnit, TimeUnit>
                : T extends
                | 'QuantityTypeIdentifierFlightsClimbed'
                | 'QuantityTypeIdentifierNumberOfAlcoholicBeverages'
                | 'QuantityTypeIdentifierNumberOfTimesFallen'
                | 'QuantityTypeIdentifierPushCount'
                | 'QuantityTypeIdentifierStepCount'
                | 'QuantityTypeIdentifierSwimmingStrokeCount'
                  ? 'count'
                  : T extends
                  | 'QuantityTypeIdentifierDietaryBiotin'
                  | 'QuantityTypeIdentifierDietaryCaffeine'
                  | 'QuantityTypeIdentifierDietaryCalcium'
                  | 'QuantityTypeIdentifierDietaryCarbohydrates'
                  | 'QuantityTypeIdentifierDietaryChloride'
                  | 'QuantityTypeIdentifierDietaryCholesterol'
                  | 'QuantityTypeIdentifierDietaryChromium'
                  | 'QuantityTypeIdentifierDietaryCopper'
                  | 'QuantityTypeIdentifierDietaryFatMonounsaturated'
                  | 'QuantityTypeIdentifierDietaryFatPolyunsaturated'
                  | 'QuantityTypeIdentifierDietaryFatSaturated'
                  | 'QuantityTypeIdentifierDietaryFatTotal'
                  | 'QuantityTypeIdentifierDietaryFiber'
                  | 'QuantityTypeIdentifierDietaryFolate'
                  | 'QuantityTypeIdentifierDietaryIodine'
                  | 'QuantityTypeIdentifierDietaryIron'
                  | 'QuantityTypeIdentifierDietaryMagnesium'
                  | 'QuantityTypeIdentifierDietaryManganese'
                  | 'QuantityTypeIdentifierDietaryMolybdenum'
                  | 'QuantityTypeIdentifierDietaryNiacin'
                  | 'QuantityTypeIdentifierDietaryPantothenicAcid'
                  | 'QuantityTypeIdentifierDietaryPhosphorus'
                  | 'QuantityTypeIdentifierDietaryPotassium'
                  | 'QuantityTypeIdentifierDietaryProtein'
                  | 'QuantityTypeIdentifierDietaryRiboflavin'
                  | 'QuantityTypeIdentifierDietarySelenium'
                  | 'QuantityTypeIdentifierDietarySodium'
                  | 'QuantityTypeIdentifierDietarySugar'
                  | 'QuantityTypeIdentifierDietaryThiamin'
                  | 'QuantityTypeIdentifierDietaryVitaminA'
                  | 'QuantityTypeIdentifierDietaryVitaminB6'
                  | 'QuantityTypeIdentifierDietaryVitaminB12'
                  | 'QuantityTypeIdentifierDietaryVitaminC'
                  | 'QuantityTypeIdentifierDietaryVitaminD'
                  | 'QuantityTypeIdentifierDietaryVitaminE'
                  | 'QuantityTypeIdentifierDietaryVitaminK'
                  | 'QuantityTypeIdentifierDietaryZinc'
                    ? MassUnit
                    : T extends 'QuantityTypeIdentifierDietaryWater'
                      ? VolumeUnit
                      : T extends 'QuantityTypeIdentifierInsulinDelivery'
                        ? 'IU'
                        : T extends
                        | 'QuantityTypeIdentifierHeartRate'
                        | 'QuantityTypeIdentifierRestingHeartRate'
                        | 'QuantityTypeIdentifierWalkingHeartRateAverage'
                          ? CountPerTime<TimeUnit>
                          : Unit;



export interface QuantityType extends HybridObject<{ ios: 'swift' }> {

  saveQuantitySample(
    identifier: QuantityTypeIdentifier,
    unit: string,
    value: number,
    startTimestamp: number,
    endTimestamp: number,
    metadata: AnyMap
  ): Promise<boolean>;

  deleteQuantitySample(
    identifier: QuantityTypeIdentifier,
    uuid: string
  ): Promise<boolean>;
  
  deleteSamples(
    identifier: QuantityTypeIdentifier,  
    startTimestamp: number,
    endTimestamp: number
  ): Promise<boolean>;
  
  queryWorkoutSamples(
    energyUnit: string,
    distanceUnit: string,
    fromTimestamp: number,
    toTimestamp: number,
    limit: number,
    ascending: boolean
  ): Promise<readonly WorkoutSample[]>;
  
  queryQuantitySamples(
    identifier: QuantityTypeIdentifier,
    unit: string,
    fromTimestamp: number,
    toTimestamp: number,
    limit: number,
    ascending: boolean
  ): Promise<readonly QuantitySampleRaw[]>;

  queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier,
    unit: string,
    fromTimestamp: number,
    toTimestamp: number,
    options: readonly StatisticsOptions[],
  ): Promise<QueryStatisticsResponseRaw>;

  queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier,
    unit: string,
    options: readonly StatisticsOptions[],
    anchorDate: string,
    intervalComponents: IntervalComponents,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<readonly QueryStatisticsResponseRaw[]>;


  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    unit: string,
    fromTimestamp: number,
    toTimestamp: number,
    limit: number,
    anchor: string
  ): Promise<QueryQuantitySamplesResponseRaw>;
}