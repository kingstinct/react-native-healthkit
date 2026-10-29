import {
  CategoryValueEnvironmentalAudioExposureEvent,
  CategoryValueMenstrualFlow,
  createWorkoutBuilder,
  deleteObjects,
  queryCategorySamples,
  queryQuantitySamples,
  queryWorkoutSamples,
  saveCategorySample,
  saveQuantitySample,
  saveWorkoutSample,
  WorkoutActivityType,
  WorkoutEventType,
} from '@kingstinct/react-native-healthkit'
import { BloodGlucoseMealTime } from '@kingstinct/react-native-healthkit/types/MetadataEnums'
import {
  assertCategorySampleContract,
  assertQuantitySampleContract,
  assertWorkoutSampleContract,
} from '@/contracts'
import { healthRecordsScenario } from '@/contracts/healthRecordsScenario'

export type ContractScenarioId =
  | 'quantity-roundtrip'
  | 'category-roundtrip'
  | 'environmental-audio-exposure-roundtrip'
  | 'workout-roundtrip'
  | 'workout-builder-pause-roundtrip'
  | 'workout-builder-activities-roundtrip'
  | 'workout-builder-errors'
  | 'workout-builder-call-order'
  | 'health-records-smoke'

export type {
  ContractScenario,
  ContractScenarioResult,
  ScenarioRunOptions,
} from './scenarioResult'
export { failure, success } from './scenarioResult'

import {
  type ContractScenario,
  type ContractScenarioResult,
  failure,
  success,
} from './scenarioResult'

async function cleanupSample(identifier: string, uuid: string) {
  try {
    await deleteObjects(identifier as never, {
      uuids: [uuid],
    })
  } catch (error) {
    console.warn(`Failed to delete sample ${identifier}/${uuid}:`, error)
  }
}

const quantityScenario: ContractScenario = {
  id: 'quantity-roundtrip',
  title: 'Quantity Round-trip',
  run: async () => {
    const start = new Date(Date.now() - 60_000)
    const end = new Date()

    try {
      const saved = await saveQuantitySample(
        'HKQuantityTypeIdentifierBloodGlucose',
        'mg/dL',
        94,
        start,
        end,
        {
          HKBloodGlucoseMealTime: BloodGlucoseMealTime.preprandial,
          HKWasUserEntered: true,
        },
      )

      if (!saved) {
        throw new Error('saveQuantitySample returned undefined')
      }

      assertQuantitySampleContract(
        'HKQuantityTypeIdentifierBloodGlucose',
        saved,
      )

      const queried = await queryQuantitySamples(
        'HKQuantityTypeIdentifierBloodGlucose',
        {
          limit: 1,
          unit: 'mg/dL',
          filter: {
            uuids: [saved.uuid],
          },
        },
      )

      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryQuantitySamples returned no matching sample')
      }

      assertQuantitySampleContract(
        'HKQuantityTypeIdentifierBloodGlucose',
        roundTripped,
      )

      if (
        roundTripped.metadata.HKBloodGlucoseMealTime !==
        BloodGlucoseMealTime.preprandial
      ) {
        throw new Error('Expected HKBloodGlucoseMealTime to survive round-trip')
      }

      await cleanupSample('HKQuantityTypeIdentifierBloodGlucose', saved.uuid)

      return success(
        quantityScenario.id,
        quantityScenario.title,
        roundTripped,
        ['saveQuantitySample', 'queryQuantitySamples'],
      )
    } catch (error) {
      return failure(quantityScenario.id, quantityScenario.title, error)
    }
  },
}

const categoryScenario: ContractScenario = {
  id: 'category-roundtrip',
  title: 'Category Round-trip',
  run: async () => {
    const start = new Date(Date.now() - 60_000)
    const end = new Date()

    try {
      const saved = await saveCategorySample(
        'HKCategoryTypeIdentifierMenstrualFlow',
        CategoryValueMenstrualFlow.light,
        start,
        end,
        {
          HKMenstrualCycleStart: true,
          HKWasUserEntered: true,
        },
      )

      if (!saved) {
        throw new Error('saveCategorySample returned undefined')
      }

      assertCategorySampleContract(
        'HKCategoryTypeIdentifierMenstrualFlow',
        saved,
      )

      const queried = await queryCategorySamples(
        'HKCategoryTypeIdentifierMenstrualFlow',
        {
          limit: 1,
          filter: {
            uuids: [saved.uuid],
          },
        },
      )

      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryCategorySamples returned no matching sample')
      }

      assertCategorySampleContract(
        'HKCategoryTypeIdentifierMenstrualFlow',
        roundTripped,
      )

      if (roundTripped.metadata.HKMenstrualCycleStart !== true) {
        throw new Error('Expected HKMenstrualCycleStart to survive round-trip')
      }

      await cleanupSample('HKCategoryTypeIdentifierMenstrualFlow', saved.uuid)

      return success(
        categoryScenario.id,
        categoryScenario.title,
        roundTripped,
        ['saveCategorySample', 'queryCategorySamples'],
      )
    } catch (error) {
      return failure(categoryScenario.id, categoryScenario.title, error)
    }
  },
}

// Regression for kingstinct/react-native-healthkit#379: Apple's
// HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent constant carries the legacy
// raw string HKCategoryTypeIdentifierAudioExposureEvent at runtime, so this identifier
// must be translated on the native side in both directions.
const environmentalAudioExposureScenario: ContractScenario = {
  id: 'environmental-audio-exposure-roundtrip',
  title: 'Environmental Audio Exposure Event Round-trip',
  run: async () => {
    const identifier = 'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent'
    const start = new Date(Date.now() - 60_000)
    const end = new Date()

    try {
      const saved = await saveCategorySample(
        identifier,
        CategoryValueEnvironmentalAudioExposureEvent.momentaryLimit,
        start,
        end,
        {
          HKWasUserEntered: true,
        },
      )

      if (!saved) {
        throw new Error('saveCategorySample returned undefined')
      }

      assertCategorySampleContract(identifier, saved)

      const queried = await queryCategorySamples(identifier, {
        limit: 1,
        filter: {
          uuids: [saved.uuid],
        },
      })

      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryCategorySamples returned no matching sample')
      }

      assertCategorySampleContract(identifier, roundTripped)

      if (roundTripped.categoryType !== identifier) {
        throw new Error(
          `Expected categoryType ${identifier}, got ${roundTripped.categoryType}`,
        )
      }

      if (roundTripped.sampleType.identifier !== identifier) {
        throw new Error(
          `Expected sampleType.identifier ${identifier}, got ${roundTripped.sampleType.identifier}`,
        )
      }

      await cleanupSample(identifier, saved.uuid)

      return success(
        environmentalAudioExposureScenario.id,
        environmentalAudioExposureScenario.title,
        roundTripped,
        ['saveCategorySample', 'queryCategorySamples'],
      )
    } catch (error) {
      return failure(
        environmentalAudioExposureScenario.id,
        environmentalAudioExposureScenario.title,
        error,
      )
    }
  },
}

const workoutScenario: ContractScenario = {
  id: 'workout-roundtrip',
  title: 'Workout Round-trip',
  run: async () => {
    const start = new Date(Date.now() - 30 * 60_000)
    const end = new Date()

    try {
      const saved = await saveWorkoutSample(
        WorkoutActivityType.running,
        [
          {
            quantityType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
            quantity: 1250,
            unit: 'm',
            startDate: start,
            endDate: end,
            metadata: {},
          },
        ],
        start,
        end,
        {
          distance: 1250,
        },
        {
          HKWorkoutBrandName: 'contract-harness',
          HKIndoorWorkout: true,
        },
      )

      const savedJson = saved.toJSON()
      assertWorkoutSampleContract(savedJson)

      const queried = await queryWorkoutSamples({
        limit: 1,
        filter: {
          uuids: [saved.uuid],
        },
      })

      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryWorkoutSamples returned no matching workout')
      }

      const roundTrippedJson = roundTripped.toJSON()
      assertWorkoutSampleContract(roundTrippedJson)

      if (roundTrippedJson.metadata.HKWorkoutBrandName !== 'contract-harness') {
        throw new Error('Expected HKWorkoutBrandName to survive round-trip')
      }

      await cleanupSample('HKWorkoutTypeIdentifier', saved.uuid)

      return success(
        workoutScenario.id,
        workoutScenario.title,
        roundTrippedJson,
        ['saveWorkoutSample', 'queryWorkoutSamples'],
      )
    } catch (error) {
      return failure(workoutScenario.id, workoutScenario.title, error)
    }
  },
}

const workoutBuilderPauseScenario: ContractScenario = {
  id: 'workout-builder-pause-roundtrip',
  title: 'Workout Builder Pause Round-trip',
  run: async () => {
    const minute = 60_000
    const start = new Date(Date.now() - 30 * minute)
    const pausedAt = new Date(start.getTime() + 10 * minute)
    const resumedAt = new Date(start.getTime() + 20 * minute)
    const end = new Date(start.getTime() + 30 * minute)

    try {
      const builder = createWorkoutBuilder({
        activityType: WorkoutActivityType.walking,
      })
      await builder.beginCollection(start)
      await builder.add([
        {
          quantityType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
          quantity: 1500,
          unit: 'm',
          startDate: start,
          endDate: end,
        },
        {
          quantityType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
          quantity: 120,
          unit: 'kcal',
          startDate: start,
          endDate: end,
        },
      ])
      await builder.addWorkoutEvents([
        {
          type: WorkoutEventType.pause,
          startDate: pausedAt,
          endDate: pausedAt,
        },
        {
          type: WorkoutEventType.resume,
          startDate: resumedAt,
          endDate: resumedAt,
        },
      ])
      await builder.addMetadata({ HKWorkoutBrandName: 'contract-harness' })
      await builder.endCollection(end)

      const elapsedSeconds = builder.elapsedTime(end)
      if (Math.abs(elapsedSeconds - 20 * 60) > 1) {
        throw new Error(
          `Expected builder elapsedTime of 1200s, got ${elapsedSeconds}`,
        )
      }

      const saved = await builder.finishWorkout()
      if (!saved) {
        throw new Error('finishWorkout returned undefined')
      }

      const queried = await queryWorkoutSamples({
        limit: 1,
        filter: { uuids: [saved.uuid] },
      })
      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryWorkoutSamples returned no matching workout')
      }

      const json = roundTripped.toJSON()
      assertWorkoutSampleContract(json)

      if (Math.abs(json.duration.quantity - 20 * 60) > 1) {
        throw new Error(
          `Expected duration of 1200s excluding the pause, got ${json.duration.quantity}`,
        )
      }
      const eventTypes = (json.events ?? []).map((event) => event.type)
      if (
        !eventTypes.includes(WorkoutEventType.pause) ||
        !eventTypes.includes(WorkoutEventType.resume)
      ) {
        throw new Error(
          `Expected pause and resume events, got ${JSON.stringify(eventTypes)}`,
        )
      }
      if (json.metadata.HKWorkoutBrandName !== 'contract-harness') {
        throw new Error('Expected HKWorkoutBrandName to survive round-trip')
      }

      const statistics = await roundTripped.getAllStatistics()

      await cleanupSample('HKWorkoutTypeIdentifier', saved.uuid)

      return success(
        workoutBuilderPauseScenario.id,
        workoutBuilderPauseScenario.title,
        json,
        [
          'createWorkoutBuilder',
          'addWorkoutEvents',
          'finishWorkout',
          `totalDistance=${json.totalDistance?.quantity}`,
          `totalEnergyBurned=${json.totalEnergyBurned?.quantity}`,
          `statistics=${JSON.stringify(statistics)}`,
        ],
      )
    } catch (error) {
      return failure(
        workoutBuilderPauseScenario.id,
        workoutBuilderPauseScenario.title,
        error,
      )
    }
  },
}

const workoutBuilderActivitiesScenario: ContractScenario = {
  id: 'workout-builder-activities-roundtrip',
  title: 'Workout Builder Activities Round-trip',
  run: async () => {
    const minute = 60_000
    const start = new Date(Date.now() - 40 * minute)
    const transitionAt = new Date(start.getTime() + 25 * minute)
    const end = new Date(start.getTime() + 40 * minute)

    try {
      const builder = createWorkoutBuilder({
        activityType: WorkoutActivityType.swimBikeRun,
      })
      await builder.beginCollection(start)
      await builder.addWorkoutActivity({
        workoutConfiguration: { activityType: WorkoutActivityType.cycling },
        startDate: start,
        endDate: transitionAt,
      })
      const runUuid = await builder.addWorkoutActivity({
        workoutConfiguration: { activityType: WorkoutActivityType.running },
        startDate: transitionAt,
      })
      const openRun = builder.workoutActivities.find((a) => a.uuid === runUuid)
      if (openRun === undefined || openRun.endDate !== undefined) {
        throw new Error(
          `Expected the running activity to be open before updateActivityEndDate, got ${JSON.stringify(openRun)}`,
        )
      }
      await builder.updateActivityEndDate(runUuid, end)
      await builder.endCollection(end)

      const saved = await builder.finishWorkout()
      if (!saved) {
        throw new Error('finishWorkout returned undefined')
      }

      const queried = await queryWorkoutSamples({
        limit: 1,
        filter: { uuids: [saved.uuid] },
      })
      const roundTripped = queried[0]
      if (!roundTripped) {
        throw new Error('queryWorkoutSamples returned no matching workout')
      }

      const json = roundTripped.toJSON()
      assertWorkoutSampleContract(json)

      const activities = json.activities ?? []
      const activityTypes = activities.map((a) => a.activityType)
      if (
        activityTypes.length !== 2 ||
        activityTypes[0] !== WorkoutActivityType.cycling ||
        activityTypes[1] !== WorkoutActivityType.running
      ) {
        throw new Error(
          `Expected cycling then running activities, got ${JSON.stringify(activityTypes)}`,
        )
      }
      const run = activities.find((a) => a.uuid === runUuid)
      if (run?.endDate.getTime() !== end.getTime()) {
        throw new Error(
          `Expected the running activity to end at ${end.toISOString()}, got ${run?.endDate.toISOString()}`,
        )
      }

      await cleanupSample('HKWorkoutTypeIdentifier', saved.uuid)

      return success(
        workoutBuilderActivitiesScenario.id,
        workoutBuilderActivitiesScenario.title,
        json,
        ['addWorkoutActivity', 'updateActivityEndDate', 'finishWorkout'],
      )
    } catch (error) {
      return failure(
        workoutBuilderActivitiesScenario.id,
        workoutBuilderActivitiesScenario.title,
        error,
      )
    }
  },
}

async function expectRejection(label: string, run: () => Promise<unknown>) {
  try {
    await run()
  } catch (error) {
    return `${label}: ${String(error)}`
  }
  throw new Error(`Expected ${label} to reject`)
}

const workoutBuilderErrorsScenario: ContractScenario = {
  id: 'workout-builder-errors',
  title: 'Workout Builder Errors',
  run: async () => {
    const minute = 60_000
    const start = new Date(Date.now() - 30 * minute)
    const end = new Date(start.getTime() + 30 * minute)

    try {
      const details: string[] = []
      const builder = createWorkoutBuilder({
        activityType: WorkoutActivityType.walking,
      })
      await builder.beginCollection(start)

      details.push(
        await expectRejection('pause event with a duration', () =>
          builder.addWorkoutEvents([
            {
              type: WorkoutEventType.pause,
              startDate: new Date(start.getTime() + 5 * minute),
              endDate: new Date(start.getTime() + 6 * minute),
            },
          ]),
        ),
      )
      details.push(
        await expectRejection('unknown activity UUID', () =>
          builder.updateActivityEndDate(
            '00000000-0000-0000-0000-000000000000',
            end,
          ),
        ),
      )

      await builder.endCollection(end)
      const saved = await builder.finishWorkout()

      details.push(
        await expectRejection('add after finishWorkout', () =>
          builder.add([
            {
              quantityType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
              quantity: 100,
              unit: 'm',
              startDate: start,
              endDate: end,
            },
          ]),
        ),
      )

      if (saved) {
        await cleanupSample('HKWorkoutTypeIdentifier', saved.uuid)
      }

      return success(
        workoutBuilderErrorsScenario.id,
        workoutBuilderErrorsScenario.title,
        null,
        details,
      )
    } catch (error) {
      return failure(
        workoutBuilderErrorsScenario.id,
        workoutBuilderErrorsScenario.title,
        error,
      )
    }
  },
}

const workoutBuilderCallOrderScenario: ContractScenario = {
  id: 'workout-builder-call-order',
  title: 'Workout Builder Call Order',
  run: async () => {
    const minute = 60_000
    const start = new Date(Date.now() - 30 * minute)
    const pausedAt = new Date(start.getTime() + 5 * minute)
    const resumedAt = new Date(start.getTime() + 10 * minute)
    const end = new Date(start.getTime() + 30 * minute)

    try {
      const details: string[] = []
      const builder = createWorkoutBuilder({
        activityType: WorkoutActivityType.walking,
      })
      const pending = [
        builder.beginCollection(start),
        builder.addWorkoutEvents([
          {
            type: WorkoutEventType.pause,
            startDate: pausedAt,
            endDate: pausedAt,
          },
        ]),
        builder.addWorkoutEvents([
          {
            type: WorkoutEventType.resume,
            startDate: resumedAt,
            endDate: resumedAt,
          },
        ]),
        builder.endCollection(end),
      ]
      const finishing = builder.finishWorkout()
      await Promise.all(pending)
      const saved = await finishing
      if (!saved) {
        throw new Error('finishWorkout returned undefined')
      }
      await cleanupSample('HKWorkoutTypeIdentifier', saved.uuid)
      if (Math.abs(saved.duration.quantity - 25 * 60) > 1) {
        throw new Error(
          `Expected duration of 1500s from un-awaited calls, got ${saved.duration.quantity}`,
        )
      }
      details.push('un-awaited calls ran in call order')

      builder.discardWorkout()
      details.push(
        await expectRejection(
          'add after finishWorkout and discardWorkout',
          () =>
            builder.add([
              {
                quantityType: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
                quantity: 100,
                unit: 'm',
                startDate: start,
                endDate: end,
              },
            ]),
        ),
      )

      const discarded = createWorkoutBuilder({
        activityType: WorkoutActivityType.walking,
      })
      await discarded.beginCollection(start)
      discarded.discardWorkout()
      details.push(
        await expectRejection('endCollection after discardWorkout', () =>
          discarded.endCollection(end),
        ),
      )

      return success(
        workoutBuilderCallOrderScenario.id,
        workoutBuilderCallOrderScenario.title,
        null,
        details,
      )
    } catch (error) {
      return failure(
        workoutBuilderCallOrderScenario.id,
        workoutBuilderCallOrderScenario.title,
        error,
      )
    }
  },
}

export const contractScenarios: readonly ContractScenario[] = [
  quantityScenario,
  categoryScenario,
  environmentalAudioExposureScenario,
  workoutScenario,
  workoutBuilderPauseScenario,
  workoutBuilderActivitiesScenario,
  workoutBuilderErrorsScenario,
  workoutBuilderCallOrderScenario,
  healthRecordsScenario,
]

export async function runAllContractScenarios() {
  const results: ContractScenarioResult[] = []

  for (const scenario of contractScenarios) {
    results.push(await scenario.run())
  }

  return results
}
