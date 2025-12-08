import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QueryOptionsWithSortOrder } from '../types'
import type {
  CorrelationSample,
  CorrelationTypeIdentifier,
  SampleForSaving,
} from '../types/CorrelationType'

export interface CorrelationTypeModule extends HybridObject<{ ios: 'swift' }> {
  saveCorrelationSample(
    typeIdentifier: CorrelationTypeIdentifier,
    samples: SampleForSaving[],
    start: Date,
    end: Date,
    metadata: AnyMap,
  ): Promise<boolean>

  queryCorrelationSamples(
    typeIdentifier: CorrelationTypeIdentifier,
    options?: QueryOptionsWithSortOrder,
  ): Promise<readonly CorrelationSample[]>
}
