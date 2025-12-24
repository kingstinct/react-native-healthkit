import { CategoryTypes } from '../modules'
import type { OnCategorySamplesCallback } from '../types/Subscriptions'
import { subscribeToChanges } from './subscribeToChanges'

/**
 * Subscribe to changes in mindful sessions
 * @param callback - Function called when mindful sessions change
 * @param after - Date after which to query for changes (defaults to now)
 * @returns Unsubscribe function
 * @example
 * ```typescript
 * const unsubscribe = subscribeToMindfulSessions(({ samples, errorMessage }) => {
 *   if (errorMessage) {
 *     console.error('Error:', errorMessage)
 *     return
 *   }
 *
 *   if (samples && samples.length > 0) {
 *     console.log(`${samples.length} new mindful session(s) logged`)
 *     samples.forEach(session => {
 *       const duration = session.endDate.getTime() - session.startDate.getTime()
 *       console.log(`Session duration: ${duration / 1000 / 60} minutes`)
 *     })
 *   }
 * })
 *
 * // Later, when you want to stop listening:
 * unsubscribe()
 * ```
 */
export function subscribeToMindfulSessions(
  callback: (
    args: OnCategorySamplesCallback<'HKCategoryTypeIdentifierMindfulSession'>,
  ) => void,
  after = new Date(),
) {
  return subscribeToChanges(
    'HKCategoryTypeIdentifierMindfulSession',
    async ({ errorMessage }) => {
      if (errorMessage) {
        return callback({
          typeIdentifier: 'HKCategoryTypeIdentifierMindfulSession',
          errorMessage,
        } as OnCategorySamplesCallback<'HKCategoryTypeIdentifierMindfulSession'>)
      }

      const samplesAfterLast = await CategoryTypes.queryCategorySamples(
        'HKCategoryTypeIdentifierMindfulSession',
        {
          limit: 0,
          filter: {
            date: {
              startDate: after,
            },
          },
        },
      )

      if (samplesAfterLast.length > 0) {
        callback({
          typeIdentifier: 'HKCategoryTypeIdentifierMindfulSession',
          samples: samplesAfterLast,
        } as OnCategorySamplesCallback<'HKCategoryTypeIdentifierMindfulSession'>)
      }
    },
  )
}

export default subscribeToMindfulSessions
