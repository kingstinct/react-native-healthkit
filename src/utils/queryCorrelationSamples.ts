import deserializeCorrelation from './deserializeCorrelation'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type { HKCorrelationTypeIdentifier } from '../native-types'
import type { GenericQueryOptions, HKCorrelation } from '../types'

export type QueryCorrelationSamplesFn = <
  TIdentifier extends HKCorrelationTypeIdentifier
>(
  typeIdentifier: TIdentifier,
  options: Omit<GenericQueryOptions, 'anchor' | 'ascending' | 'limit'>
) => Promise<readonly HKCorrelation<TIdentifier>[]>;

const queryCorrelationSamples: QueryCorrelationSamplesFn = async (
  typeIdentifier,
  options,
) => {
  const opts = prepareOptions(options)
  const correlations = await Native.queryCorrelationSamples(
    typeIdentifier,
    opts.from,
    opts.to,
  )

  return correlations.map(deserializeCorrelation)
}

export default queryCorrelationSamples
