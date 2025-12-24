import { useCallback, useState } from 'react'

import type { CategorySampleTyped } from '../types/CategoryType'
import getMostRecentMindfulSession from '../utils/getMostRecentMindfulSession'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * Hook to get and subscribe to the most recent mindful session
 * @returns The most recent mindful session or undefined
 * @example
 * ```typescript
 * function MindfulSessionDisplay() {
 *   const lastSession = useMostRecentMindfulSession()
 *
 *   if (!lastSession) {
 *     return <Text>No mindful sessions recorded</Text>
 *   }
 *
 *   const duration = lastSession.endDate.getTime() - lastSession.startDate.getTime()
 *   const minutes = Math.floor(duration / 1000 / 60)
 *
 *   return (
 *     <View>
 *       <Text>Last mindful session: {minutes} minutes</Text>
 *       <Text>Started: {lastSession.startDate.toLocaleString()}</Text>
 *     </View>
 *   )
 * }
 * ```
 */
export function useMostRecentMindfulSession() {
  const [session, setSession] =
    useState<
      CategorySampleTyped<'HKCategoryTypeIdentifierMindfulSession'>
    >()

  const updater = useCallback(() => {
    void getMostRecentMindfulSession().then(setSession)
  }, [])

  useSubscribeToChanges('HKCategoryTypeIdentifierMindfulSession', updater)

  return session
}

export default useMostRecentMindfulSession
