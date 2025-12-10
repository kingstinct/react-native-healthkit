import {
  AuthorizationRequestStatus,
  type CategoryTypeIdentifier,
  getRequestStatusForAuthorization,
  type OnCategorySamplesCallback,
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
  description?: string
  appState: AppState['currentState']
}

const defaultStore = getDefaultStore()

export const subscriptionEvents = atomWithMMKV<SubscriptionEvent[]>(
  'subscriptionEvents',
  [],
)

const callback = (
  args:
    | OnChangeCallbackArgs
    | OnQuantitySamplesCallback
    | OnCategorySamplesCallback<CategoryTypeIdentifier>,
) => {
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
    if ('samples' in args) {
      const firstSample = args.samples[0]
      if (firstSample) {
        const body =
          'quantity' in firstSample
            ? `${firstSample.quantity} ${firstSample.unit}`
            : `Value: ${firstSample.value}`

        return scheduleNotificationAsync({
          content: {
            title: `Got a new ${typeIdentifier}`,
            body: body,
          },
          trigger: null,
        })
      }
    }

    scheduleNotificationAsync({
      content: {
        title: `Got a new ${typeIdentifier}`,
        body: '',
      },
      trigger: null,
    })
  }

  defaultStore.set(subscriptionEvents, (prevEvents) => [
    {
      sampleTypeIdentifier: args.typeIdentifier,
      timestamp: Date.now(),
      appState: AppState.currentState,
      description: 'samples' in args ? `+${args.samples.length} samples` : '',
    },
    ...prevEvents,
  ])
}

export const initSubscriptions = async () => {
  const status = await getRequestStatusForAuthorization({
    toRead: AllSampleTypesInApp,
    toShare: AllSampleTypesInApp,
  })
  console.log('Subscription init authorization status:', status)
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
