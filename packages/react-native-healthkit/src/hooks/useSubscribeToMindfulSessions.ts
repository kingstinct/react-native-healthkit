import { useEffect, useState } from 'react'

import type { CategorySampleTyped } from '../types/CategoryType'
import subscribeToMindfulSessions from '../utils/subscribeToMindfulSessions'

/**
 * Hook to subscribe to new mindful sessions
 * @param after - Date after which to query for changes (defaults to now)
 * @returns Object containing new sessions and any error message
 * @example
 * ```typescript
 * function MindfulSessionMonitor() {
 *   const { sessions, errorMessage } = useSubscribeToMindfulSessions()
 *
 *   useEffect(() => {
 *     if (errorMessage) {
 *       console.error('Error subscribing to mindful sessions:', errorMessage)
 *     }
 *
 *     if (sessions && sessions.length > 0) {
 *       console.log(`${sessions.length} new session(s) recorded`)
 *     }
 *   }, [sessions, errorMessage])
 *
 *   return (
 *     <View>
 *       {sessions?.map(session => (
 *         <Text key={session.uuid}>
 *           {Math.floor((session.endDate.getTime() - session.startDate.getTime()) / 60000)} min
 *         </Text>
 *       ))}
 *     </View>
 *   )
 * }
 * ```
 */
export function useSubscribeToMindfulSessions(after = new Date()) {
  const [sessions, setSessions] = useState<
    readonly CategorySampleTyped<'HKCategoryTypeIdentifierMindfulSession'>[]
  >([])
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    const unsubscribe = subscribeToMindfulSessions((args) => {
      if ('errorMessage' in args) {
        setErrorMessage(args.errorMessage)
        return
      }

      if ('samples' in args) {
        setSessions(args.samples)
      }
    }, after)

    return unsubscribe
  }, [after])

  return { sessions, errorMessage }
}

export default useSubscribeToMindfulSessions
