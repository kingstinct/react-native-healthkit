/* eslint-disable import/no-unresolved */
import { HKStatisticsOptions, HKQuantityTypeIdentifier, HKAuthorizationRequestStatus } from '@kingstinct/react-native-healthkit'
import useHealthkitAuthorization from '@kingstinct/react-native-healthkit/hooks/useHealthkitAuthorization'
import useMostRecentQuantitySample from '@kingstinct/react-native-healthkit/hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from '@kingstinct/react-native-healthkit/hooks/useMostRecentWorkout'
import useStatisticsForQuantity from '@kingstinct/react-native-healthkit/hooks/useStatisticsForQuantity'
import saveQuantitySample from '@kingstinct/react-native-healthkit/utils/saveQuantitySample'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useCallback, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  Button, List, Menu, TextInput, Provider,
} from 'react-native-paper'

import type { HKUnit, HealthkitReadAuthorization } from '@kingstinct/react-native-healthkit'
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

dayjs.extend(relativeTime)

const LatestListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier,
  readonly unit?: HKUnit
  readonly icon: IconSource
  readonly title: string
}> = ({
  identifier, unit, title, icon,
}) => {
  const latestValue = useMostRecentQuantitySample(identifier, unit)
  return latestValue ? (
    <List.Item
      title={title || identifier}
      left={(props) => <List.Icon {...props} icon={icon} />}
      description={latestValue
        ? `${latestValue.unit === '%' ? (latestValue.quantity * 100).toFixed(1) : latestValue.quantity.toFixed(latestValue.unit === 'count' || latestValue.unit === 'count/min' ? 0 : 2)} ${latestValue.unit} (${dayjs(latestValue.endDate).fromNow()})`
        : undefined}
    />
  ) : null
}

// const LatestWorkout: React.FC<{
//   readonly icon: IconSource
//   readonly title: string
// }> = ({
//   title, icon,
// }) => {
//   const latestValue = useMostRecentWorkout()

//   return latestValue ? (
//     <List.Item
//       title={title}
//       left={(props) => <List.Icon {...props} icon={icon} />}
//       description={latestValue
//         ? `${latestValue.workoutActivityType} - ${latestValue.duration} (${dayjs(latestValue.endDate).fromNow()})`
//         : undefined}
//     />
//   ) : null
// }

const TodayListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier,
  readonly unit: HKUnit,
  readonly title: string,
  readonly icon: IconSource
  readonly option: HKStatisticsOptions
}> = ({
  identifier, option, unit, title, icon,
}) => {
  const latestValue = useStatisticsForQuantity(identifier, [option], dayjs().startOf('day').toDate(), undefined, unit)

  return latestValue?.sumQuantity ? (
    <List.Item
      title={title}
      left={(props) => <List.Icon {...props} icon={icon} />}
      description={latestValue
        ? `${latestValue.sumQuantity?.unit === 'count'
          ? latestValue.sumQuantity?.quantity
          : latestValue.sumQuantity?.quantity.toFixed(2)
        } (${latestValue.sumQuantity?.unit})`
        : undefined}
    />
  ) : null
}

const latestEntriesIfFound = [
  {
    icon: 'battery-heart-variant' as const,
    title: 'Resting Heart Rate',
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
  },
  {
    icon: 'lungs' as const,
    title: 'Respiratory Rate',
    identifier: HKQuantityTypeIdentifier.respiratoryRate,
  },
  {
    icon: 'account-heart' as const,
    title: 'Walking Heart Rate Average',
    identifier: HKQuantityTypeIdentifier.walkingHeartRateAverage,
  },
  {
    icon: 'needle' as const,
    title: 'Blood Glucose',
    identifier: HKQuantityTypeIdentifier.bloodGlucose,
  },
  {
    icon: 'heart-pulse',
    title: 'Heart rate',
    identifier: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
  },
  {
    icon: 'water-percent',
    title: 'Oxygen saturation',
    identifier: HKQuantityTypeIdentifier.oxygenSaturation,
    unit: '%',
  },
  {
    icon: 'percent',
    title: 'Body Fat',
    identifier: HKQuantityTypeIdentifier.bodyFatPercentage,
    unit: '%',
  },
]

const todayEntriesIfFound = [
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    option: HKStatisticsOptions.discreteAverage,
    icon: 'heart',
    title: 'Resting Heart Rate',
    unit: 'count/min' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.stepCount,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'walk',
    title: 'Steps',
    unit: 'count' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.activeEnergyBurned,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'fire',
    title: 'Active Energy Burned',
    unit: 'kcal' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    option: HKStatisticsOptions.discreteAverage,
    icon: 'heart',
    title: 'Resting Heart Rate',
    unit: 'count/min' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.distanceWalkingRunning,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'walk',
    title: 'Distance Walking/Running',
    unit: 'km' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.flightsClimbed,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'stairs',
    title: 'Flights Climbed',
    unit: 'km' as const,
  },
]

const saveableCountTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.pushCount,
]

const saveableMassTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.dietaryFatTotal,
  HKQuantityTypeIdentifier.dietaryCarbohydrates,
  HKQuantityTypeIdentifier.dietaryProtein,
]

const readPermissions: readonly HealthkitReadAuthorization[] = [
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.basalEnergyBurned,
  HKQuantityTypeIdentifier.restingHeartRate,
  'HKCharacteristicTypeIdentifierActivityMoveMode',
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  'HKQuantityTypeIdentifierStepCount',
  'HKWorkoutTypeIdentifier',
  HKQuantityTypeIdentifier.distanceCycling,
  HKQuantityTypeIdentifier.distanceSwimming,
  HKQuantityTypeIdentifier.distanceWalkingRunning,
  HKQuantityTypeIdentifier.oxygenSaturation,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.swimmingStrokeCount,
  HKQuantityTypeIdentifier.bodyFatPercentage,
  ...latestEntriesIfFound.map((entry) => entry.identifier),
  ...todayEntriesIfFound.map((entry) => entry.identifier),
  ...saveableMassTypes,
  ...saveableCountTypes,
]

const App = () => {
  const [status, request] = useHealthkitAuthorization(readPermissions, [...saveableCountTypes, ...saveableMassTypes])

  const [typeToSave, setTypeToSave] = useState<HKQuantityTypeIdentifier>(HKQuantityTypeIdentifier.stepCount)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [saveValueStr, setSaveValueStr] = useState<string>('0')

  const save = useCallback(() => {
    const val = parseFloat(saveValueStr)
    if (saveValueStr !== undefined && !Number.isNaN(val)) {
      const unit = saveableMassTypes.includes(typeToSave) ? 'mg' : 'count'
      void saveQuantitySample(typeToSave, unit, val)
      setSaveValueStr('0')
    }
  }, [saveValueStr, typeToSave])

  return status !== HKAuthorizationRequestStatus.unnecessary ? <View style={{ paddingTop: 100 }}><Button onPress={request}>Authorize</Button></View> : (
    <Provider>
      <ScrollView style={{ marginTop: 100, flex: 1, width: '100%' }}>
        {/* <LatestWorkout icon='run' title='Latest workout' /> */}
        <List.AccordionGroup>
          <List.Accordion title='Latest values' id='1'>
            {
              latestEntriesIfFound.map((e) => (
                <LatestListItem
                  key={e.identifier}
                  icon={e.icon}
                  title={e.title}
                  identifier={e.identifier}
                />
              ))
            }
          </List.Accordion>

          <List.Accordion title='Today stats' id='2'>
            {
              todayEntriesIfFound.map((e) => (
                <TodayListItem
                  key={e.identifier}
                  icon={e.icon}
                  title={e.title}
                  identifier={e.identifier}
                  option={e.option}
                  unit={e.unit}
                />
              ))
            }
          </List.Accordion>

          <List.Accordion title='Save value' id='3'>
            <LatestListItem
              key={typeToSave}
              icon='clock'
              title='Latest value'
              identifier={typeToSave}
            />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<Button uppercase={false} onPress={() => setMenuVisible(true)}>{typeToSave.replace('HKQuantityTypeIdentifier', '')}</Button>}
            >
              {
                [...saveableCountTypes, ...saveableMassTypes].map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setTypeToSave(type)
                      setMenuVisible(false)
                    }}
                    title={type.replace('HKQuantityTypeIdentifier', '')}
                  />
                ))
              }
            </Menu>
            <TextInput
              accessibilityLabel='Value'
              keyboardType='numeric'
              onSubmitEditing={save}
              returnKeyType='done'
              accessibilityHint='Enter a value to save'
              value={saveValueStr}
              onChangeText={setSaveValueStr}
            />
            <Button onPress={save}>Save</Button>
          </List.Accordion>
        </List.AccordionGroup>
      </ScrollView>
    </Provider>
  )
}

export default App
