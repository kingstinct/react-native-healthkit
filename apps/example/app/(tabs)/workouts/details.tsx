import { ListItem } from '@/components/SwiftListItem'
import { enumKeyLookup } from '@/utils/enumKeyLookup'
import { List } from '@expo/ui/swift-ui'
import { Section } from '@expo/ui/swift-ui-primitives'
import { Workouts } from '@kingstinct/react-native-healthkit'
import type { WorkoutProxy } from '@kingstinct/react-native-healthkit/specs/WorkoutProxy.nitro'
import {
  WorkoutActivityType,
  WorkoutEventType,
  type WorkoutRoute,
} from '@kingstinct/react-native-healthkit/types/Workouts'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType)

const workoutEventTypeStrings = enumKeyLookup(WorkoutEventType)

export default function WorkoutDetails() {
  const { workoutId } = useLocalSearchParams<{ workoutId?: string }>()

  const [workout, setWorkout] = useState<WorkoutProxy | null>(null)

  const [routes, setRoutes] = useState<readonly WorkoutRoute[]>([])

  const [queryTime, setQueryTime] = useState<number>()
  const [routesQueryTime, setRoutesQueryTime] = useState<number>()

  useEffect(() => {
    if (!workoutId) {
      return
    }

    const startedAt = Date.now()

    Workouts.queryWorkoutSamples({ filter: { uuid: workoutId }, limit: 1 })
      .then((ws) => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const w = ws[0]!
        setWorkout(w)
        setQueryTime(Date.now() - startedAt)
        const routeStartedAt = Date.now()
        w?.getWorkoutRoutes()
          .then((r) => {
            setRoutes(r)
            setRoutesQueryTime(Date.now() - routeStartedAt)
          })
          .catch(console.error)
      })
      .catch(console.error)
  }, [workoutId])

  if (!workout) {
    return (
      <List>
        <ListItem title="Loading workout details..." />
      </List>
    )
  }

  return (
    <List scrollEnabled>
      {queryTime ? (
        <Section title="Query Information">
          <ListItem title="Query Time" subtitle={`${queryTime}ms`} />
          {routesQueryTime ? (
            <ListItem
              title="Routes Query Time"
              subtitle={`${routesQueryTime}ms`}
            />
          ) : null}
        </Section>
      ) : null}
      <Section>
        <ListItem
          title="Workout Type"
          subtitle={workoutActivityTypeStrings[workout.workoutActivityType]}
        />
        <ListItem
          title="Started"
          subtitle={workout.startDate.toLocaleString()}
        />
        <ListItem title="Ended" subtitle={workout.endDate.toLocaleString()} />
        <ListItem
          title="Duration"
          subtitle={`${Math.round((workout.endDate.valueOf() - workout.startDate.valueOf()) / 60 / 1000)} minutes`}
        />
        {workout.totalDistance ? (
          <ListItem
            title="Total Distance"
            subtitle={`${Math.round(workout.totalDistance.quantity)} ${workout.totalDistance.unit}`}
          />
        ) : null}
        {workout.totalEnergyBurned ? (
          <ListItem
            title="Total Energy Burned"
            subtitle={`${Math.round(workout.totalEnergyBurned.quantity)} ${workout.totalEnergyBurned.unit}`}
          />
        ) : null}
        {workout.totalFlightsClimbed ? (
          <ListItem
            title="Total Flights Climbed"
            subtitle={`${Math.round(workout.totalFlightsClimbed.quantity)} ${workout.totalFlightsClimbed.unit}`}
          />
        ) : null}
        {workout.totalSwimmingStrokeCount ? (
          <ListItem
            title="Total Swimming Stroke Count"
            subtitle={`${Math.round(workout.totalSwimmingStrokeCount.quantity)} ${workout.totalSwimmingStrokeCount.unit}`}
          />
        ) : null}
      </Section>
      {workout.device ? (
        <Section title="Device">
          {workout.device.name ? (
            <ListItem title="Name" subtitle={workout.device.name} />
          ) : null}
          {workout.device.model ? (
            <ListItem title="Model" subtitle={workout.device.model} />
          ) : null}
          {workout.device.manufacturer ? (
            <ListItem
              title="Manufacturer"
              subtitle={workout.device.manufacturer}
            />
          ) : null}
          {workout.device.hardwareVersion ? (
            <ListItem
              title="Hardware Version"
              subtitle={workout.device.hardwareVersion}
            />
          ) : null}
          {workout.device.softwareVersion ? (
            <ListItem
              title="Software Version"
              subtitle={workout.device.softwareVersion}
            />
          ) : null}
        </Section>
      ) : null}

      {workout.metadata && Object.keys(workout.metadata).length > 0 && (
        <Section title="Metadata">
          {Object.entries(workout.metadata).map(([key, value]) => (
            <ListItem
              key={key}
              title={key}
              subtitle={
                typeof value === 'string' ? value : JSON.stringify(value)
              }
            />
          ))}
        </Section>
      )}

      {workout.events && workout.events.length > 0 && (
        <Section title="Events">
          {workout.events.map((event, index) => (
            <ListItem
              key={event.startDate.toISOString() + index.toString()}
              title={`Event ${index + 1}`}
              subtitle={`Type: ${workoutEventTypeStrings[event.type]}, Timestamp: ${event.startDate.toLocaleString()}`}
            />
          ))}
        </Section>
      )}
      {workout.activities && workout.activities.length > 0 && (
        <Section title="Activities">
          {workout.activities.map((activity, index) => (
            <ListItem
              key={activity.uuid}
              title={`Activity ${index + 1}`}
              subtitle={`Duration: ${Math.round(activity.duration / 60)} minutes, Start: ${activity.startDate.toLocaleString()}`}
            />
          ))}
        </Section>
      )}
      {routes && routes.length > 0 && (
        <Section title="Routes">
          {routes.map((route, index) => (
            <ListItem
              key={index.toString()}
              title={`Route ${index + 1}`}
              subtitle={`Locations: ${Math.round(route.locations.length)}`}
            />
          ))}
        </Section>
      )}
    </List>
  )
}
