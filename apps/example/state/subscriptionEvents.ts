import {
  AuthorizationRequestStatus,
  getRequestStatusForAuthorization,
  type OnChangeCallbackArgs,
  type OnQuantitySamplesCallback,
  type QuantityTypeIdentifier,
  type QuantityTypeIdentifierWriteable,
  type SampleTypeIdentifier,
  subscribeToChanges,
} from '@kingstinct/react-native-healthkit'
import { subscribeToQuantitySamples } from '@kingstinct/react-native-healthkit/utils/subscribeToQuantitySamples'
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics'
import { scheduleNotificationAsync } from 'expo-notifications'
import { getDefaultStore } from 'jotai'
import { AppState } from 'react-native'
import {
  AllQuantityTypeIdentifierInApp,
  AllSampleTypesInApp,
} from '@/constants/AllUsedIdentifiersInApp'
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

const callback = (args: OnChangeCallbackArgs | OnQuantitySamplesCallback) => {
  const { typeIdentifier } = args
  if ('errorMessage' in args && args.errorMessage) {
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
        title: `Got a new ${typeIdentifier} update!`,
        body: 'samples' in args ? String(args.samples.length) : '',
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

export const initSubscriptions = async () => {
  const status = await getRequestStatusForAuthorization({
    toRead: AllSampleTypesInApp,
    toShare: AllSampleTypesInApp,
  })
  if (status === AuthorizationRequestStatus.unnecessary) {
    AllSampleTypesInApp.forEach((sampleType) => {
      if (
        AllQuantityTypeIdentifierInApp.includes(
          sampleType as QuantityTypeIdentifierWriteable,
        )
      ) {
        subscribeToQuantitySamples(
          sampleType as QuantityTypeIdentifier,
          callback,
        )
      } else {
        subscribeToChanges(sampleType, callback)
      }
    })
  }
}

void initSubscriptions()
