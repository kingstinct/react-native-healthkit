import { Button, Host, List, Section, Text } from '@expo/ui/swift-ui'
import {
  enableBackgroundDelivery,
  UpdateFrequency,
} from '@kingstinct/react-native-healthkit'
import type { SampleTypeIdentifier } from '@kingstinct/react-native-healthkit/types/Shared'
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications'
import { getDefaultStore, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { ListItem } from '@/components/SwiftListItem'
import { AllSampleTypesInApp } from '@/constants/AllUsedIdentifiersInApp'
import { appStateEvents } from '@/state/appStateEvents'
import { subscriptionEvents } from '@/state/subscriptionEvents'

const transformIdentifierToName = (identifier: SampleTypeIdentifier) => {
  return identifier
    .replace('HKQuantityTypeIdentifier', '')
    .replace('HK', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

const Subscriptions = () => {
  const [subscriptionEventss] = useAtom(subscriptionEvents)
  const [eventsWithAppState] = useAtom(appStateEvents)

  const allEvents = useMemo(
    () =>
      [...subscriptionEventss, ...eventsWithAppState].sort(
        (a, b) => b.timestamp - a.timestamp,
      ),
    [subscriptionEventss, eventsWithAppState],
  )

  useEffect(() => {
    const init = async () => {
      const { status } = await getPermissionsAsync()
      if (status !== 'granted') {
        /*let subscriptionIds: string[] = [];*/
        const _response = await requestPermissionsAsync({
          ios: {
            provideAppNotificationSettings: true,
            allowAlert: true,
            allowSound: true,
            allowBadge: true,
          },
        })
      }

      /*subscriptionIds =*/ AllSampleTypesInApp.forEach((sampleType) => {
        enableBackgroundDelivery(sampleType, UpdateFrequency.immediate)
      })
    }
    init()
  }, [])

  return (
    <Host style={{ flex: 1 }}>
      <List scrollEnabled>
        <Text>Listening for new events..</Text>
        <Button
          onPress={() => {
            getDefaultStore().set(subscriptionEvents, [])
            getDefaultStore().set(appStateEvents, [])
          }}
        >
          Clear Events
        </Button>
        <Section title="Events">
          {allEvents.map((event, _index) => (
            <ListItem
              key={
                ('sampleTypeIdentifier' in event
                  ? event.sampleTypeIdentifier
                  : event.appState) +
                new Date(event.timestamp).valueOf().toString()
              }
              title={
                'sampleTypeIdentifier' in event
                  ? transformIdentifierToName(
                      event.sampleTypeIdentifier as SampleTypeIdentifier,
                    ) + (event.description ? ` (${event.description})` : '')
                  : event.appState
              }
              subtitle={`${new Date(event.timestamp).toLocaleTimeString()}`}
            />
          ))}
        </Section>
      </List>
    </Host>
  )
}

export default Subscriptions
