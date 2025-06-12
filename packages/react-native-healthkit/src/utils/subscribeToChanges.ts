

import type { SampleTypeIdentifier } from '../../lib/specs/Shared'
import { Core } from '..'
import type { OnChangeCallbackArgs } from '../types/Subscriptons'

export const subscribeToChanges = (
  identifier: SampleTypeIdentifier,
  callback: (args: OnChangeCallbackArgs) => void,
) => {
  const queryId = Core.subscribeToObserverQuery(identifier, callback)

  return {
    remove: () => Core.unsubscribeQuery(queryId) 
  }
}
