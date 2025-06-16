export type CategoryTypeIdentifierReadOnly =
  | 'HKCategoryTypeIdentifierAppleStandHour'
  | 'HKCategoryTypeIdentifierHighHeartRateEvent'
  | 'HKCategoryTypeIdentifierLowHeartRateEvent'
  | 'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier Apple Docs }
 */
export type CategoryTypeIdentifierWriteable =
  | 'HKCategoryTypeIdentifierSleepAnalysis'
  | 'HKCategoryTypeIdentifierCervicalMucusQuality'
  | 'HKCategoryTypeIdentifierOvulationTestResult'
  /**
   * @deprecated In iOS 18 beta
   * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifiermenstrualflow Apple Docs }
   */
  | 'HKCategoryTypeIdentifierMenstrualFlow'
  | 'HKCategoryTypeIdentifierIntermenstrualBleeding'
  | 'HKCategoryTypeIdentifierSexualActivity'
  | 'HKCategoryTypeIdentifierMindfulSession'
  | 'HKCategoryTypeIdentifierIrregularHeartRhythmEvent'
  /**
   * @deprecated Use environmentalAudioExposureEvent instead.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier/audioexposureevent Apple Docs }
   */
  | 'HKCategoryTypeIdentifierAudioExposureEvent'
  | 'HKCategoryTypeIdentifierToothbrushingEvent'
  | 'HKCategoryTypeIdentifierLowCardioFitnessEvent'
  | 'HKCategoryTypeIdentifierContraceptive'
  | 'HKCategoryTypeIdentifierLactation'
  | 'HKCategoryTypeIdentifierPregnancy'
  | 'HKCategoryTypeIdentifierPregnancyTestResult'
  | 'HKCategoryTypeIdentifierProgesteroneTestResult'
  | 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent'
  | 'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent'
  | 'HKCategoryTypeIdentifierHandwashingEvent'

  // Symptoms
  | 'HKCategoryTypeIdentifierAbdominalCramps'
  | 'HKCategoryTypeIdentifierAcne'
  | 'HKCategoryTypeIdentifierAppetiteChanges'
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
  | 'HKCategoryTypeIdentifierSleepChanges'
  | 'HKCategoryTypeIdentifierSoreThroat'
  | 'HKCategoryTypeIdentifierVaginalDryness'
  | 'HKCategoryTypeIdentifierVomiting'
  | 'HKCategoryTypeIdentifierWheezing'

  /**
   * Bleeding After Pregnancy
   * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingafterpregnancy Apple Docs }
   * @since iOS 18
   */
  | 'HKCategoryTypeIdentifierBleedingAfterPregnancy'

  /**
   * Bleeding During Pregnancy
   * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingduringpregnancy Apple Docs }
   * @since iOS 18
   */
  | 'HKCategoryTypeIdentifierBleedingDuringPregnancy'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier Apple Docs }
 */
export type CategoryTypeIdentifier =
  | CategoryTypeIdentifierReadOnly
  | CategoryTypeIdentifierWriteable
