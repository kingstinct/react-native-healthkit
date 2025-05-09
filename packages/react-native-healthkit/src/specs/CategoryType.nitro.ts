import type { HybridObject } from "react-native-nitro-modules";
import type { HKDevice, HKSourceRevision } from "./Source.nitro";
import type { HKGenericMetadata } from "./Shared";
import type { HKCategoryTypeIdentifier } from "../types/HKCategoryTypeIdentifier";


export type HKCategoryTypePresenceIdentifier = 'HKCategoryTypeIdentifierAppetiteChanges'
| 'HKCategoryTypeIdentifierSleepChanges'

export type HKCategoryTypeValueNotApplicableIdentifier = 'HKCategoryTypeIdentifierHighHeartRateEvent'
| 'HKCategoryTypeIdentifierIntermenstrualBleeding'
| 'HKCategoryTypeIdentifierMindfulSession'
| 'HKCategoryTypeIdentifierSexualActivity'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
enum HKCategoryValuePregnancyTestResult {
  positive = 2,
  negative = 1,
  indeterminate = 3,
}


  export type HKCategoryTypeSeverityIdentifier = 'HKCategoryTypeIdentifierAbdominalCramps'
  | 'HKCategoryTypeIdentifierAcne'
  | 'HKCategoryTypeIdentifierBladderIncontinence'
  | 'HKCategoryTypeIdentifierBloating'
  | 'HKCategoryTypeIdentifierBreastPain'
  | 'HKCategoryTypeIdentifierChestTightnessOrPain'
  | 'HKCategoryTypeIdentifierChills'
  | 'HKCategoryTypeIdentifierConstipation'
  | 'HKCategoryTypeIdentifierCoughing'
  | 'HKCategoryTypeIdentifierDiarrhea'
  | 'HKCategoryTypeIdentifierDizziness'
  | 'HKCategoryTypeIdentifierDrySkin'
  | 'HKCategoryTypeIdentifierFainting'
  | 'HKCategoryTypeIdentifierFatigue'
  | 'HKCategoryTypeIdentifierFever'
  | 'HKCategoryTypeIdentifierGeneralizedBodyAche'
  | 'HKCategoryTypeIdentifierHairLoss'
  | 'HKCategoryTypeIdentifierHeadache'
  | 'HKCategoryTypeIdentifierHeartburn'
  | 'HKCategoryTypeIdentifierHotFlashes'
  | 'HKCategoryTypeIdentifierLossOfSmell'
  | 'HKCategoryTypeIdentifierLossOfTaste'
  | 'HKCategoryTypeIdentifierLowerBackPain'
  | 'HKCategoryTypeIdentifierMemoryLapse'
  | 'HKCategoryTypeIdentifierMoodChanges'
  | 'HKCategoryTypeIdentifierNausea'
  | 'HKCategoryTypeIdentifierNightSweats'
  | 'HKCategoryTypeIdentifierPelvicPain'
  | 'HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat'
  | 'HKCategoryTypeIdentifierRunnyNose'
  | 'HKCategoryTypeIdentifierShortnessOfBreath'
  | 'HKCategoryTypeIdentifierSinusCongestion'
  | 'HKCategoryTypeIdentifierSkippedHeartbeat'
  | 'HKCategoryTypeIdentifierSoreThroat'
  | 'HKCategoryTypeIdentifierVaginalDryness'
  | 'HKCategoryTypeIdentifierVomiting'
  | 'HKCategoryTypeIdentifierWheezing'

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
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueappetitechanges Apple Docs}
 */
export enum HKCategoryValueAppetiteChanges {
  decreased = 2,
  increased = 3,
  noChange = 1,
  unspecified = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepresence Apple Docs}
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


export enum HKCategoryValueLowCardioFitnessEvent {
  lowFitness = 1,
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


export enum HKCategoryValueAppleStandHour {
  stood = 0,
  idle = 1,
}


export type HKCategorySampleRawForSaving<
  TCategory extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = Omit<
HKCategorySampleRaw<TCategory>,
'device' | 'endDate' | 'startDate' | 'uuid'
> & {
  readonly startDate?: string;
  readonly endDate?: string;
};

export type QueryCategorySamplesResponseRaw<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = {
  readonly samples: readonly HKCategorySampleRaw<T>[];
  readonly deletedSamples: readonly DeletedCategorySampleRaw<T>[];
  readonly newAnchor: string;
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

export type DeletedCategorySampleRaw<T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier> = {
  readonly uuid: string;
  readonly metadata: MetadataMapperForCategoryIdentifier<T>;
};

export type HKCategoryValueForIdentifier<T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier> =
  T extends 'HKCategoryTypeIdentifierCervicalMucusQuality'
    ? HKCategoryValueCervicalMucusQuality
    : T extends 'HKCategoryTypeIdentifierMenstrualFlow'
      ? HKCategoryValueMenstrualFlow
      : T extends 'HKCategoryTypeIdentifierOvulationTestResult'
        ? HKCategoryValueOvulationTestResult
        : T extends 'HKCategoryTypeIdentifierSleepAnalysis'
          ? HKCategoryValueSleepAnalysis
          : T extends HKCategoryTypeValueNotApplicableIdentifier
            ? HKCategoryValueNotApplicable
            : T extends HKCategoryTypeSeverityIdentifier
              ? HKCategoryValueSeverity
              : T extends HKCategoryTypePresenceIdentifier
                ? HKCategoryValuePresence
                : T extends 'HKCategoryTypeIdentifierLowCardioFitnessEvent'
                  ? HKCategoryValueLowCardioFitnessEvent
                  : T extends 'HKCategoryTypeIdentifierPregnancyTestResult'
                    ? HKCategoryValuePregnancyTestResult
                    : T extends 'HKCategoryTypeIdentifierPregnancyTestResult'
                      ? HKCategoryValuePregnancyTestResult
                      : T extends 'HKCategoryTypeIdentifierAppleStandHour'
                        ? HKCategoryValueAppleStandHour
                        : number;


export interface CategoryType extends HybridObject<{ ios: 'swift' }> {

  readonly saveCategorySample: (
    identifier: HKCategoryTypeIdentifier,
    value: HKCategoryValueForIdentifier,
    start: string,
    end: string,
    metadata: HKGenericMetadata
  ) => Promise<boolean>;


  readonly queryCategorySamplesWithAnchor: (
    identifier: HKCategoryTypeIdentifier,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryCategorySamplesResponseRaw>;

}

export type MetadataMapperForCategoryIdentifier<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> = T extends 'HKCategoryTypeIdentifierSexualActivity'
  ? HKGenericMetadata & {
    readonly HKSexualActivityProtectionUsed: boolean;
  }
  : T extends 'HKCategoryTypeIdentifierMenstrualFlow'
    ? HKGenericMetadata & {
      readonly HKMenstrualCycleStart: boolean;
    }
    : HKGenericMetadata;
