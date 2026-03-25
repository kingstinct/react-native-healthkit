import type {
  BloodGlucoseUnit,
  CategoryTypeIdentifier,
  CategoryValueForIdentifier,
  CategoryValueSleepAnalysis,
  HeartRateMotionContext,
  QuantitySampleTyped,
  WorkoutSample,
} from '../types'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

type Assert<T extends true> = T

type _sleepAnalysisValuesAreTyped = Assert<
  Equal<
    CategoryValueForIdentifier<'HKCategoryTypeIdentifierSleepAnalysis'>,
    CategoryValueSleepAnalysis
  >
>

type _newCategoryIdentifierFromSdkIsPresent = Assert<
  'HKCategoryTypeIdentifierHypertensionEvent' extends CategoryTypeIdentifier
    ? true
    : false
>

type _workoutMetadataIncludesBrandName = Assert<
  Equal<
    NonNullable<WorkoutSample['typedMetadata']>['HKWorkoutBrandName'],
    string | undefined
  >
>

type _workoutMetadataIncludesFitnessPlusFlag = Assert<
  Equal<
    NonNullable<WorkoutSample['typedMetadata']>['HKAppleFitnessPlusSession'],
    boolean | undefined
  >
>

type _heartRateMetadataNarrowsToEnum = Assert<
  Equal<
    NonNullable<
      QuantitySampleTyped<'HKQuantityTypeIdentifierHeartRate'>['typedMetadata']
    >['HKHeartRateMotionContext'],
    HeartRateMotionContext | undefined
  >
>

type _bloodGlucoseUnitNarrows = Assert<
  Equal<
    QuantitySampleTyped<'HKQuantityTypeIdentifierBloodGlucose'>['unit'],
    BloodGlucoseUnit
  >
>
