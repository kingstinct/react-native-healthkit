import {
  queryQuantitySamples,
  queryStatisticsCollectionForQuantity,
  queryStatisticsForQuantity,
  queryWorkoutSamples,
} from '@kingstinct/exact-healthkit'
import type { Answer, Sources } from './app.contract.d.ts'

export const grants =
  'device.health-read purpose.health\ndevice.health-write purpose.healthWrite'

const DAY = 86_400_000

/** The start of the local day holding `at`, for a zone `offsetMinutes` east of UTC. */
const dayStart = (at: number, offsetMinutes: number) => {
  const local = at + offsetMinutes * 60_000
  return local - (((local % DAY) + DAY) % DAY) - offsetMinutes * 60_000
}

/** A filter of every field, left out but its date range. */
const between = (startDate: number, endDate: number) => ({
  uuid: null,
  uuids: null,
  metadata: null,
  workoutUuid: null,
  sourceBundleIdentifiers: null,
  date: { startDate, endDate, strictStartDate: null, strictEndDate: null },
  anyOf: null,
  allOf: null,
  noneOf: null,
})

const sum = async (
  identifier: string,
  unit: string,
  from: number,
  to: number,
) => {
  const s = await queryStatisticsForQuantity({
    identifier,
    statistics: ['cumulativeSum'],
    unit,
    filter: between(from, to),
  })
  return s.sumQuantity?.quantity ?? 0
}

// HKWorkoutActivityType's raw values the list names; any other is a workout.
const ACTIVITIES: Record<number, [string, string]> = {
  13: ['Cycling', 'symbol:sf/bicycle'],
  24: ['Hiking', 'symbol:sf/figure.hiking'],
  37: ['Running', 'symbol:sf/figure.run'],
  46: ['Swimming', 'symbol:sf/figure.pool.swim'],
  50: ['Strength Training', 'symbol:sf/dumbbell'],
  52: ['Walking', 'symbol:sf/figure.walk'],
  57: ['Yoga', 'symbol:sf/figure.yoga'],
  63: ['HIIT', 'symbol:sf/figure.highintensity.intervaltraining'],
}

const sources: Sources = {
  todaySummary: async ([offset, now]) => {
    const from = dayStart(now, offset)
    const to = from + DAY
    const [steps, energy, distance, heart] = await Promise.all([
      sum('HKQuantityTypeIdentifierStepCount', 'count', from, to),
      sum('HKQuantityTypeIdentifierActiveEnergyBurned', 'kcal', from, to),
      sum('HKQuantityTypeIdentifierDistanceWalkingRunning', 'm', from, to),
      queryQuantitySamples({
        identifier: 'HKQuantityTypeIdentifierHeartRate',
        limit: 1,
        ascending: false,
        unit: 'count/min',
        filter: between(from, to),
      }),
    ])
    return { steps, energy, distance, heartRate: heart[0]?.quantity ?? null }
  },

  weekSteps: async ([offset, now]) => {
    const today = dayStart(now, offset)
    const from = today - 6 * DAY
    const days = await queryStatisticsCollectionForQuantity({
      identifier: 'HKQuantityTypeIdentifierStepCount',
      statistics: ['cumulativeSum'],
      unit: 'count',
      anchorDate: from,
      intervalComponents: {
        minute: null,
        hour: null,
        day: 1,
        month: null,
        year: null,
      },
      filter: between(from, today + DAY),
    })
    const byStart = new Map(
      days.map((d) => [d.startDate, d.sumQuantity?.quantity ?? 0]),
    )
    return Array.from({ length: 7 }, (_, i) => {
      const start = today - i * DAY
      const local = new Date(start + offset * 60_000)
      const day = local.toISOString().slice(0, 10)
      const label =
        i === 0
          ? 'Today'
          : i === 1
            ? 'Yesterday'
            : local.toLocaleDateString('en-US', {
                weekday: 'long',
                timeZone: 'UTC',
              })
      return { day, label, steps: byStart.get(start) ?? 0 }
    })
  },

  recentWorkouts: async () => {
    const workouts = await queryWorkoutSamples({ limit: 50, ascending: false })
    return workouts.map((w) => {
      const [name, symbol] = ACTIVITIES[w.workoutActivityType] ?? [
        'Workout',
        'symbol:sf/figure.mixed.cardio',
      ]
      return {
        id: w.uuid,
        name,
        symbol,
        start: w.startDate,
        minutes: w.duration.quantity / 60,
        energy: w.totalEnergyBurned?.quantity ?? null,
        distance: w.totalDistance?.quantity ?? null,
      }
    })
  },

  recentWeights: async () => {
    const samples = await queryQuantitySamples({
      identifier: 'HKQuantityTypeIdentifierBodyMass',
      limit: 10,
      ascending: false,
      unit: 'kg',
    })
    return samples.map((s) => ({
      id: s.uuid,
      at: s.startDate,
      kg: Math.round(s.quantity * 10) / 10,
    }))
  },
}

export const answer: Answer = (source, args, store, storage, native) =>
  sources[source](args, store, storage, native)
