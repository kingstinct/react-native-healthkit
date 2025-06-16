import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QueryOptionsWithSortOrder } from '../types/QueryOptions'
import type {
  StateOfMindAssociation,
  StateOfMindKind,
  StateOfMindLabel,
  StateOfMindSample,
} from '../types/StateOfMind'

export interface StateOfMindModule extends HybridObject<{ ios: 'swift' }> {
  queryStateOfMindSamples(
    options?: QueryOptionsWithSortOrder,
  ): Promise<readonly StateOfMindSample[]>

  saveStateOfMindSample(
    date: Date,
    kind: StateOfMindKind,
    valence: number,
    labels: readonly StateOfMindLabel[],
    associations: readonly StateOfMindAssociation[],
    metadata?: AnyMap,
  ): Promise<boolean>
}
