import { CategoryTypes } from '../modules'
import type { QueryOptionsWithSortOrder } from '../types/QueryOptions'

/**
 * Query mindful sessions from HealthKit
 * @param options - Query options including filter, limit, and sort order
 * @returns Promise that resolves to an array of mindful session samples
 * @example
 * ```typescript
 * // Get the 10 most recent mindful sessions
 * const sessions = await queryMindfulSessions({
 *   limit: 10,
 *   ascending: false,
 * })
 *
 * // Get sessions from the last week
 * const weekAgo = new Date()
 * weekAgo.setDate(weekAgo.getDate() - 7)
 *
 * const recentSessions = await queryMindfulSessions({
 *   limit: 0,
 *   filter: {
 *     date: {
 *       startDate: weekAgo,
 *     },
 *   },
 * })
 * ```
 */
export async function queryMindfulSessions(
  options: QueryOptionsWithSortOrder = { limit: 20, ascending: false },
) {
  return CategoryTypes.queryCategorySamples(
    'HKCategoryTypeIdentifierMindfulSession',
    options,
  )
}

export default queryMindfulSessions
