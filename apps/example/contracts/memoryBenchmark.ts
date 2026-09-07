import {
  ComparisonPredicateOperator,
  queryQuantitySamples,
  queryWorkoutSamples,
  saveQuantitySample,
  saveWorkoutSample,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit'
import type { WorkoutProxyTyped } from '@kingstinct/react-native-healthkit/types/Workouts'
import {
  type ContractScenario,
  failure,
  type ScenarioRunOptions,
  success,
} from './scenarios'

/**
 * Memory benchmarks that mirror the access patterns reported in
 * https://github.com/kingstinct/react-native-healthkit/issues/274 and
 * https://github.com/kingstinct/react-native-healthkit/issues/370.
 *
 * They are deliberately kept out of `runAllContractScenarios` so CI never runs
 * them; launch one with `bun run benchmark:memory <scenario-id>` instead. The
 * scenario itself only records wall-clock phases; the host-side runner samples
 * the process' physical footprint while the phases run and correlates the two.
 */

export const BENCHMARK_BRAND = 'memory-benchmark'
const WORKOUT_COUNT = 200
const HEART_RATE_PER_WORKOUT = 50
const ROUTE_WORKOUTS = 20
const ROUTE_POINTS = 300
const DEFAULT_ITERATIONS = 40
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

export interface BenchmarkPayload {
  readonly config: Record<string, number>
  readonly phases: readonly BenchmarkPhase[]
}

export type MemoryBenchmark = ContractScenario<MemoryBenchmarkId>

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

function queryBenchmarkWorkouts() {
  return queryWorkoutSamples({
    filter: {
      date: benchmarkRange(),
      metadata: {
        withMetadataKey: 'HKWorkoutBrandName',
        operatorType: ComparisonPredicateOperator.equalTo,
        value: BENCHMARK_BRAND,
      },
    },
    limit: 0,
  })
}

async function queryHeartRateCount(workout: WorkoutProxyTyped) {
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
  return samples.length
}

async function seedHeartRate(workout: WorkoutProxyTyped, count: number) {
  const start = workout.startDate.getTime()
  const saves: Promise<unknown>[] = []
  for (let j = 0; j < count; j++) {
    const at = new Date(
      start + (j * WORKOUT_DURATION_MS) / HEART_RATE_PER_WORKOUT,
    )
    saves.push(
      saveQuantitySample(
        'HKQuantityTypeIdentifierHeartRate',
        'count/min',
        120 + (j % 40),
        at,
        at,
      ),
    )
  }
  await Promise.all(saves)
}

async function seedWorkouts() {
  const existing = await queryBenchmarkWorkouts()
  let createdWorkouts = 0
  let createdHeartRate = 0

  // Top up heart-rate samples for workouts left behind by an interrupted seed.
  for (const workout of existing) {
    const missing =
      HEART_RATE_PER_WORKOUT - (await queryHeartRateCount(workout))
    if (missing > 0) {
      await seedHeartRate(workout, missing)
      createdHeartRate += missing
    }
  }

  for (let i = existing.length; i < WORKOUT_COUNT; i++) {
    // Spread workouts out over the last two years, one every ~3 days.
    const start = new Date(
      Date.now() - (i + 1) * 3 * 24 * 60 * 60_000 - (i % 7) * 60 * 60_000,
    )
    const end = new Date(start.getTime() + WORKOUT_DURATION_MS)

    const workout = await saveWorkoutSample(
      WorkoutActivityType.running,
      [],
      start,
      end,
      { distance: 5000, energyBurned: 400 },
      { HKWorkoutBrandName: BENCHMARK_BRAND, HKIndoorWorkout: i % 2 === 0 },
    )
    await seedHeartRate(workout, HEART_RATE_PER_WORKOUT)
    createdWorkouts++
    createdHeartRate += HEART_RATE_PER_WORKOUT
  }

  return {
    existingWorkouts: existing.length,
    createdWorkouts,
    createdHeartRate,
  }
}

async function seedRoutes() {
  const workouts = await queryBenchmarkWorkouts()
  const candidates = workouts.slice(0, ROUTE_WORKOUTS)
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
 * samples inside each one (all in flight at once, as the report did), keeping
 * only plain data.
 */
async function fetchIteration(dispose: boolean) {
  const workouts = await queryBenchmarkWorkouts()
  const counts = await Promise.all(
    workouts.map(async (workout) => {
      const count = await queryHeartRateCount(workout)
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
 * The access pattern from #370: fetch the routes of every workout, one after
 * the other.
 */
async function routesIteration(dispose: boolean) {
  const workouts = await queryBenchmarkWorkouts()
  let routes = 0
  let locations = 0
  for (const workout of workouts) {
    const workoutRoutes = await workout.getWorkoutRoutes()
    routes += workoutRoutes.length
    for (const route of workoutRoutes) {
      locations += route.locations.length
    }
    if (dispose) {
      workout.dispose()
    }
  }
  return { workouts: workouts.length, routes, locations }
}

interface BenchmarkDefinition {
  readonly id: MemoryBenchmarkId
  readonly title: string
  /** Called once per iteration; `memory-seed` runs its phases directly instead. */
  readonly iteration?: (index: number) => Promise<Record<string, number>>
  readonly phasePrefix?: string
  readonly body?: (phases: BenchmarkPhase[]) => Promise<void>
}

function makeBenchmark(definition: BenchmarkDefinition): MemoryBenchmark {
  const { id, title } = definition
  return {
    id,
    title,
    run: async (options?: ScenarioRunOptions) => {
      const iterations =
        options?.iterations && options.iterations > 0
          ? Math.floor(options.iterations)
          : DEFAULT_ITERATIONS
      const config = {
        WORKOUT_COUNT,
        HEART_RATE_PER_WORKOUT,
        ROUTE_WORKOUTS,
        ROUTE_POINTS,
        ITERATIONS: iterations,
        SETTLE_MS,
      }
      const phases: BenchmarkPhase[] = []
      const payload = (): BenchmarkPayload => ({ config, phases })

      try {
        await measure(phases, 'idle', async () => {
          await sleep(5_000)
          return undefined
        })
        if (definition.body) {
          await definition.body(phases)
        } else if (definition.iteration) {
          for (let i = 0; i < iterations; i++) {
            await measure(
              phases,
              `${definition.phasePrefix}-${i + 1}`,
              () => definition.iteration?.(i) ?? Promise.resolve(undefined),
            )
          }
        }
        await measure(phases, 'settle', async () => {
          await sleep(SETTLE_MS)
          return undefined
        })
        return success(
          id,
          title,
          payload(),
          phases.map(
            (phase) =>
              `${phase.name}: ${phase.endedAt - phase.startedAt}ms ${JSON.stringify(phase.details ?? {})}`,
          ),
        )
      } catch (error) {
        return failure(id, title, error, payload())
      }
    },
  }
}

export const memoryBenchmarks: readonly MemoryBenchmark[] = [
  makeBenchmark({
    id: 'memory-seed',
    title: 'Seed benchmark data',
    body: async (phases) => {
      await measure(phases, 'seed-workouts', seedWorkouts)
      await measure(phases, 'seed-routes', seedRoutes)
    },
  }),
  makeBenchmark({
    id: 'memory-fetch',
    title: 'Fetch workouts + heart rate (#274)',
    phasePrefix: 'fetch',
    iteration: () => fetchIteration(false),
  }),
  makeBenchmark({
    id: 'memory-fetch-dispose',
    title: 'Fetch workouts + heart rate, dispose() proxies (#274)',
    phasePrefix: 'fetch',
    iteration: () => fetchIteration(true),
  }),
  makeBenchmark({
    id: 'memory-routes',
    title: 'Fetch workouts + routes repeatedly (#370)',
    phasePrefix: 'routes',
    iteration: () => routesIteration(false),
  }),
  makeBenchmark({
    id: 'memory-routes-dispose',
    title: 'Fetch workouts + routes repeatedly, dispose() proxies (#370)',
    phasePrefix: 'routes',
    iteration: () => routesIteration(true),
  }),
]
