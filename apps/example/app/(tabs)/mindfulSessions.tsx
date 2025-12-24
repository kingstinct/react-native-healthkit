import { Host, List, Section } from '@expo/ui/swift-ui'
import {
  getMostRecentMindfulSession,
  queryMindfulSessions,
  saveMindfulSession,
  useMostRecentMindfulSession,
  useSubscribeToMindfulSessions,
} from '@kingstinct/react-native-healthkit'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, View } from 'react-native'
import { ListItem, type ListItemProps } from '@/components/SwiftListItem'
import { ThemedText } from '@/components/ThemedText'

const MindfulSessionsTab = () => {
  const [sessions, setSessions] = useState<ListItemProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Use the hook to get the most recent session
  const lastSession = useMostRecentMindfulSession()

  // Subscribe to new sessions
  const { sessions: newSessions, errorMessage } =
    useSubscribeToMindfulSessions()

  // Load recent sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true)
        const recentSessions = await queryMindfulSessions({
          limit: 20,
          ascending: false,
        })

        const formattedSessions = recentSessions.map((session) => {
          const durationMs =
            session.endDate.getTime() - session.startDate.getTime()
          const minutes = Math.floor(durationMs / 1000 / 60)
          const seconds = Math.floor((durationMs / 1000) % 60)

          return {
            title: `${minutes}m ${seconds}s`,
            subtitle: session.startDate.toLocaleString(),
            id: session.uuid,
          }
        })

        setSessions(formattedSessions)
      } catch (error) {
        console.error('Error loading mindful sessions:', error)
        Alert.alert('Error', 'Failed to load mindful sessions')
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  // Reload when new sessions are detected
  useEffect(() => {
    if (newSessions && newSessions.length > 0) {
      const reloadSessions = async () => {
        const recentSessions = await queryMindfulSessions({
          limit: 20,
          ascending: false,
        })

        const formattedSessions = recentSessions.map((session) => {
          const durationMs =
            session.endDate.getTime() - session.startDate.getTime()
          const minutes = Math.floor(durationMs / 1000 / 60)
          const seconds = Math.floor((durationMs / 1000) % 60)

          return {
            title: `${minutes}m ${seconds}s`,
            subtitle: session.startDate.toLocaleString(),
            id: session.uuid,
          }
        })

        setSessions(formattedSessions)
      }

      reloadSessions()
    }
  }, [newSessions])

  // Show error if subscription fails
  useEffect(() => {
    if (errorMessage) {
      Alert.alert('Subscription Error', errorMessage)
    }
  }, [errorMessage])

  const handleAddSession = async () => {
    try {
      setIsSaving(true)

      // Create a 10-minute session ending now
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 10 * 60 * 1000)

      await saveMindfulSession(startDate, endDate, {
        HKMetadataKeyUserMotionContext: 0, // stationary
      })

      Alert.alert('Success', '10-minute mindful session saved!')

      // Reload sessions
      const recentSessions = await queryMindfulSessions({
        limit: 20,
        ascending: false,
      })

      const formattedSessions = recentSessions.map((session) => {
        const durationMs =
          session.endDate.getTime() - session.startDate.getTime()
        const minutes = Math.floor(durationMs / 1000 / 60)
        const seconds = Math.floor((durationMs / 1000) % 60)

        return {
          title: `${minutes}m ${seconds}s`,
          subtitle: session.startDate.toLocaleString(),
          id: session.uuid,
        }
      })

      setSessions(formattedSessions)
    } catch (error) {
      console.error('Error saving mindful session:', error)
      Alert.alert('Error', 'Failed to save mindful session')
    } finally {
      setIsSaving(false)
    }
  }

  const lastSessionInfo = lastSession
    ? (() => {
        const durationMs =
          lastSession.endDate.getTime() - lastSession.startDate.getTime()
        const minutes = Math.floor(durationMs / 1000 / 60)
        const seconds = Math.floor((durationMs / 1000) % 60)
        return `${minutes}m ${seconds}s`
      })()
    : 'No sessions'

  return (
    <Host style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
          Most Recent Session: {lastSessionInfo}
        </ThemedText>
        {lastSession && (
          <ThemedText style={{ fontSize: 14, marginTop: 4 }}>
            {lastSession.startDate.toLocaleString()}
          </ThemedText>
        )}

        <View style={{ marginTop: 16 }}>
          <Button
            title={isSaving ? 'Saving...' : 'Add 10-minute Session'}
            onPress={handleAddSession}
            disabled={isSaving}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <List
          scrollEnabled
          listStyle="automatic"
          onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        >
          <Section title={`Recent Sessions (${sessions.length})`}>
            {sessions.length === 0 ? (
              <ListItem
                title="No mindful sessions found"
                subtitle="Add a session to get started"
              />
            ) : (
              sessions.map((session) => (
                <ListItem
                  key={session.id}
                  title={session.title}
                  subtitle={session.subtitle}
                />
              ))
            )}
          </Section>
        </List>
      )}
    </Host>
  )
}

export default MindfulSessionsTab
