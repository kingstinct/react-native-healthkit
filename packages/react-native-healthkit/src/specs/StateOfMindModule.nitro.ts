import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'
import type {
  StateOfMindAssociation,
  StateOfMindKind,
  StateOfMindLabel,
  StateOfMindSample,
  StateOfMindSamplesWithAnchorResponse,
} from '../types/StateOfMind'

export interface StateOfMindModule extends HybridObject<{ ios: 'swift' }> {
  queryStateOfMindSamples(
    options: QueryOptionsWithSortOrder,
  ): Promise<readonly StateOfMindSample[]>

  queryStateOfMindSamplesWithAnchor(
    options: QueryOptionsWithAnchor,
  ): Promise<StateOfMindSamplesWithAnchorResponse>

  saveStateOfMindSample(
    date: Date,
    kind: StateOfMindKind,
    valence: number,
    labels: readonly StateOfMindLabel[],
    associations: readonly StateOfMindAssociation[],
    metadata?: AnyMap,
  ): Promise<StateOfMindSample | null>
}
