import { getDefaultStore } from 'jotai'
import { AppState } from 'react-native'
import { atomWithMMKV } from '@/utils/atomWithMMKV'

type SubscriptionEvent = {
  timestamp: number
  appState: AppState['currentState'] | 'cold-start'
}

const defaultStore = getDefaultStore()

export const appStateEvents = atomWithMMKV<SubscriptionEvent[]>(
  'appStateEvents',
  [],
)

//let subscriptionIds: string[] = []
const init = async () => {
  AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      defaultStore.set(appStateEvents, (prevEvents) =>
        prevEvents.map((e) =>
          e.appState === 'background' ? { ...e, appState: 'active' } : e,
        ),
      )
    }
  })

  defaultStore.set(appStateEvents, (prevEvents) => [
    {
      timestamp: Date.now(),
      appState: AppState.currentState,
    },
    {
      timestamp: Date.now(),
      appState: 'cold-start',
    },
    ...prevEvents,
  ])
}
void init()
