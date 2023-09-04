import ensureMetadata from './ensureMetadata'
import Native from '../native-types'

import type { MetadataMapperForCorrelationIdentifier, HKCorrelationTypeIdentifier } from '../native-types'
import type { HKCategorySampleForSaving, HKQuantitySampleForSaving } from '../types'

async function saveCorrelationSample<
  TIdentifier extends HKCorrelationTypeIdentifier,
  TSamples extends readonly(
    | HKCategorySampleForSaving
    | HKQuantitySampleForSaving
  )[]
>(
  typeIdentifier: TIdentifier,
  samples: TSamples,
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCorrelationIdentifier<TIdentifier>;
  },
) {
  const start = (options?.start || new Date()).toISOString()
  const end = (options?.end || new Date()).toISOString()

  return Native.saveCorrelationSample(
    typeIdentifier,
    samples.map((sample) => {
      const { startDate, endDate, ...rest } = sample
      const updatedSample = {
        ...rest,
        ...(startDate && { startDate: new Date(startDate).toISOString() }),
        ...(endDate && { endDate: new Date(endDate).toISOString() }),
      }

      return { ...updatedSample, metadata: ensureMetadata(sample.metadata) }
    }),
    start,
    end,
    ensureMetadata(options?.metadata),
  )
}

export default saveCorrelationSample
