/**
 * Represents a quantity type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier Apple Docs HKQuantityTypeIdentifier}
 */
export type QuantityTypeIdentifierReadOnly =
  /**
   * Walking Heart Rate Average
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingheartrateaverage Apple Docs HKQuantityTypeIdentifierWalkingHeartRateAverage}
   * @since iOS 11.0
   */
  'HKQuantityTypeIdentifierWalkingHeartRateAverage'

/**
 * Represents a quantity type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier Apple Docs HKQuantityTypeIdentifier}
 */
export type QuantityTypeIdentifierWriteable =
  /**
   * Body Mass Index
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodymassindex Apple Docs HKQuantityTypeIdentifierBodyMassIndex}
   */
  | 'HKQuantityTypeIdentifierBodyMassIndex'

  /**
   * Body Fat Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodyfatpercentage Apple Docs HKQuantityTypeIdentifierBodyFatPercentage}
   */
  | 'HKQuantityTypeIdentifierBodyFatPercentage'

  /**
   * Height
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheight Apple Docs HKQuantityTypeIdentifierHeight}
   */
  | 'HKQuantityTypeIdentifierHeight'

  /**
   * Body Mass
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodymass Apple Docs HKQuantityTypeIdentifierBodyMass}
   */
  | 'HKQuantityTypeIdentifierBodyMass'

  /**
   * Lean Body Mass
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierleanbodymass Apple Docs HKQuantityTypeIdentifierLeanBodyMass}
   */
  | 'HKQuantityTypeIdentifierLeanBodyMass'

  /**
   * Waist Circumference
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwaistcircumference Apple Docs HKQuantityTypeIdentifierWaistCircumference}
   */
  | 'HKQuantityTypeIdentifierWaistCircumference'

  /**
   * Step Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstepcount Apple Docs HKQuantityTypeIdentifierStepCount}
   */
  | 'HKQuantityTypeIdentifierStepCount'

  /**
   * Distance Walking Running
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancewalkingrunning Apple Docs HKQuantityTypeIdentifierDistanceWalkingRunning}
   */
  | 'HKQuantityTypeIdentifierDistanceWalkingRunning'

  /**
   * Distance Cycling
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancecycling Apple Docs HKQuantityTypeIdentifierDistanceCycling}
   */
  | 'HKQuantityTypeIdentifierDistanceCycling'

  /**
   * Distance Wheelchair
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancewheelchair Apple Docs HKQuantityTypeIdentifierDistanceWheelchair}
   */
  | 'HKQuantityTypeIdentifierDistanceWheelchair'
  /**
   * Basal Energy Burned
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbasalenergyburned Apple Docs HKQuantityTypeIdentifierBasalEnergyBurned}
   */
  | 'HKQuantityTypeIdentifierBasalEnergyBurned'
  /**
   * Active Energy Burned
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieractiveenergyburned Apple Docs HKQuantityTypeIdentifierActiveEnergyBurned}
   */
  | 'HKQuantityTypeIdentifierActiveEnergyBurned'
  /**
   * Flights Climbed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierflightsclimbed Apple Docs HKQuantityTypeIdentifierFlightsClimbed}
   */
  | 'HKQuantityTypeIdentifierFlightsClimbed'
  /**
   * Nike Fuel
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernikefuel Apple Docs HKQuantityTypeIdentifierNikeFuel}
   */
  | 'HKQuantityTypeIdentifierNikeFuel'
  /**
   * Apple Exercise Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierappleexercisetime Apple Docs HKQuantityTypeIdentifierAppleExerciseTime}
   */
  | 'HKQuantityTypeIdentifierAppleExerciseTime'
  /**
   * Push Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierpushcount Apple Docs HKQuantityTypeIdentifierPushCount}
   */
  | 'HKQuantityTypeIdentifierPushCount'
  /**
   * Distance Swimming
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistanceswimming Apple Docs HKQuantityTypeIdentifierDistanceSwimming}
   */
  | 'HKQuantityTypeIdentifierDistanceSwimming'
  /**
   * Swimming Stroke Count
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierswimmingstrokecount Apple Docs HKQuantityTypeIdentifierSwimmingStrokeCount}
   */
  | 'HKQuantityTypeIdentifierSwimmingStrokeCount'
  /**
   * VO2 Max
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiervo2max Apple Docs HKQuantityTypeIdentifierVO2Max}
   */
  | 'HKQuantityTypeIdentifierVO2Max'
  /**
   * Distance Downhill Snow Sports
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdistancedownhillsnowsports Apple Docs HKQuantityTypeIdentifierDistanceDownhillSnowSports}
   */
  | 'HKQuantityTypeIdentifierDistanceDownhillSnowSports'

  /**
   * Apple Stand Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplestandtime Apple Docs HKQuantityTypeIdentifierAppleStandTime}
   */
  | 'HKQuantityTypeIdentifierAppleStandTime'
  // Vitals
  /**
   * Heart Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartrate Apple Docs HKQuantityTypeIdentifierHeartRate}
   */
  | 'HKQuantityTypeIdentifierHeartRate'
  /**
   * Body Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbodytemperature Apple Docs HKQuantityTypeIdentifierBodyTemperature}
   */
  | 'HKQuantityTypeIdentifierBodyTemperature'
  /**
   * Basal Body Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbasalbodytemperature Apple Docs HKQuantityTypeIdentifierBasalBodyTemperature}
   */
  | 'HKQuantityTypeIdentifierBasalBodyTemperature'
  /**
   * Blood Pressure Systolic
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodpressuresystolic Apple Docs HKQuantityTypeIdentifierBloodPressureSystolic}
   */
  | 'HKQuantityTypeIdentifierBloodPressureSystolic'
  /**
   * Blood Pressure Diastolic
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodpressurediastolic Apple Docs HKQuantityTypeIdentifierBloodPressureDiastolic}
   */
  | 'HKQuantityTypeIdentifierBloodPressureDiastolic'
  /**
   * Respiratory Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrespiratoryrate Apple Docs HKQuantityTypeIdentifierRespiratoryRate}
   */
  | 'HKQuantityTypeIdentifierRespiratoryRate'
  /**
   * Resting Heart Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrestingheartrate Apple Docs HKQuantityTypeIdentifierRestingHeartRate}
   */
  | 'HKQuantityTypeIdentifierRestingHeartRate'
  /**
   * Heart Rate Variability SDNN
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartratevariabilitysdnn Apple Docs HKQuantityTypeIdentifierHeartRateVariabilitySDNN}
   * @since iOS 11.0
   */
  | 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'
  /**
   * Oxygen Saturation
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieroxygensaturation Apple Docs HKQuantityTypeIdentifierOxygenSaturation}
   * @since iOS 8.0
   */
  | 'HKQuantityTypeIdentifierOxygenSaturation'
  /**
   * Peripheral Perfusion Index
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierperipheralperfusionindex Apple Docs HKQuantityTypeIdentifierPeripheralPerfusionIndex}
   * @since iOS 8.0
   */
  | 'HKQuantityTypeIdentifierPeripheralPerfusionIndex'
  /**
   * Blood Glucose
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodglucose Apple Docs HKQuantityTypeIdentifierBloodGlucose}
   */
  | 'HKQuantityTypeIdentifierBloodGlucose'

  /**
   * Number Of Times Fallen
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernumberoftimesfallen Apple Docs HKQuantityTypeIdentifierNumberOfTimesFallen}
   */
  | 'HKQuantityTypeIdentifierNumberOfTimesFallen'

  /**
   * Electrodermal Activity
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierelectrodermalactivity Apple Docs HKQuantityTypeIdentifierElectrodermalActivity}
   */
  | 'HKQuantityTypeIdentifierElectrodermalActivity'

  /**
   * Inhaler Usage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierinhalerusage Apple Docs HKQuantityTypeIdentifierInhalerUsage}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierInhalerUsage'

  /**
   * Insulin Delivery
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierinsulindelivery Apple Docs HKQuantityTypeIdentifierInsulinDelivery}
   * @since iOS 11
   */
  | 'HKQuantityTypeIdentifierInsulinDelivery'

  /**
   * Blood Alcohol Content
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierbloodalcoholcontent Apple Docs HKQuantityTypeIdentifierBloodAlcoholContent}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierBloodAlcoholContent'

  /**
   * Forced Vital Capacity
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierforcedvitalcapacity Apple Docs HKQuantityTypeIdentifierForcedVitalCapacity}
   */
  | 'HKQuantityTypeIdentifierForcedVitalCapacity'

  /**
   * Forced Expiratory Volume1
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierforcedexpiratoryvolume1 Apple Docs HKQuantityTypeIdentifierForcedExpiratoryVolume1}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierForcedExpiratoryVolume1'

  /**
   * Peak Expiratory Flow Rate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierpeakexpiratoryflowrate Apple Docs HKQuantityTypeIdentifierPeakExpiratoryFlowRate}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierPeakExpiratoryFlowRate'

  /**
   * Environmental Audio Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierenvironmentalaudioexposure Apple Docs HKQuantityTypeIdentifierEnvironmentalAudioExposure}
   * @since iOS 13
   */
  | 'HKQuantityTypeIdentifierEnvironmentalAudioExposure'

  /**
   * Headphone Audio Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheadphoneaudioexposure Apple Docs HKQuantityTypeIdentifierHeadphoneAudioExposure}
   * @since iOS 13
   */
  | 'HKQuantityTypeIdentifierHeadphoneAudioExposure'

  // Nutrition
  /**
   * Dietary Fat Total
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfattotal Apple Docs HKQuantityTypeIdentifierDietaryFatTotal}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierDietaryFatTotal'

  /**
   * Dietary Fat Polyunsaturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatpolyunsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatPolyunsaturated}
   */
  | 'HKQuantityTypeIdentifierDietaryFatPolyunsaturated'

  /**
   * Dietary Fat Monounsaturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatmonounsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatMonounsaturated}
   */
  | 'HKQuantityTypeIdentifierDietaryFatMonounsaturated'
  /**
   * Dietary Fat Saturated
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfatsaturated Apple Docs HKQuantityTypeIdentifierDietaryFatSaturated}
   */
  | 'HKQuantityTypeIdentifierDietaryFatSaturated'

  /**
   * Dietary Cholesterol
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycholesterol Apple Docs HKQuantityTypeIdentifierDietaryCholesterol}
   */
  | 'HKQuantityTypeIdentifierDietaryCholesterol'

  /**
   * Dietary Sodium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarysodium Apple Docs HKQuantityTypeIdentifierDietarySodium}
   */
  | 'HKQuantityTypeIdentifierDietarySodium'

  /**
   * Dietary Carbohydrates
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycarbohydrates Apple Docs HKQuantityTypeIdentifierDietaryCarbohydrates}
   */
  | 'HKQuantityTypeIdentifierDietaryCarbohydrates'

  /**
   * Dietary Fiber
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfiber Apple Docs HKQuantityTypeIdentifierDietaryFiber}
   */
  | 'HKQuantityTypeIdentifierDietaryFiber'
  /**
   * Dietary Sugar
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarysugar Apple Docs HKQuantityTypeIdentifierDietarySugar}
   */
  | 'HKQuantityTypeIdentifierDietarySugar'

  /**
   * Dietary Energy Consumed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryenergyconsumed Apple Docs HKQuantityTypeIdentifierDietaryEnergyConsumed}
   */
  | 'HKQuantityTypeIdentifierDietaryEnergyConsumed'

  /**
   * Dietary Protein
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryprotein Apple Docs HKQuantityTypeIdentifierDietaryProtein}
   */
  | 'HKQuantityTypeIdentifierDietaryProtein'

  /**
   * Dietary Vitamin A
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamina Apple Docs HKQuantityTypeIdentifierDietaryVitaminA}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminA'

  /**
   * Dietary Vitamin B6
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminb6 Apple Docs HKQuantityTypeIdentifierDietaryVitaminB6}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminB6'

  /**
   * Dietary Vitamin B12
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminb12 Apple Docs HKQuantityTypeIdentifierDietaryVitaminB12}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminB12'

  /**
   * Dietary Vitamin C
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitaminc Apple Docs HKQuantityTypeIdentifierDietaryVitaminC}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminC'

  /**
   * Dietary Vitamin D
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamind Apple Docs HKQuantityTypeIdentifierDietaryVitaminD}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminD'

  /**
   * Dietary Vitamin E
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamine Apple Docs HKQuantityTypeIdentifierDietaryVitaminE}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminE'

  /**
   * Dietary Vitamin K
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryvitamink Apple Docs HKQuantityTypeIdentifierDietaryVitaminK}
   */
  | 'HKQuantityTypeIdentifierDietaryVitaminK'
  /**
   * Dietary Calcium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycalcium Apple Docs HKQuantityTypeIdentifierDietaryCalcium}
   */
  | 'HKQuantityTypeIdentifierDietaryCalcium'

  /**
   * Dietary Iron
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryiron Apple Docs HKQuantityTypeIdentifierDietaryIron}
   */
  | 'HKQuantityTypeIdentifierDietaryIron'

  /**
   * Dietary Thiamin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarythiamin Apple Docs HKQuantityTypeIdentifierDietaryThiamin}
   */
  | 'HKQuantityTypeIdentifierDietaryThiamin'

  /**
   * Dietary Riboflavin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryriboflavin Apple Docs HKQuantityTypeIdentifierDietaryRiboflavin}
   */
  | 'HKQuantityTypeIdentifierDietaryRiboflavin'

  /**
   * Dietary Niacin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryniacin Apple Docs HKQuantityTypeIdentifierDietaryNiacin}
   */
  | 'HKQuantityTypeIdentifierDietaryNiacin'

  /**
   * Dietary Folate
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryfolate Apple Docs HKQuantityTypeIdentifierDietaryFolate}
   */
  | 'HKQuantityTypeIdentifierDietaryFolate'

  /**
   * Dietary Biotin
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarybiotin Apple Docs HKQuantityTypeIdentifierDietaryBiotin}
   */
  | 'HKQuantityTypeIdentifierDietaryBiotin'

  /**
   * Dietary Pantothenic Acid
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarypantothenicacid Apple Docs HKQuantityTypeIdentifierDietaryPantothenicAcid}
   */
  | 'HKQuantityTypeIdentifierDietaryPantothenicAcid'

  /**
   * Dietary Phosphorus
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryphosphorus Apple Docs HKQuantityTypeIdentifierDietaryPhosphorus}
   */
  | 'HKQuantityTypeIdentifierDietaryPhosphorus'

  /**
   * Dietary Iodine
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryiodine Apple Docs HKQuantityTypeIdentifierDietaryIodine}
   */
  | 'HKQuantityTypeIdentifierDietaryIodine'
  /**
   * Dietary Magnesium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymagnesium Apple Docs HKQuantityTypeIdentifierDietaryMagnesium}
   */
  | 'HKQuantityTypeIdentifierDietaryMagnesium'

  /**
   * Dietary Zinc
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryzinc Apple Docs HKQuantityTypeIdentifierDietaryZinc}
   */
  | 'HKQuantityTypeIdentifierDietaryZinc'

  /**
   * Dietary Selenium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietaryselenium Apple Docs HKQuantityTypeIdentifierDietarySelenium}
   */
  | 'HKQuantityTypeIdentifierDietarySelenium'

  /**
   * Dietary Copper
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycopper Apple Docs HKQuantityTypeIdentifierDietaryCopper}
   */
  | 'HKQuantityTypeIdentifierDietaryCopper'

  /**
   * Dietary Manganese
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymanganese Apple Docs HKQuantityTypeIdentifierDietaryManganese}
   */
  | 'HKQuantityTypeIdentifierDietaryManganese'

  /**
   * Dietary Chromium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarychromium Apple Docs HKQuantityTypeIdentifierDietaryChromium}
   */
  | 'HKQuantityTypeIdentifierDietaryChromium'

  /**
   * Dietary Molybdenum
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarymolybdenum Apple Docs HKQuantityTypeIdentifierDietaryMolybdenum}
   */
  | 'HKQuantityTypeIdentifierDietaryMolybdenum'

  /**
   * Dietary Chloride
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarychloride Apple Docs HKQuantityTypeIdentifierDietaryChloride}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierDietaryChloride'

  /**
   * Dietary Potassium
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarypotassium Apple Docs HKQuantityTypeIdentifierDietaryPotassium}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierDietaryPotassium'

  /**
   * Dietary Caffeine
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarycaffeine Apple Docs HKQuantityTypeIdentifierDietaryCaffeine}
   * @since iOS 8
   */
  | 'HKQuantityTypeIdentifierDietaryCaffeine'

  /**
   * Dietary Water
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierdietarywater Apple Docs HKQuantityTypeIdentifierDietaryWater}
   * @since iOS 9
   */
  | 'HKQuantityTypeIdentifierDietaryWater'

  // Mobility
  /**
   * Six Minute Walk Test Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiersixminutewalktestdistance Apple Docs HKQuantityTypeIdentifierSixMinuteWalkTestDistance}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance'

  /**
   * Walking Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingspeed Apple Docs HKQuantityTypeIdentifierWalkingSpeed}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierWalkingSpeed'

  /**
   * Walking Step Length
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingsteplength Apple Docs HKQuantityTypeIdentifierWalkingStepLength}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierWalkingStepLength'

  /**
   * Walking Asymmetry Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingasymmetrypercentage Apple Docs HKQuantityTypeIdentifierWalkingAsymmetryPercentage}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage'

  /**
   * Walking Double Support Percentage
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwalkingdoublesupportpercentage Apple Docs HKQuantityTypeIdentifierWalkingDoubleSupportPercentage}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage'

  /**
   * Stair Ascent Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstairascentspeed Apple Docs HKQuantityTypeIdentifierStairAscentSpeed}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierStairAscentSpeed'

  /**
   * Stair Descent Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierstairdescentspeed Apple Docs HKQuantityTypeIdentifierStairDescentSpeed}
   * @since iOS 14
   */
  | 'HKQuantityTypeIdentifierStairDescentSpeed'

  /**
   * UV Exposure
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieruvexposure Apple Docs HKQuantityTypeIdentifierUVExposure}
   * @since iOS 9
   */
  | 'HKQuantityTypeIdentifierUVExposure' // Scalar (Count), Discrete

  /**
   * Apple Move Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplemovetime Apple Docs HKQuantityTypeIdentifierAppleMoveTime}
   * @since iOS 14.5
   */
  | 'HKQuantityTypeIdentifierAppleMoveTime' // Time, Cumulative

  /**
   * Apple Walking Steadiness
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplewalkingsteadiness Apple Docs HKQuantityTypeIdentifierAppleWalkingSteadiness}
   * @since iOS 15
   */
  | 'HKQuantityTypeIdentifierAppleWalkingSteadiness' // Scalar(Percent, 0.0 - 1.0), Discrete

  /**
   * Number Of Alcoholic Beverages
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiernumberofalcoholicbeverages Apple Docs HKQuantityTypeIdentifierNumberOfAlcoholicBeverages}
   * @since iOS 15
   */
  | 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages' // Scalar(Count), Cumulative

  /**
   * Atrial Fibrillation Burden
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifieratrialfibrillationburden Apple Docs HKQuantityTypeIdentifierAtrialFibrillationBurden}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierAtrialFibrillationBurden' // Scalar(Percent, 0.0 - 1.0), Discrete

  /**
   * Underwater Depth
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierunderwaterdepth Apple Docs HKQuantityTypeIdentifierUnderwaterDepth}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierUnderwaterDepth'

  /**
   * Water Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierwatertemperature Apple Docs HKQuantityTypeIdentifierWaterTemperature}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierWaterTemperature'

  /**
   * Apple Sleeping Wrist Temperature
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierapplesleepingwristtemperature Apple Docs HKQuantityTypeIdentifierAppleSleepingWristTemperature}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierAppleSleepingWristTemperature'

  /**
   * Time In Daylight
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiertimeindaylight Apple Docs HKQuantityTypeIdentifierTimeInDaylight}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierTimeInDaylight'

  /**
   * Physical Effort
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierphysicaleffort Apple Docs HKQuantityTypeIdentifierPhysicalEffort}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierPhysicalEffort'

  /**
   * Cycling Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingspeed Apple Docs HKQuantityTypeIdentifierCyclingSpeed}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierCyclingSpeed'

  /**
   * Cycling Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingpower Apple Docs HKQuantityTypeIdentifierCyclingPower}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierCyclingPower'

  /**
   * Cycling Functional Threshold Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingfunctionalthresholdpower Apple Docs HKQuantityTypeIdentifierCyclingFunctionalThresholdPower}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierCyclingFunctionalThresholdPower'

  /**
   * Cycling Cadence
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifiercyclingcadence Apple Docs HKQuantityTypeIdentifierCyclingCadence}
   * @since iOS 17
   */
  | 'HKQuantityTypeIdentifierCyclingCadence'

  /**
   * Environmental Sound Reduction
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierenvironmentalsoundreduction Apple Docs HKQuantityTypeIdentifierEnvironmentalSoundReduction}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierEnvironmentalSoundReduction'

  /**
   * Heart Rate Recovery One Minute
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierheartraterecoveryoneminute Apple Docs HKQuantityTypeIdentifierHeartRateRecoveryOneMinute}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierHeartRateRecoveryOneMinute'

  /**
   * Running Ground Contact Time
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunninggroundcontacttime Apple Docs HKQuantityTypeIdentifierRunningGroundContactTime}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierRunningGroundContactTime'

  /**
   * Running Stride Length
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningstridelength Apple Docs HKQuantityTypeIdentifierRunningStrideLength}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierRunningStrideLength'

  /**
   * Running Power
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningpower Apple Docs HKQuantityTypeIdentifierRunningPower}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierRunningPower'

  /**
   * Running Vertical Oscillation
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningverticaloscillation Apple Docs HKQuantityTypeIdentifierRunningVerticalOscillation}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierRunningVerticalOscillation'

  /**
   * Running Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifierrunningspeed Apple Docs HKQuantityTypeIdentifierRunningSpeed}
   * @since iOS 16
   */
  | 'HKQuantityTypeIdentifierRunningSpeed'

  /**
   * Cross Country Skiing Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierCrossCountrySkiingSpeed Apple Docs HKQuantityTypeIdentifierCrossCountrySkiingSpeed}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierCrossCountrySkiingSpeed'

  /**
   * Cross Country Skiing Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierDistanceCrossCountrySkiing Apple Docs HKQuantityTypeIdentifierCrossCountrySkiingDistance}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierDistanceCrossCountrySkiing'

  /**
   * Paddle Sports Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierDistancePaddleSports Apple Docs HKQuantityTypeIdentifierDistancePaddleSports}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierDistancePaddleSports'

  /**
   * Rowing Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierDistanceRowing Apple Docs HKQuantityTypeIdentifierDistanceRowing}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierDistanceRowing'

  /**
   * Skating Sports Distance
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierDistanceSkatingSports Apple Docs HKQuantityTypeIdentifierDistanceSkatingSports}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierDistanceSkatingSports'

  /**
   * Estimated Workout Effort Score
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierEstimatedWorkoutEffortScore Apple Docs HKQuantityTypeIdentifierEstimatedWorkoutEffortScore}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierEstimatedWorkoutEffortScore'

  /**
   * Paddle Sports Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierPaddleSportsSpeed Apple Docs HKQuantityTypeIdentifierPaddleSportsSpeed}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierPaddleSportsSpeed'

  /**
   * Rowing Speed
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierRowingSpeed Apple Docs HKQuantityTypeIdentifierRowingSpeed}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierRowingSpeed'

  /**
   * Workout Effort Score
   * @see {@link https://developer.apple.com/documentation/healthkit/HKQuantityTypeIdentifierWorkoutEffortScore Apple Docs HKQuantityTypeIdentifierWorkoutEffortScore}
   * @since iOS 18
   */
  | 'HKQuantityTypeIdentifierWorkoutEffortScore'

export type QuantityTypeIdentifier =
  | QuantityTypeIdentifierReadOnly
  | QuantityTypeIdentifierWriteable
