import { CategoryTypes } from '../modules'
import type { CategoryTypeIdentifier } from '../types'
import type { OnCategorySamplesCallback } from '../types/Subscriptions'
import { subscribeToChanges } from './subscribeToChanges'

export function subscribeToCategorySamples<T extends CategoryTypeIdentifier>(
  identifier: T,
  callback: (args: OnCategorySamplesCallback<T>) => void,
  after = new Date(),
) {
  return subscribeToChanges(identifier, async ({ errorMessage }) => {
    if (errorMessage) {
      return callback({
        typeIdentifier: identifier,
        errorMessage,
      })
    }

    const samplesAfterLast = await CategoryTypes.queryCategorySamples(
      identifier,
      {
        limit: 0,
        filter: {
          date: {
            startDate: after,
          },
        },
      },
    )

    if (samplesAfterLast.length > 0) {
      callback({
        typeIdentifier: identifier,
        samples: samplesAfterLast,
      })
    }
  })
}
