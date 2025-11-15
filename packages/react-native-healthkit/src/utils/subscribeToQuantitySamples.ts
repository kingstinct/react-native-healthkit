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

  const init = async () => {
    // we need to do an initial query to get a handle for the deletedSamples
    const { newAnchor } = await QuantityTypes.queryQuantitySamplesWithAnchor(
      identifier,
      {
        filter: {
          startDate: afterDate,
        },
      },
    )
    anchor = newAnchor
  }

  init()

  return subscribeToChanges(identifier, async ({ errorMessage }) => {
    if (errorMessage) {
      return callback({
        typeIdentifier: identifier,
        errorMessage,
      })
    }

    // seems like all deletedSamples are included when no anchor is provided, so we don't want to return those for the first query
    const hadAnchorWhenDoingQuery = !!anchor

    const { samples, newAnchor, deletedSamples } =
      await QuantityTypes.queryQuantitySamplesWithAnchor(identifier, {
        anchor: anchor,
        filter: {
          startDate: afterDate,
        },
      })

    anchor = newAnchor

    const hasNewSamples =
      samples.length > 0 ||
      (deletedSamples.length > 0 && hadAnchorWhenDoingQuery)

    if (hasNewSamples) {
      callback({
        typeIdentifier: identifier,
        samples,
        anchor: newAnchor,
        deletedSamples: hadAnchorWhenDoingQuery ? deletedSamples : [],
      })
    }
  })
}
