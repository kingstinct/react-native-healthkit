import { List } from '@expo/ui/swift-ui'
import { Section, Text } from '@expo/ui/swift-ui-primitives'
import {
  enableBackgroundDelivery,
  subscribeToChanges,
  unsubscribeQueries,
} from '@kingstinct/react-native-healthkit'
import { UpdateFrequency } from '@kingstinct/react-native-healthkit/types/Background'
import type { SampleTypeIdentifier } from '@kingstinct/react-native-healthkit/types/Shared'
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'
import { AllSampleTypesInApp } from '@/constants/AllUsedIdentifiersInApp'

const transformIdentifierToName = (identifier: SampleTypeIdentifier) => {
  return identifier
    .replace('HKQuantityTypeIdentifier', '')
    .replace('HK', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

const Subscriptions = () => {
  const [events, setEvents] = useState<
    { sampleTypeIdentifier: SampleTypeIdentifier; timestamp: Date }[]
  >([])

  useEffect(() => {
    let subscriptionIds: string[] = []
    const init = async () => {
      const _response = await Notifications.requestPermissionsAsync({
        ios: {
          provideAppNotificationSettings: true,
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
        },
      })

      subscriptionIds = AllSampleTypesInApp.map((sampleType) => {
        enableBackgroundDelivery(sampleType, UpdateFrequency.immediate)

        return subscribeToChanges(sampleType, (args) => {
          if (args.errorMessage) {
            if (AppState.currentState === 'active') {
              alert(
                `Error in observer query for ${sampleType}: ${args.errorMessage}`,
              )
            } else {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Error in observer query!',
                  body: sampleType,
                },
                trigger: null,
              })
            }
            return
          }
          if (AppState.currentState === 'active') {
            impactAsync(ImpactFeedbackStyle.Light)
          } else {
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Got a new event!',
                body: sampleType,
              },
              trigger: null,
            })
          }

          setEvents((prevEvents) => [
            {
              sampleTypeIdentifier: args.typeIdentifier,
              timestamp: new Date(),
            },
            ...prevEvents,
          ])
        })
      })
    }
    void init()

    return () => {
      unsubscribeQueries(subscriptionIds)
    }
  }, [])

  return (
    <List scrollEnabled>
      <Text>Listening for new events..</Text>
      <Section title="Events">
        {events.map((event, _index) => (
          <ListItem
            key={
              event.sampleTypeIdentifier + event.timestamp.toLocaleTimeString()
            }
            title={transformIdentifierToName(event.sampleTypeIdentifier)}
            subtitle={`${event.timestamp.toLocaleTimeString()}`}
          />
        ))}
      </Section>
    </List>
  )
}

export default Subscriptions
