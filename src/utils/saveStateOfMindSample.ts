import Native from '../native-types'

import type { HKStateOfMindSampleRaw } from '../native-types'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/saving_data_to_healthkit Saving data to HealthKit (Apple Docs)}
 */
async function saveStateOfMindSample(
  options: Omit<
  HKStateOfMindSampleRaw,
  | 'uuid'
  | 'valenceClassification'
  | 'startDate'
  | 'endDate'
  | 'labels'
  | 'associations'
  | 'device'
  | 'sourceRevision'
  > & {
    // allow the user to provide a Date instead of expecting them to provide date.toISOString()
    readonly date: Date
    // omitting then redeclaring these in order to make them optional
    readonly associations?: HKStateOfMindSampleRaw['associations']
    readonly labels?: HKStateOfMindSampleRaw['labels']
  },
) {
  return Native.saveStateOfMindSample(
    options.date.toISOString(),
    options.kind,
    options.valence,
    options.labels || [],
    options.associations || [],
    options.metadata || {},
  )
}

export default saveStateOfMindSample
