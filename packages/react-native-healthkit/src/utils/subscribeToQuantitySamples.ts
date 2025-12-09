import { queryQuantitySamples } from '../healthkit'
import type { QuantityTypeIdentifier } from '../types'
import type { OnQuantitySamplesCallback } from '../types/Subscriptions'
import { subscribeToChanges } from './subscribeToChanges'

export const subscribeToQuantitySamples = (
  identifier: QuantityTypeIdentifier,
  callback: (args: OnQuantitySamplesCallback) => void,
  after = new Date(),
) => {
  return subscribeToChanges(identifier, async ({ errorMessage }) => {
    if (errorMessage) {
      return callback({
        typeIdentifier: identifier,
        errorMessage,
      })
    }

    const samplesAfterLast = await queryQuantitySamples(identifier, {
      limit: 0,
      filter: {
        date: {
          startDate: after,
        },
      },
    })

    if (samplesAfterLast.length > 0) {
      callback({
        typeIdentifier: identifier,
        samples: samplesAfterLast,
      })
    }
  })
}
