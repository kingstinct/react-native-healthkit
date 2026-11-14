import {
  queryQuantitySamples,
  queryStatisticsCollectionForQuantity,
} from '@kingstinct/exact-healthkit'
import type { Answer, Sources } from './app.contract.d.ts'

// The suite writes the id `exact new` gave the app.
export const appId = '__APP_ID__'
export const grants =
  'device.health-read purpose.health\ndevice.health-write purpose.healthWrite'

// A filter's fields are all written; `null` is a field left out.
const none = {
  uuid: null,
  uuids: null,
  metadata: null,
  date: null,
  workoutUuid: null,
  sourceBundleIdentifiers: null,
}

const sources: Sources = {
  // 12 October 2026 from 17:00 UTC, by uuid-less date filter, and with the
  // 17:00 sample left out by `noneOf`.
  filtered: async () => {
    try {
      const day = await queryQuantitySamples({
        identifier: 'HKQuantityTypeIdentifierStepCount',
        ascending: true,
        filter: {
          ...none,
          date: {
            startDate: Date.UTC(2026, 9, 12, 17),
            endDate: Date.UTC(2026, 9, 13),
            strictStartDate: null,
            strictEndDate: null,
          },
          anyOf: null,
          allOf: null,
          noneOf: [{ ...none, uuid: '00000000-0000-4000-8000-000000000017' }],
        },
      })
      return { text: day.map((s) => s.quantity).join(',') }
    } catch (e) {
      return { text: `error ${(e as { code?: string }).code}` }
    }
  },
  heart: async () => {
    try {
      const samples = await queryQuantitySamples({
        identifier: 'HKQuantityTypeIdentifierHeartRate',
        limit: 0,
        ascending: true,
        unit: 'count/min',
      })
      const days = await queryStatisticsCollectionForQuantity({
        identifier: 'HKQuantityTypeIdentifierHeartRate',
        statistics: ['discreteMax'],
        unit: 'count/min',
        anchorDate: Date.UTC(2026, 9, 11),
        intervalComponents: {
          minute: null,
          hour: null,
          day: 1,
          month: null,
          year: null,
        },
      })
      const max = days.map((d) => d.maximumQuantity?.quantity ?? '-').join(',')
      return { text: `${samples.map((s) => s.quantity).join(',')} max ${max}` }
    } catch (e) {
      return { text: `error ${(e as { code?: string }).code}` }
    }
  },
}

export const answer: Answer = (source, args, store, storage) =>
  sources[source](args, store, storage)
