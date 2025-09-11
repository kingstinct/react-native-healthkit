import type { HybridObject } from 'react-native-nitro-modules'
import type {
  ECGQueryOptionsWithAnchor,
  ECGQueryOptionsWithSortOrder,
  ElectrocardiogramSample,
  ElectrocardiogramSamplesWithAnchorResponse,
} from '../types/ElectrocardiogramSample'

export interface ElectrocardiogramModule
  extends HybridObject<{ ios: 'swift' }> {
  queryElectrocardiogramSamples(
    options?: ECGQueryOptionsWithSortOrder,
  ): Promise<readonly ElectrocardiogramSample[]>

  queryElectrocardiogramSamplesWithAnchor(
    options: ECGQueryOptionsWithAnchor,
  ): Promise<ElectrocardiogramSamplesWithAnchorResponse>
}
