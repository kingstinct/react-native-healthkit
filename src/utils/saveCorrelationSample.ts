import Native from '../native-types'
import ensureMetadata from './ensureMetadata'

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
    samples.map((s) => ({ ...s, metadata: ensureMetadata(s.metadata) })),
    start,
    end,
    ensureMetadata(options?.metadata),
  )
}

export default saveCorrelationSample
