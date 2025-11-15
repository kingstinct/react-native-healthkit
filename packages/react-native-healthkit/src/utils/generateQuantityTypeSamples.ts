import { QuantityTypes } from '../modules'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

/**
 * Options for generating quantity samples
 */
export interface GenerateQuantitySamplesOptions {
  /**
   * Start date for the generated samples. Defaults to 30 days ago.
   */
  fromDate?: Date
  /**
   * End date for the generated samples. Defaults to now.
   */
  toDate?: Date
}

/**
 * Realistic value ranges for different quantity types
 * Maps quantity type identifiers to [min, max] value ranges
 */
const REALISTIC_RANGES: Partial<
  Record<QuantityTypeIdentifier, [number, number]>
> = {
  // Body Measurements
  HKQuantityTypeIdentifierHeight: [150, 200], // cm
  HKQuantityTypeIdentifierBodyMass: [50, 120], // kg
  HKQuantityTypeIdentifierBodyMassIndex: [18, 35],
  HKQuantityTypeIdentifierBodyFatPercentage: [10, 40], // %
  HKQuantityTypeIdentifierLeanBodyMass: [40, 80], // kg
  HKQuantityTypeIdentifierWaistCircumference: [60, 120], // cm

  // Activity
  HKQuantityTypeIdentifierStepCount: [1000, 15000],
  HKQuantityTypeIdentifierDistanceWalkingRunning: [1000, 10000], // meters
  HKQuantityTypeIdentifierDistanceCycling: [2000, 30000], // meters
  HKQuantityTypeIdentifierDistanceWheelchair: [500, 5000], // meters
  HKQuantityTypeIdentifierBasalEnergyBurned: [1200, 2000], // kcal
  HKQuantityTypeIdentifierActiveEnergyBurned: [200, 1000], // kcal
  HKQuantityTypeIdentifierFlightsClimbed: [5, 50],
  HKQuantityTypeIdentifierAppleExerciseTime: [10, 120], // minutes
  HKQuantityTypeIdentifierPushCount: [20, 200],
  HKQuantityTypeIdentifierDistanceSwimming: [500, 3000], // meters
  HKQuantityTypeIdentifierSwimmingStrokeCount: [100, 2000],
  HKQuantityTypeIdentifierVO2Max: [20, 60], // ml/kg/min
  HKQuantityTypeIdentifierDistanceDownhillSnowSports: [1000, 20000], // meters
  HKQuantityTypeIdentifierAppleStandTime: [8, 16], // hours

  // Vitals
  HKQuantityTypeIdentifierHeartRate: [60, 100], // bpm
  HKQuantityTypeIdentifierBodyTemperature: [36.1, 37.2], // celsius
  HKQuantityTypeIdentifierBasalBodyTemperature: [36.1, 37.2], // celsius
  HKQuantityTypeIdentifierBloodPressureSystolic: [110, 140], // mmHg
  HKQuantityTypeIdentifierBloodPressureDiastolic: [70, 90], // mmHg
  HKQuantityTypeIdentifierRespiratoryRate: [12, 20], // breaths/min
  HKQuantityTypeIdentifierRestingHeartRate: [50, 80], // bpm
  HKQuantityTypeIdentifierWalkingHeartRateAverage: [80, 120], // bpm
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: [20, 100], // ms
  HKQuantityTypeIdentifierOxygenSaturation: [95, 100], // %
  HKQuantityTypeIdentifierBloodGlucose: [70, 180], // mg/dL

  // Nutrition
  HKQuantityTypeIdentifierDietaryFatTotal: [20, 100], // g
  HKQuantityTypeIdentifierDietaryFatPolyunsaturated: [5, 30], // g
  HKQuantityTypeIdentifierDietaryFatMonounsaturated: [10, 50], // g
  HKQuantityTypeIdentifierDietaryFatSaturated: [5, 30], // g
  HKQuantityTypeIdentifierDietaryCholesterol: [100, 400], // mg
  HKQuantityTypeIdentifierDietarySodium: [1500, 3500], // mg
  HKQuantityTypeIdentifierDietaryCarbohydrates: [100, 400], // g
  HKQuantityTypeIdentifierDietaryFiber: [15, 50], // g
  HKQuantityTypeIdentifierDietarySugar: [20, 100], // g
  HKQuantityTypeIdentifierDietaryEnergyConsumed: [1500, 3000], // kcal
  HKQuantityTypeIdentifierDietaryProtein: [50, 200], // g
  HKQuantityTypeIdentifierDietaryVitaminA: [500, 3000], // IU
  HKQuantityTypeIdentifierDietaryVitaminB6: [1, 5], // mg
  HKQuantityTypeIdentifierDietaryVitaminB12: [2, 10], // mcg
  HKQuantityTypeIdentifierDietaryVitaminC: [50, 200], // mg
  HKQuantityTypeIdentifierDietaryVitaminD: [400, 2000], // IU
  HKQuantityTypeIdentifierDietaryVitaminE: [10, 50], // mg
  HKQuantityTypeIdentifierDietaryVitaminK: [60, 200], // mcg
  HKQuantityTypeIdentifierDietaryCalcium: [800, 1500], // mg
  HKQuantityTypeIdentifierDietaryIron: [8, 30], // mg
  HKQuantityTypeIdentifierDietaryThiamin: [1, 3], // mg
  HKQuantityTypeIdentifierDietaryRiboflavin: [1, 3], // mg
  HKQuantityTypeIdentifierDietaryNiacin: [10, 30], // mg
  HKQuantityTypeIdentifierDietaryFolate: [200, 600], // mcg
  HKQuantityTypeIdentifierDietaryBiotin: [20, 100], // mcg
  HKQuantityTypeIdentifierDietaryPantothenicAcid: [3, 10], // mg
  HKQuantityTypeIdentifierDietaryPhosphorus: [500, 1500], // mg
  HKQuantityTypeIdentifierDietaryIodine: [100, 300], // mcg
  HKQuantityTypeIdentifierDietaryMagnesium: [200, 500], // mg
  HKQuantityTypeIdentifierDietaryZinc: [8, 20], // mg
  HKQuantityTypeIdentifierDietarySelenium: [50, 200], // mcg
  HKQuantityTypeIdentifierDietaryCopper: [0.5, 3], // mg
  HKQuantityTypeIdentifierDietaryManganese: [1, 5], // mg
  HKQuantityTypeIdentifierDietaryChromium: [20, 100], // mcg
  HKQuantityTypeIdentifierDietaryMolybdenum: [30, 100], // mcg
  HKQuantityTypeIdentifierDietaryChloride: [1500, 3500], // mg
  HKQuantityTypeIdentifierDietaryPotassium: [2000, 4500], // mg
  HKQuantityTypeIdentifierDietaryCaffeine: [50, 400], // mg
  HKQuantityTypeIdentifierDietaryWater: [1500, 3500], // ml

  // Other
  HKQuantityTypeIdentifierNumberOfTimesFallen: [0, 5],
  HKQuantityTypeIdentifierElectrodermalActivity: [0.1, 20], // microsiemens
  HKQuantityTypeIdentifierInhalerUsage: [1, 8],
  HKQuantityTypeIdentifierInsulinDelivery: [10, 80], // units
  HKQuantityTypeIdentifierBloodAlcoholContent: [0, 0.08], // %
  HKQuantityTypeIdentifierForcedVitalCapacity: [2, 6], // L
  HKQuantityTypeIdentifierForcedExpiratoryVolume1: [1.5, 5], // L
  HKQuantityTypeIdentifierPeakExpiratoryFlowRate: [300, 700], // L/min
  HKQuantityTypeIdentifierEnvironmentalAudioExposure: [30, 90], // dB
  HKQuantityTypeIdentifierHeadphoneAudioExposure: [40, 100], // dB
  HKQuantityTypeIdentifierNumberOfAlcoholicBeverages: [1, 5],
}

/**
 * Default range for quantity types not in the map
 */
const DEFAULT_RANGE: [number, number] = [0, 100]

/**
 * Generate a random value within a range
 */
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Generate test quantity samples for simulator testing.
 * This function creates realistic quantity samples spread evenly over a time period.
 *
 * @param quantityType - The quantity type identifier to generate samples for
 * @param numberOfSamples - Number of samples to generate
 * @param options - Optional configuration for date range
 * @returns Promise that resolves to true if all samples were saved successfully
 *
 * @example
 * ```typescript
 * // Generate 30 step count samples over the last 30 days
 * await generateQuantityTypeSamples('HKQuantityTypeIdentifierStepCount', 30)
 *
 * // Generate 7 heart rate samples over a custom date range
 * await generateQuantityTypeSamples(
 *   'HKQuantityTypeIdentifierHeartRate',
 *   7,
 *   {
 *     fromDate: new Date('2024-01-01'),
 *     toDate: new Date('2024-01-07')
 *   }
 * )
 * ```
 */
export async function generateQuantityTypeSamples(
  quantityType: QuantityTypeIdentifier,
  numberOfSamples: number,
  options?: GenerateQuantitySamplesOptions,
): Promise<boolean> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const fromDate = options?.fromDate ?? thirtyDaysAgo
  const toDate = options?.toDate ?? now

  const timeRange = toDate.getTime() - fromDate.getTime()
  const [minValue, maxValue] = REALISTIC_RANGES[quantityType] ?? DEFAULT_RANGE

  // Get the preferred unit for this quantity type
  const preferredUnits = await QuantityTypes.queryQuantitySamples(
    quantityType,
    {
      limit: 1,
    },
  )

  let unit = 'count' // default unit
  if (preferredUnits.length > 0 && preferredUnits[0]) {
    unit = preferredUnits[0].unit
  } else {
    // Try to determine unit from the quantity type
    // Most activity metrics use 'count' or distance uses 'm'
    if (quantityType.includes('Distance')) {
      unit = 'm'
    } else if (quantityType.includes('Energy')) {
      unit = 'kcal'
    } else if (quantityType.includes('HeartRate')) {
      unit = 'count/min'
    } else if (quantityType.includes('Temperature')) {
      unit = 'degC'
    } else if (quantityType.includes('BloodPressure')) {
      unit = 'mmHg'
    } else if (quantityType.includes('OxygenSaturation')) {
      unit = '%'
    }
  }

  const results: boolean[] = []

  for (let i = 0; i < numberOfSamples; i++) {
    // Spread samples evenly across the time range
    const sampleTime = fromDate.getTime() + (timeRange / numberOfSamples) * i
    const startDate = new Date(sampleTime)

    // End date is the same as start date for most quantity samples
    // (they represent a point-in-time measurement)
    const endDate = new Date(sampleTime)

    const value = randomInRange(minValue, maxValue)

    try {
      const result = await QuantityTypes.saveQuantitySample(
        quantityType,
        unit,
        value,
        startDate,
        endDate,
        {}, // empty metadata
      )
      results.push(result)
    } catch (error) {
      console.error(`Failed to save sample for ${quantityType}:`, error)
      results.push(false)
    }
  }

  return results.every((result) => result === true)
}

export default generateQuantityTypeSamples
