import { Button, Host, List, VStack } from '@expo/ui/swift-ui'
import {
  queryWorkoutSamplesWithAnchor,
  saveWorkoutSample,
} from '@kingstinct/react-native-healthkit'
import {
  ComparisonPredicateOperator,
  WorkoutActivityType,
  type WorkoutSample,
} from '@kingstinct/react-native-healthkit/types/Workouts'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { QueryInfo } from '@/components/QueryInfo'
import { ListItem } from '@/components/SwiftListItem'
import { enumKeyLookup } from '@/utils/enumKeyLookup'

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType)

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<readonly WorkoutSample[]>([])
  const [queryTime, setQueryTime] = useState<number>()
  const [anchor, setAnchor] = useState<string>()
  const [deletedSamples, setDeletedSamples] = useState<readonly string[]>([])

  const queryWorkoutSamples = useCallback(async (anchor?: string) => {
    try {
      const startedAt = Date.now()
      const { workouts, deletedSamples, newAnchor } =
        await queryWorkoutSamplesWithAnchor({
          anchor,
          limit: 20,
          filter: {
            workoutActivityType: WorkoutActivityType.running,
            endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6), // 6 months
            duration: {
              durationInSeconds: 60,
              predicateOperator:
                ComparisonPredicateOperator.greaterThanOrEqualTo,
            },
          },
        })
      setQueryTime(Date.now() - startedAt)

      console.log(workouts[0])

      console.log(workouts[0]?.sourceRevision)
      setWorkouts(workouts.map((w) => w))
      setAnchor(newAnchor)
      setDeletedSamples(deletedSamples.map((d) => d.uuid))
    } catch (error) {
      console.error('Error querying workouts:', error)
    }
  }, [])

  useEffect(() => {
    queryWorkoutSamples()
  }, [queryWorkoutSamples])

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <QueryInfo
          queryTime={queryTime}
          anchor={anchor}
          deletedSamples={deletedSamples}
          onFetchMore={() => queryWorkoutSamples(anchor)}
        />

        <List scrollEnabled>
          <Button
            onPress={async () => {
              const workout = await saveWorkoutSample(
                WorkoutActivityType.americanFootball,
                [
                  {
                    endDate: new Date(),
                    startDate: new Date(Date.now() - 60 * 60 * 1000),
                    metadata: {
                      sdfdfg: 'dsfdfg',
                    },
                    quantity: 100,
                    quantityType:
                      'HKQuantityTypeIdentifierDistanceWalkingRunning',
                    unit: 'm',
                  },
                ],
                new Date(Date.now() - 60 * 60 * 1000),
                new Date(),
                {
                  distance: 1000,
                  energyBurned: 500,
                },
                {
                  something: 'dsfdfg',
                },
              )
              console.log('Created workout:', workout)
            }}
          >
            Create workout
          </Button>
          {workouts.map((item) => (
            <ListItem
              key={item.uuid}
              title={
                workoutActivityTypeStrings[item.workoutActivityType] ||
                'Unknown'
              }
              subtitle={item.startDate.toLocaleString()}
              onPress={() =>
                router.push(`/workouts/details?workoutId=${item.uuid}`)
              }
            />
          ))}
        </List>
      </VStack>
    </Host>
  )
}
