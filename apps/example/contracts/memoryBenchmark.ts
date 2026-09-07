import {
  queryQuantitySamples,
  queryWorkoutSamples,
  saveQuantitySample,
  saveWorkoutSample,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit'
import type { WorkoutProxyTyped } from '@kingstinct/react-native-healthkit/types/Workouts'

/**
 * Memory benchmarks that mirror the access patterns reported in
 * https://github.com/kingstinct/react-native-healthkit/issues/274 and
 * https://github.com/kingstinct/react-native-healthkit/issues/370.
 *
 * They are deliberately kept out of `runAllContractScenarios` so CI never runs
 * them; launch one with `bun run benchmark:memory <scenario-id>` instead. The
 * scenario itself only records wall-clock phases; the host-side runner samples
 * the process' resident memory while the phases run and correlates the two.
 */

export const BENCHMARK_BRAND = 'memory-benchmark'
const WORKOUT_COUNT = 200
const HEART_RATE_PER_WORKOUT = 50
const ROUTE_WORKOUTS = 20
const ROUTE_POINTS = 300
const DEFAULT_ITERATIONS = 40
let ITERATIONS = DEFAULT_ITERATIONS

/** Override the iteration count, e.g. from a `memory-fetch:120` scenario id. */
export function setBenchmarkIterations(iterations: number | undefined) {
  ITERATIONS =
    iterations && Number.isFinite(iterations) && iterations > 0
      ? Math.floor(iterations)
      : DEFAULT_ITERATIONS
}
const SETTLE_MS = 20_000
const WORKOUT_DURATION_MS = 30 * 60_000

export type MemoryBenchmarkId =
  | 'memory-seed'
  | 'memory-fetch'
  | 'memory-fetch-dispose'
  | 'memory-routes'
  | 'memory-routes-dispose'

export interface BenchmarkPhase {
  readonly name: string
  readonly startedAt: number
  readonly endedAt: number
  readonly details?: Record<string, number>
}

export interface MemoryBenchmarkResult {
  readonly id: MemoryBenchmarkId
  readonly title: string
  readonly ok: boolean
  readonly details: readonly string[]
  readonly payload?: {
    readonly config: Record<string, number>
    readonly phases: readonly BenchmarkPhase[]
  }
}

export interface MemoryBenchmark {
  readonly id: MemoryBenchmarkId
  readonly title: string
  readonly run: () => Promise<MemoryBenchmarkResult>
}

function currentConfig() {
  return {
    WORKOUT_COUNT,
    HEART_RATE_PER_WORKOUT,
    ROUTE_WORKOUTS,
    ROUTE_POINTS,
    ITERATIONS,
    SETTLE_MS,
  }
}

function benchmarkRange() {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 2 * 365 * 24 * 60 * 60_000)
  return { startDate, endDate }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function measure(
  phases: BenchmarkPhase[],
  name: string,
  run: () => Promise<Record<string, number> | undefined>,
) {
  const startedAt = Date.now()
  const details = await run()
  phases.push({ name, startedAt, endedAt: Date.now(), details })
}

async function queryBenchmarkWorkouts() {
  const workouts = await queryWorkoutSamples({
    filter: { date: benchmarkRange() },
    limit: 0,
  })
  return workouts
}

function isBenchmarkWorkout(workout: WorkoutProxyTyped) {
  return workout.metadata?.HKWorkoutBrandName === BENCHMARK_BRAND
}

async function seedWorkouts(existing: readonly WorkoutProxyTyped[]) {
  const seeded = existing.filter(isBenchmarkWorkout)
  if (seeded.length >= WORKOUT_COUNT) {
    return { created: 0, existing: seeded.length }
  }

  let created = 0
  for (let i = seeded.length; i < WORKOUT_COUNT; i++) {
    // Spread workouts out over the last two years, one every ~3 days.
    const start = new Date(
      Date.now() - (i + 1) * 3 * 24 * 60 * 60_000 - (i % 7) * 60 * 60_000,
    )
    const end = new Date(start.getTime() + WORKOUT_DURATION_MS)

    await saveWorkoutSample(
      WorkoutActivityType.running,
      [],
      start,
      end,
      { distance: 5000, energyBurned: 400 },
      { HKWorkoutBrandName: BENCHMARK_BRAND, HKIndoorWorkout: i % 2 === 0 },
    )

    const heartRateSaves: Promise<unknown>[] = []
    for (let j = 0; j < HEART_RATE_PER_WORKOUT; j++) {
      const at = new Date(
        start.getTime() + (j * WORKOUT_DURATION_MS) / HEART_RATE_PER_WORKOUT,
      )
      heartRateSaves.push(
        saveQuantitySample(
          'HKQuantityTypeIdentifierHeartRate',
          'count/min',
          120 + ((i + j) % 40),
          at,
          at,
        ),
      )
    }
    await Promise.all(heartRateSaves)
    created++
  }

  return { created, existing: seeded.length }
}

async function seedRoutes(workouts: readonly WorkoutProxyTyped[]) {
  const candidates = workouts
    .filter(isBenchmarkWorkout)
    .slice(0, ROUTE_WORKOUTS)
  let created = 0

  for (const workout of candidates) {
    const routes = await workout.getWorkoutRoutes()
    if (routes.length > 0) {
      continue
    }

    const start = workout.startDate.getTime()
    const locations = Array.from({ length: ROUTE_POINTS }, (_, index) => ({
      latitude: 59.3293 + index * 0.0001,
      longitude: 18.0686 + index * 0.0001,
      altitude: 20 + (index % 10),
      course: 90,
      speed: 3,
      horizontalAccuracy: 5,
      verticalAccuracy: 5,
      date: new Date(start + (index * WORKOUT_DURATION_MS) / ROUTE_POINTS),
    }))

    await workout.saveWorkoutRoute(locations)
    created++
  }

  return { created, candidates: candidates.length }
}

/**
 * The access pattern from #274: fetch all workouts, then the heart-rate
 * samples inside each one, keeping only plain data.
 */
async function fetchIteration(dispose: boolean) {
  const workouts = await queryBenchmarkWorkouts()
  const counts = await Promise.all(
    workouts.map(async (workout) => {
      const samples = await queryQuantitySamples(
        'HKQuantityTypeIdentifierHeartRate',
        {
          filter: {
            date: {
              startDate: workout.startDate,
              endDate: workout.endDate,
            },
          },
          limit: 0,
        },
      )
      const count = samples.length
      if (dispose) {
        workout.dispose()
      }
      return count
    }),
  )

  return {
    workouts: workouts.length,
    heartRateSamples: counts.reduce((sum, count) => sum + count, 0),
  }
}

/**
 * The access pattern from #370: fetch routes for every workout, repeatedly.
 */
async function routesIteration(
  workouts: readonly WorkoutProxyTyped[],
  dispose: boolean,
) {
  let routes = 0
  let locations = 0
  for (const workout of workouts) {
    const workoutRoutes = await workout.getWorkoutRoutes()
    routes += workoutRoutes.length
    for (const route of workoutRoutes) {
      locations += route.locations.length
    }
  }
  if (dispose) {
    for (const workout of workouts) {
      workout.dispose()
    }
  }
  return { workouts: workouts.length, routes, locations }
}

function makeBenchmark(
  id: MemoryBenchmarkId,
  title: string,
  body: (phases: BenchmarkPhase[]) => Promise<void>,
): MemoryBenchmark {
  return {
    id,
    title,
    run: async () => {
      const phases: BenchmarkPhase[] = []
      try {
        await measure(phases, 'idle', async () => {
          await sleep(5_000)
          return undefined
        })
        await body(phases)
        await measure(phases, 'settle', async () => {
          await sleep(SETTLE_MS)
          return undefined
        })
        return {
          id,
          title,
          ok: true,
          details: phases.map(
            (phase) =>
              `${phase.name}: ${phase.endedAt - phase.startedAt}ms ${JSON.stringify(phase.details ?? {})}`,
          ),
          payload: { config: currentConfig(), phases },
        }
      } catch (error) {
        return {
          id,
          title,
          ok: false,
          details: [error instanceof Error ? error.message : String(error)],
          payload: { config: currentConfig(), phases },
        }
      }
    },
  }
}

const seedBenchmark = makeBenchmark(
  'memory-seed',
  'Seed benchmark data',
  async (phases) => {
    await measure(phases, 'seed-workouts', async () => {
      const existing = await queryBenchmarkWorkouts()
      return seedWorkouts(existing)
    })
    await measure(phases, 'seed-routes', async () => {
      const workouts = await queryBenchmarkWorkouts()
      return seedRoutes(workouts)
    })
  },
)

const fetchBenchmark = makeBenchmark(
  'memory-fetch',
  'Fetch workouts + heart rate (#274)',
  async (phases) => {
    for (let i = 0; i < ITERATIONS; i++) {
      await measure(phases, `fetch-${i + 1}`, () => fetchIteration(false))
    }
  },
)

const fetchDisposeBenchmark = makeBenchmark(
  'memory-fetch-dispose',
  'Fetch workouts + heart rate, dispose() proxies (#274)',
  async (phases) => {
    for (let i = 0; i < ITERATIONS; i++) {
      await measure(phases, `fetch-${i + 1}`, () => fetchIteration(true))
    }
  },
)

const routesBenchmark = makeBenchmark(
  'memory-routes',
  'Fetch workout routes repeatedly (#370)',
  async (phases) => {
    const workouts = await queryBenchmarkWorkouts()
    for (let i = 0; i < ITERATIONS; i++) {
      await measure(phases, `routes-${i + 1}`, () =>
        routesIteration(workouts, false),
      )
    }
  },
)

const routesDisposeBenchmark = makeBenchmark(
  'memory-routes-dispose',
  'Fetch workout routes once, dispose() proxies (#370)',
  async (phases) => {
    for (let i = 0; i < ITERATIONS; i++) {
      await measure(phases, `routes-${i + 1}`, async () => {
        const workouts = await queryBenchmarkWorkouts()
        return routesIteration(workouts, true)
      })
    }
  },
)

export const memoryBenchmarks: readonly MemoryBenchmark[] = [
  seedBenchmark,
  fetchBenchmark,
  fetchDisposeBenchmark,
  routesBenchmark,
  routesDisposeBenchmark,
]
