import Native, { EventEmitter } from '../native-types'

import type { HKSampleTypeIdentifier } from '..'

const subscribeToChanges = async (
  identifier: HKSampleTypeIdentifier,
  callback: () => void,
) => {
  const subscription = EventEmitter.addListener(
    'onChange',
    ({ typeIdentifier }: { readonly typeIdentifier: HKSampleTypeIdentifier }) => {
      if (typeIdentifier === identifier) {
        callback()
      }
    },
  )

  const queryId = await Native.subscribeToObserverQuery(identifier).catch(
    async (error) => {
      subscription.remove()
      return Promise.reject(error)
    },
  )

  return async () => {
    subscription.remove()
    return Native.unsubscribeQuery(queryId)
  }
}

export default subscribeToChanges
