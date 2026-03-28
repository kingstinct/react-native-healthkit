import {
  CategoryValueMenstrualFlow,
  deleteObjects,
  queryCategorySamples,
  queryQuantitySamples,
  queryWorkoutSamples,
  saveCategorySample,
  saveQuantitySample,
  saveWorkoutSample,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit'
import { BloodGlucoseMealTime } from '@kingstinct/react-native-healthkit/types/MetadataEnums'
import {
  assertCategorySampleContract,
  assertQuantitySampleContract,
  assertWorkoutSampleContract,
} from '@/contracts'

export type ContractScenarioId =
  | 'quantity-roundtrip'
  | 'category-roundtrip'
  | 'workout-roundtrip'

export interface ContractScenarioResult {
  readonly id: ContractScenarioId
  readonly title: string
  readonly ok: boolean
  readonly details: readonly string[]
  readonly payload?: unknown
}

export interface ContractScenario {
  readonly id: ContractScenarioId
  readonly title: string
  readonly run: () => Promise<ContractScenarioResult>
}

function success(
  id: ContractScenarioId,
  title: string,
  payload: unknown,
  details: string[] = [],
): ContractScenarioResult {
  return {
    id,
    title,
    ok: true,
    details,
    payload,
  }
}

function failure(
  id: ContractScenarioId,
  title: string,
  error: unknown,
): ContractScenarioResult {
  return {
    id,
    title,
    ok: false,
    details: [error instanceof Error ? error.message : String(error)],
  }
}

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

export const contractScenarios: readonly ContractScenario[] = [
  quantityScenario,
  categoryScenario,
  workoutScenario,
]

export async function runAllContractScenarios() {
  const results: ContractScenarioResult[] = []

  for (const scenario of contractScenarios) {
    results.push(await scenario.run())
  }

  return results
}
