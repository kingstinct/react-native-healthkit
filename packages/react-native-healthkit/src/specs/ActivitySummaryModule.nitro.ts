import type { HybridObject } from 'react-native-nitro-modules'
import type { ActivitySummary } from '../types/ActivitySummary'

export interface ActivitySummaryModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * Query HKActivitySummary rollups for the calendar days intersecting
   * [startDate, endDate] (inclusive, interpreted in the user's current calendar).
   */
  queryActivitySummaries(
    startDate: Date,
    endDate: Date,
  ): Promise<ActivitySummary[]>
}
