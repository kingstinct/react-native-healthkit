import type { AnyMap } from 'react-native-nitro-modules'
import { CategoryTypes } from '../modules'

/**
 * Save a mindful session to HealthKit
 * @param startDate - The start date and time of the mindful session
 * @param endDate - The end date and time of the mindful session
 * @param metadata - Optional metadata for the mindful session
 * @returns Promise that resolves to the saved mindful session or undefined
 * @example
 * ```typescript
 * const now = new Date()
 * const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)
 *
 * await saveMindfulSession(tenMinutesAgo, now, {
 *   HKMetadataKeyUserMotionContext: 0 // stationary
 * })
 * ```
 */
export async function saveMindfulSession(
  startDate: Date,
  endDate: Date,
  metadata?: AnyMap,
) {
  return CategoryTypes.saveCategorySample(
    'HKCategoryTypeIdentifierMindfulSession',
    0, // CategoryValueNotApplicable
    startDate,
    endDate,
    metadata,
  )
}

export default saveMindfulSession
