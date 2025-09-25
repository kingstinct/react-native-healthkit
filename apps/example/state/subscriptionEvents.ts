import {
  type OnChangeCallbackArgs,
  type SampleTypeIdentifier,
  subscribeToChanges,
} from '@kingstinct/react-native-healthkit'
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics'
import { scheduleNotificationAsync } from 'expo-notifications'
import { getDefaultStore } from 'jotai'
import { AppState } from 'react-native'
import { AllSampleTypesInApp } from '@/constants/AllUsedIdentifiersInApp'
import { atomWithMMKV } from '@/utils/atomWithMMKV'

type SubscriptionEvent = {
  sampleTypeIdentifier: SampleTypeIdentifier
  timestamp: number
  appState: AppState['currentState']
}

const defaultStore = getDefaultStore()

export const subscriptionEvents = atomWithMMKV<SubscriptionEvent[]>(
  'subscriptionEvents',
  [],
)

const callback = (args: OnChangeCallbackArgs) => {
  const { typeIdentifier } = args
  if (args.errorMessage) {
    if (AppState.currentState === 'active') {
      alert(
        `Error in observer query for ${typeIdentifier}: ${args.errorMessage}`,
      )
    } else {
      scheduleNotificationAsync({
        content: {
          title: 'Error in observer query!',
          body: typeIdentifier,
        },
        trigger: null,
      })
    }
    return
  }
  if (AppState.currentState === 'active') {
    impactAsync(ImpactFeedbackStyle.Light)
  } else {
    scheduleNotificationAsync({
      content: {
        title: 'Got a new event!',
        body: typeIdentifier,
      },
      trigger: null,
    })
  }

  defaultStore.set(subscriptionEvents, (prevEvents) => [
    {
      sampleTypeIdentifier: args.typeIdentifier,
      timestamp: Date.now(),
      appState: AppState.currentState,
    },
    ...prevEvents,
  ])
}

//let subscriptionIds: string[] = []
const init = async () => {
  /*subscriptionIds =*/ AllSampleTypesInApp.map((sampleType) => {
    return subscribeToChanges(sampleType, callback)
  })
}
void init()
