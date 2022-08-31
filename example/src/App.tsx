import { HKStatisticsOptions, HKQuantityTypeIdentifier } from '@kingstinct/react-native-healthkit'
import useHealthkitAuthorization from '@kingstinct/react-native-healthkit/hooks/useHealthkitAuthorization'
import useMostRecentQuantitySample from '@kingstinct/react-native-healthkit/hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from '@kingstinct/react-native-healthkit/hooks/useMostRecentWorkout'
import useStatisticsForQuantity from '@kingstinct/react-native-healthkit/hooks/useStatisticsForQuantity'
import queryStatisticsForQuantity from '@kingstinct/react-native-healthkit/utils/queryStatisticsForQuantity'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { View } from 'react-native'
import { Button, List } from 'react-native-paper'

import type { HKUnit } from '@kingstinct/react-native-healthkit'
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

dayjs.extend(relativeTime)

const LatestListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier,
  readonly unit: HKUnit
  readonly icon: IconSource
  readonly title: string
}> = ({
  identifier, unit, title, icon,
}) => {
  const latestValue = useMostRecentQuantitySample(identifier, unit)
  return (
    <List.Item
      title={title || identifier}
      left={(props) => <List.Icon {...props} icon={icon || 'heart'} />}
      description={latestValue
        ? `${latestValue.quantity} ${latestValue.unit} (${dayjs(latestValue.endDate).fromNow()})`
        : undefined}
    />
  )
}

const LatestWorkout: React.FC<{
  readonly icon: IconSource
  readonly title: string
}> = ({
  title, icon,
}) => {
  const latestValue = useMostRecentWorkout()
  return (
    <List.Item
      title={title}
      left={(props) => <List.Icon {...props} icon={icon || 'heart'} />}
      description={latestValue
        ? `${latestValue.workoutActivityType} - ${latestValue.duration} (${dayjs(latestValue.endDate).fromNow()})`
        : undefined}
    />
  )
}

const TodayListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier,
  readonly unit: HKUnit,
  readonly option: HKStatisticsOptions
}> = ({ identifier, option, unit }) => {
  const latestValue = useStatisticsForQuantity(identifier, [option], dayjs().startOf('day').toDate(), undefined, unit)
  return (
    <List.Item
      title={identifier}
      left={(props) => <List.Icon {...props} icon='walk' />}
      description={latestValue
        ? `${latestValue.sumQuantity?.quantity} (${latestValue.sumQuantity?.unit})`
        : undefined}
    />
  )
}

const App = () => {
  const [status, request] = useHealthkitAuthorization([
    HKQuantityTypeIdentifier.activeEnergyBurned,
    HKQuantityTypeIdentifier.basalEnergyBurned,
    HKQuantityTypeIdentifier.restingHeartRate,
    'HKWorkoutTypeIdentifier',
    'HKWorkoutRouteTypeIdentifier',
    'HKQuantityTypeIdentifierStepCount',
    HKQuantityTypeIdentifier.distanceCycling,
    HKQuantityTypeIdentifier.distanceSwimming,
    HKQuantityTypeIdentifier.distanceWalkingRunning,
    HKQuantityTypeIdentifier.heartRate,
  ], [HKQuantityTypeIdentifier.heartRate])

  return (
    <View style={{ marginTop: 100, flex: 1, width: '100%' }}>
      <Button onPress={request}>Authorize</Button>
      <LatestWorkout icon='run' title='Latest workout' />
      <LatestListItem icon='fire' title='Active Energy Burnt' identifier={HKQuantityTypeIdentifier.activeEnergyBurned} unit='kcal' />
      <LatestListItem
        icon='heart'
        title='Heart rate'
        identifier={HKQuantityTypeIdentifier.heartRate}
        unit='count/min'
      />
      <TodayListItem
        identifier={HKQuantityTypeIdentifier.stepCount}
        option={HKStatisticsOptions.cumulativeSum}
        unit='count'
      />
      <TodayListItem
        identifier={HKQuantityTypeIdentifier.activeEnergyBurned}
        option={HKStatisticsOptions.cumulativeSum}
        unit='kcal'
      />
      <TodayListItem
        identifier={HKQuantityTypeIdentifier.restingHeartRate}
        option={HKStatisticsOptions.discreteAverage}
        unit='count/min'
      />
    </View>
  )
}

export default App
