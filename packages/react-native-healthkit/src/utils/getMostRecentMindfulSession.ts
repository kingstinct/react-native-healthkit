import { CategoryTypes } from '../modules'

/**
 * Get the most recent mindful session from HealthKit
 * @returns Promise that resolves to the most recent mindful session or undefined
 * @example
 * ```typescript
 * const lastSession = await getMostRecentMindfulSession()
 *
 * if (lastSession) {
 *   const duration = lastSession.endDate.getTime() - lastSession.startDate.getTime()
 *   console.log(`Last session was ${duration / 1000 / 60} minutes`)
 * }
 * ```
 */
export async function getMostRecentMindfulSession() {
  const samples = await CategoryTypes.queryCategorySamples(
    'HKCategoryTypeIdentifierMindfulSession',
    {
      limit: 1,
      ascending: false,
    },
  )

  return samples[0]
}

export default getMostRecentMindfulSession
