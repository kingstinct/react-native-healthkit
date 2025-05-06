import type { HybridObject } from "react-native-nitro-modules";
import type { HKDevice, HKSourceRevision } from "./Source.nitro";
import type { HKGenericMetadata } from "./Shared";

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier Apple Docs }
 */
export enum HKCategoryTypeIdentifier {
    sleepAnalysis = 'HKCategoryTypeIdentifierSleepAnalysis',
    appleStandHour = 'HKCategoryTypeIdentifierAppleStandHour',
    cervicalMucusQuality = 'HKCategoryTypeIdentifierCervicalMucusQuality',
    ovulationTestResult = 'HKCategoryTypeIdentifierOvulationTestResult',
    /**
     * @deprecated In iOS 18 beta
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifiermenstrualflow Apple Docs }
     */
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
  
    /**
     * Bleeding After Pregnancy
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingafterpregnancy Apple Docs }
     * @since iOS 18
     */
    bleedingAfterPregnancy = 'HKCategoryTypeIdentifierBleedingAfterPregnancy', // HKCategoryValueSeverity
  
    /**
     * Bleeding During Pregnancy
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingduringpregnancy Apple Docs }
     * @since iOS 18
     */
    bleedingDuringPregnancy = 'HKCategoryTypeIdentifierBleedingDuringPregnancy', // HKCategoryValueSeverity
  }


export type HKCategoryTypePresenceIdentifier = HKCategoryTypeIdentifier.appetiteChanges
| HKCategoryTypeIdentifier.sleepChanges

export type HKCategoryTypeValueNotApplicableIdentifier = HKCategoryTypeIdentifier.highHeartRateEvent
| HKCategoryTypeIdentifier.intermenstrualBleeding
| HKCategoryTypeIdentifier.mindfulSession
| HKCategoryTypeIdentifier.sexualActivity

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
enum HKCategoryValuePregnancyTestResult {
  positive = 2,
  negative = 1,
  indeterminate = 3,
}


  export type HKCategoryTypeSeverityIdentifier = HKCategoryTypeIdentifier.abdominalCramps
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
  T extends HKCategoryTypeIdentifier
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

export type DeletedCategorySampleRaw<T extends HKCategoryTypeIdentifier> = {
  readonly uuid: string;
  readonly metadata: MetadataMapperForCategoryIdentifier<T>;
};

export type HKCategoryValueForIdentifier<T extends HKCategoryTypeIdentifier> =
  T extends HKCategoryTypeIdentifier.cervicalMucusQuality
    ? HKCategoryValueCervicalMucusQuality
    : T extends HKCategoryTypeIdentifier.menstrualFlow
      ? HKCategoryValueMenstrualFlow
      : T extends HKCategoryTypeIdentifier.ovulationTestResult
        ? HKCategoryValueOvulationTestResult
        : T extends HKCategoryTypeIdentifier.sleepAnalysis
          ? HKCategoryValueSleepAnalysis
          : T extends HKCategoryTypeValueNotApplicableIdentifier
            ? HKCategoryValueNotApplicable
            : T extends HKCategoryTypeSeverityIdentifier
              ? HKCategoryValueSeverity
              : T extends HKCategoryTypePresenceIdentifier
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


export interface CategoryType extends HybridObject<{ ios: 'swift' }> {

  readonly saveCategorySample: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    value: HKCategoryValueForIdentifier<T>,
    start: string,
    end: string,
    metadata: unknown
  ) => Promise<boolean>;


  readonly queryCategorySamplesWithAnchor: <T extends HKCategoryTypeIdentifier>(
    identifier: T,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryCategorySamplesResponseRaw<T>>;

}

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
