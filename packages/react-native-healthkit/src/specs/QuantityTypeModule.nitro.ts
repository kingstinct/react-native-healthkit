import type { AnyMap, HybridObject } from "react-native-nitro-modules";
import type { DeletedSample, GenericMetadata } from "../types/Shared";
import type { BloodGlucoseUnit, CountPerTime, EnergyUnit, Unit, LengthUnit, MassUnit, SpeedUnit, TemperatureUnit, TimeUnit, VolumeUnit } from "../types/Units";
import type { QuantityTypeIdentifier } from "../types/QuantityTypeIdentifier";
import type { QuantitySample } from "../types/QuantitySample";
import type { QueryOptionsWithAnchorAndUnit, QueryOptionsWithSortOrderAndUnit } from "../types/QueryOptions";

interface QuantityDateInterval {
  readonly from: Date;
  readonly to: Date;
};

export interface QueryStatisticsResponse {
  readonly averageQuantity?: Quantity;
  readonly maximumQuantity?: Quantity;
  readonly minimumQuantity?: Quantity;
  readonly sumQuantity?: Quantity;
  readonly mostRecentQuantity?: Quantity;
  readonly mostRecentQuantityDateInterval?: QuantityDateInterval;
  readonly duration?: Quantity;
};


export interface QuantitySamplesWithAnchorResponse {
  readonly samples: readonly QuantitySample[];
  readonly deletedSamples: readonly DeletedSample[];
  readonly newAnchor: string;
};

export interface Quantity {
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

                          
interface StatisticsQueryOptions {
  from?: Date,
  to?: Date,
  unit?: string,
}

export interface QuantityTypeModule extends HybridObject<{ ios: 'swift' }> {

  saveQuantitySample(
    identifier: QuantityTypeIdentifier,
    unit: string,
    value: number,
    start: Date,
    end: Date,
    metadata: AnyMap
  ): Promise<boolean>;

  deleteQuantitySample(
    identifier: QuantityTypeIdentifier,
    uuid: string
  ): Promise<boolean>;
  
  deleteQuantitySamplesBetween(
    identifier: QuantityTypeIdentifier,  
    from: Date,
    to: Date
  ): Promise<boolean>;
  
  queryQuantitySamples(
    identifier: QuantityTypeIdentifier,
    options?: QueryOptionsWithSortOrderAndUnit
  ): Promise<readonly QuantitySample[]>;

  queryStatisticsForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    options?: StatisticsQueryOptions
  ): Promise<QueryStatisticsResponse>;

  queryStatisticsCollectionForQuantity(
    identifier: QuantityTypeIdentifier,
    statistics: readonly StatisticsOptions[],
    anchorDate: string,
    intervalComponents: IntervalComponents,
    options?: StatisticsQueryOptions
  ): Promise<readonly QueryStatisticsResponse[]>;

  queryQuantitySamplesWithAnchor(
    identifier: QuantityTypeIdentifier,
    options: QueryOptionsWithAnchorAndUnit
  ): Promise<QuantitySamplesWithAnchorResponse>;
}