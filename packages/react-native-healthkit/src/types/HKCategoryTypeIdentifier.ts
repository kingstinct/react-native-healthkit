
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier Apple Docs }
 */
export type HKCategoryTypeIdentifier =
    'HKCategoryTypeIdentifierSleepAnalysis' |
    'HKCategoryTypeIdentifierAppleStandHour' |
    'HKCategoryTypeIdentifierCervicalMucusQuality' |
    'HKCategoryTypeIdentifierOvulationTestResult' |
    /**
     * @deprecated In iOS 18 beta
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifiermenstrualflow Apple Docs }
     */
    'HKCategoryTypeIdentifierMenstrualFlow' |
    'HKCategoryTypeIdentifierIntermenstrualBleeding' |
    'HKCategoryTypeIdentifierSexualActivity' |
    'HKCategoryTypeIdentifierMindfulSession' |
    'HKCategoryTypeIdentifierHighHeartRateEvent' |
    'HKCategoryTypeIdentifierLowHeartRateEvent' |
    'HKCategoryTypeIdentifierIrregularHeartRhythmEvent' |
    /**
     * @deprecated Use environmentalAudioExposureEvent instead.
     */
    'HKCategoryTypeIdentifierAudioExposureEvent' |
    'HKCategoryTypeIdentifierToothbrushingEvent' |
    'HKCategoryTypeIdentifierLowCardioFitnessEvent' |
    'HKCategoryTypeIdentifierContraceptive' |
    'HKCategoryTypeIdentifierLactation' |
    'HKCategoryTypeIdentifierPregnancy' |
    'HKCategoryTypeIdentifierPregnancyTestResult' |
    'HKCategoryTypeIdentifierProgesteroneTestResult' |
    'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent' |
    'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent' |
    'HKCategoryTypeIdentifierAppleWalkingSteadinessEvent' |
    'HKCategoryTypeIdentifierHandwashingEvent' |
  
    // Symptoms
    'HKCategoryTypeIdentifierAbdominalCramps' |
    'HKCategoryTypeIdentifierAcne' |
    'HKCategoryTypeIdentifierAppetiteChanges' |
    'HKCategoryTypeIdentifierBladderIncontinence' |
    'HKCategoryTypeIdentifierBloating' |
    'HKCategoryTypeIdentifierBreastPain' |
    'HKCategoryTypeIdentifierChestTightnessOrPain' |
    'HKCategoryTypeIdentifierChills' |
    'HKCategoryTypeIdentifierConstipation' |
    'HKCategoryTypeIdentifierCoughing' |
    'HKCategoryTypeIdentifierDiarrhea' |
    'HKCategoryTypeIdentifierDizziness' |
    'HKCategoryTypeIdentifierDrySkin' |
    'HKCategoryTypeIdentifierFainting' |
    'HKCategoryTypeIdentifierFatigue' |
    'HKCategoryTypeIdentifierFever' |
    'HKCategoryTypeIdentifierGeneralizedBodyAche' |
    'HKCategoryTypeIdentifierHairLoss' |
    'HKCategoryTypeIdentifierHeadache' |
    'HKCategoryTypeIdentifierHeartburn' |
    'HKCategoryTypeIdentifierHotFlashes' |
    'HKCategoryTypeIdentifierLossOfSmell' |
    'HKCategoryTypeIdentifierLossOfTaste' |
    'HKCategoryTypeIdentifierLowerBackPain' |
    'HKCategoryTypeIdentifierMemoryLapse' |
    'HKCategoryTypeIdentifierMoodChanges' |
    'HKCategoryTypeIdentifierNausea' |
    'HKCategoryTypeIdentifierNightSweats' |
    'HKCategoryTypeIdentifierPelvicPain' |
    'HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat' |
    'HKCategoryTypeIdentifierRunnyNose' |
    'HKCategoryTypeIdentifierShortnessOfBreath' |
    'HKCategoryTypeIdentifierSinusCongestion' |
    'HKCategoryTypeIdentifierSkippedHeartbeat' |
    'HKCategoryTypeIdentifierSleepChanges' |
    'HKCategoryTypeIdentifierSoreThroat' |
    'HKCategoryTypeIdentifierVaginalDryness' |
    'HKCategoryTypeIdentifierVomiting' |
    'HKCategoryTypeIdentifierWheezing' |
  
    /**
     * Bleeding After Pregnancy
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingafterpregnancy Apple Docs }
     * @since iOS 18
     */
    'HKCategoryTypeIdentifierBleedingAfterPregnancy' |
  
    /**
     * Bleeding During Pregnancy
     * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifierbleedingduringpregnancy Apple Docs }
     * @since iOS 18
     */
    'HKCategoryTypeIdentifierBleedingDuringPregnancy'