import { Host, List } from '@expo/ui/swift-ui'
import { queryWorkoutSamplesWithAnchor } from '@kingstinct/react-native-healthkit'
import {
  WorkoutActivityType,
  type WorkoutSample,
} from '@kingstinct/react-native-healthkit/types/Workouts'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
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
        await queryWorkoutSamplesWithAnchor({ anchor })
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
    <View style={{ flex: 1 }}>
      <QueryInfo
        queryTime={queryTime}
        anchor={anchor}
        deletedSamples={deletedSamples}
        onFetchMore={() => queryWorkoutSamples(anchor)}
      />
      <Host style={{ flex: 1 }}>
        <List scrollEnabled>
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
      </Host>
    </View>
  )
}
