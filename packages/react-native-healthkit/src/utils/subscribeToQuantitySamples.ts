import { QuantityTypes } from '../modules'
import type { QuantityTypeIdentifier } from '../types'
import type { OnQuantitySamplesCallback } from '../types/Subscriptions'
import { subscribeToChanges } from './subscribeToChanges'

export const subscribeToQuantitySamples = (
  identifier: QuantityTypeIdentifier,
  callback: (args: OnQuantitySamplesCallback) => void,
  after?: Date,
) => {
  let anchor: string | undefined
  const afterDate = after ?? new Date()

  return subscribeToChanges(identifier, async ({ errorMessage }) => {
    if (errorMessage) {
      return callback({
        typeIdentifier: identifier,
        errorMessage,
      })
    }

    const { samples, newAnchor, deletedSamples } =
      await QuantityTypes.queryQuantitySamplesWithAnchor(identifier, {
        anchor: anchor,
        filter: {
          startDate: afterDate,
        },
      })

    anchor = newAnchor

    if (samples.length > 0 || deletedSamples.length > 0) {
      callback({
        typeIdentifier: identifier,
        samples: samples,
        anchor: newAnchor,
        deletedSamples: deletedSamples,
      })
    }
  })
}
