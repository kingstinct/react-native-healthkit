/* eslint-disable import/no-unresolved */
import Healthkit, {
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKWorkoutActivityType,
} from '@kingstinct/react-native-healthkit'
import useHealthkitAuthorization from '@kingstinct/react-native-healthkit/hooks/useHealthkitAuthorization'
import useMostRecentQuantitySample from '@kingstinct/react-native-healthkit/hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from '@kingstinct/react-native-healthkit/hooks/useMostRecentWorkout'
import useStatisticsForQuantity from '@kingstinct/react-native-healthkit/hooks/useStatisticsForQuantity'
import deleteQuantitySample from '@kingstinct/react-native-healthkit/utils/deleteQuantitySample'
import saveQuantitySample from '@kingstinct/react-native-healthkit/utils/saveQuantitySample'
import saveWorkoutSample from '@kingstinct/react-native-healthkit/utils/saveWorkoutSample'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
  Button,
  List,
  Menu,
  Provider,
  Text,
  TextInput,
} from 'react-native-paper'

import type {
  HealthkitReadAuthorization,
  HealthkitWriteAuthorization,
  HKUnit,
} from '@kingstinct/react-native-healthkit'
import type { ComponentProps } from 'react'
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

dayjs.extend(relativeTime)

const LatestListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit?: HKUnit;
  readonly icon: IconSource;
  readonly title: string;
}> = ({
  identifier, unit, title, icon,
}) => {
  const latestValue = useMostRecentQuantitySample(identifier, unit),
        left = useCallback(
          (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
            <List.Icon {...props} icon={icon} />
          ),
          [icon],
        )

  return (
    <List.Item
      title={title || identifier}
      left={left}
      description={
        latestValue
          ? `${
            latestValue.unit === '%'
              ? (latestValue.quantity * 100).toFixed(1)
              : latestValue.quantity.toFixed(
                latestValue.unit === 'count'
                      || latestValue.unit === 'count/min'
                  ? 0
                  : 2,
              )
          } ${latestValue.unit} (${dayjs(latestValue.endDate).fromNow()})`
          : 'No data found'
      }
    />
  )
}

const LatestWorkout: React.FC<{
  readonly icon: IconSource;
  readonly title: string;
}> = ({ title, icon }) => {
  const latestValue = useMostRecentWorkout(),
        left = useCallback(
          (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
            <List.Icon {...props} icon={icon} />
          ),
          [icon],
        )

  return (
    <List.Accordion title='Latest workout' id='workout'>
      <List.Item
        title={title}
        left={left}
        description={
          latestValue
            ? `${
              TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                latestValue.workoutActivityType as WorkoutType
              ]
                ?? `Untranslated workout type (${latestValue.workoutActivityType})`
            } (${dayjs(latestValue.endDate).fromNow()})`
            : 'No data found'
        }
      />
      <List.Item
        title='Distance'
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon='map-marker-distance' />}
        description={
          latestValue?.totalDistance
            ? `${latestValue.totalDistance.quantity.toFixed(2)} ${
              latestValue.totalDistance.unit
            }`
            : 'No data found'
        }
      />
      <List.Item
        title='Energy'
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon='fire' />}
        description={
          latestValue?.totalEnergyBurned
            ? `${latestValue.totalEnergyBurned.quantity.toFixed(0)} ${
              latestValue.totalEnergyBurned.unit
            }`
            : 'No data found'
        }
      />
      <List.Item
        title='Metadata'
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon='database' />}
        description={
          latestValue?.metadata
            ? `${JSON.stringify(latestValue.metadata)}`
            : 'No data found'
        }
      />
      <List.Item
        title='Device'
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon='watch' />}
        description={
          latestValue?.device ? `${latestValue.device.name}` : 'No data found'
        }
      />
    </List.Accordion>
  )
}

const TodayListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit: HKUnit;
  readonly title: string;
  readonly icon: IconSource;
  readonly option: HKStatisticsOptions;
}> = ({
  identifier, option, unit, title, icon,
}) => {
  const latestValue = useStatisticsForQuantity(
          identifier,
          [option],
          dayjs().startOf('day').toDate(),
          undefined,
          unit,
        ),
        left = useCallback(
          (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
            <List.Icon {...props} icon={icon} />
          ),
          [icon],
        )

  return (
    <List.Item
      title={title}
      left={left}
      description={
        latestValue
          ? `${
            latestValue.sumQuantity?.unit === 'count'
              ? latestValue.sumQuantity?.quantity
              : latestValue.sumQuantity?.quantity.toFixed(2)
          } (${latestValue.sumQuantity?.unit})`
          : 'No data found'
      }
    />
  )
}

// feel free to add more :)
const LATEST_QUANTITIES_TO_SHOW = [
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

// feel free to add more :)
const TODAY_STATS_TO_SHOW = [
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
    unit: 'count' as const,
  },
]

// Note: we need to add a translation to present a workout type in a meaningful way since it maps to a number enum on
// the native side
const TRANSLATED_WORKOUT_TYPES_TO_SHOW = {
  [HKWorkoutActivityType.americanFootball]: 'American Football',
  [HKWorkoutActivityType.soccer]: 'Football',
  [HKWorkoutActivityType.running]: 'Running',
  [HKWorkoutActivityType.walking]: 'Walking',
}

type WorkoutType = keyof typeof TRANSLATED_WORKOUT_TYPES_TO_SHOW;

const SaveWorkout = () => {
  const [typeToSave, setTypeToSave] = useState<WorkoutType>(
    HKWorkoutActivityType.americanFootball,
  )
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [kcalStr, setkcalStr] = useState<string>('50')
  const [distanceMetersStr, setDistanceMetersStr] = useState<string>('1000')

  const save = useCallback(() => {
    const val = parseFloat(kcalStr)
    const distance = parseFloat(distanceMetersStr)
    if (
      val !== undefined
      && !Number.isNaN(val)
      && distance !== undefined
      && !Number.isNaN(distance)
    ) {
      void saveWorkoutSample(
        typeToSave,
        [
          {
            quantity: distance,
            unit: 'm',
            quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
          },
          {
            quantity: val,
            unit: 'kcal',
            quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
          },
        ],
        new Date(),
      )
      setkcalStr('0')
    }
  }, [kcalStr, typeToSave, distanceMetersStr])

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={(
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {TRANSLATED_WORKOUT_TYPES_TO_SHOW[typeToSave]}
          </Button>
        )}
      >
        {Object.keys(TRANSLATED_WORKOUT_TYPES_TO_SHOW).map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(parseInt(type, 10) as WorkoutType)
              setMenuVisible(false)
            }}
            title={
              TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                type as unknown as WorkoutType
              ] ?? `Untranslated workout type (${type})`
            }
          />
        ))}
      </Menu>
      <TextInput
        accessibilityLabel='Value'
        keyboardType='numeric'
        onSubmitEditing={save}
        label='Kcal'
        returnKeyType='done'
        accessibilityHint='Enter a value to save'
        value={kcalStr}
        onChangeText={setkcalStr}
      />
      <TextInput
        accessibilityLabel='Value'
        keyboardType='numeric'
        onSubmitEditing={save}
        label='Meters running/walking'
        returnKeyType='done'
        accessibilityHint='Enter a value to save'
        value={distanceMetersStr}
        onChangeText={setDistanceMetersStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  )
}

const DeleteQuantity = () => {
  const typeToDelete = HKQuantityTypeIdentifier.stepCount
  const latestValue = useMostRecentQuantitySample(typeToDelete)

  const deleteFn = useCallback(() => {
    if (latestValue) {
      void deleteQuantitySample(typeToDelete, latestValue?.uuid)
    }
  }, [latestValue, typeToDelete])

  return (
    <>
      <LatestListItem
        key={typeToDelete}
        icon='clock'
        title='Latest value'
        identifier={typeToDelete}
      />
      <Button onPress={deleteFn}>Delete Last Value</Button>
    </>
  )
}

const SaveQuantity = () => {
  const [typeToSave, setTypeToSave] = useState<HKQuantityTypeIdentifier>(
    HKQuantityTypeIdentifier.stepCount,
  )
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [saveValueStr, setSaveValueStr] = useState<string>('0')

  const unit = saveableMassTypes.includes(typeToSave) ? 'g' : 'count'

  const save = useCallback(() => {
    const val = parseFloat(saveValueStr)
    if (saveValueStr !== undefined && !Number.isNaN(val)) {
      void saveQuantitySample(typeToSave, unit, val)
      setSaveValueStr('0')
    }
  }, [saveValueStr, typeToSave, unit])

  return (
    <>
      <LatestListItem
        key={typeToSave}
        icon='clock'
        title='Latest value'
        identifier={typeToSave}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={(
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {typeToSave.replace('HKQuantityTypeIdentifier', '')}
          </Button>
        )}
      >
        {[...saveableCountTypes, ...saveableMassTypes].map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(type)
              setMenuVisible(false)
            }}
            title={type.replace('HKQuantityTypeIdentifier', '')}
          />
        ))}
      </Menu>
      <TextInput
        accessibilityLabel='Value'
        keyboardType='numeric'
        label={unit}
        onSubmitEditing={save}
        returnKeyType='done'
        accessibilityHint='Enter a value to save'
        value={saveValueStr}
        onChangeText={setSaveValueStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  )
}

const saveableCountTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.pushCount,
]

const saveableMassTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.dietaryFatTotal,
  HKQuantityTypeIdentifier.dietaryCarbohydrates,
  HKQuantityTypeIdentifier.dietaryProtein,
]

const saveableWorkoutStuff: readonly HealthkitWriteAuthorization[] = [
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
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
  ...LATEST_QUANTITIES_TO_SHOW.map((entry) => entry.identifier),
  ...TODAY_STATS_TO_SHOW.map((entry) => entry.identifier),
  ...saveableMassTypes,
  ...saveableCountTypes,
]

const App = () => {
  const [status, request] = useHealthkitAuthorization(readPermissions, [
    ...saveableCountTypes,
    ...saveableMassTypes,
    ...saveableWorkoutStuff,
  ])

  const [canAccessProtectedData, setAccessProtectedData] = useState<boolean>(false)

  useEffect(() => {
    Healthkit.canAccessProtectedData()
      .then(setAccessProtectedData)
      .catch(() => setAccessProtectedData(false))
  }, [])

  return status !== HKAuthorizationRequestStatus.unnecessary ? (
    <View style={styles.buttonWrapper}>
      <Button onPress={request}>Authorize</Button>
    </View>
  ) : (
    <Provider>
      <ScrollView style={styles.scrollView}>
        <LatestWorkout icon='run' title='Latest workout' />
        <List.AccordionGroup>
          <List.Accordion title='Latest values' id='1'>
            {LATEST_QUANTITIES_TO_SHOW.map((e) => (
              <LatestListItem
                key={e.identifier}
                icon={e.icon}
                title={e.title}
                identifier={e.identifier}
              />
            ))}
          </List.Accordion>

          <List.Accordion title='Today stats' id='2'>
            {TODAY_STATS_TO_SHOW.map((e) => (
              <TodayListItem
                key={e.identifier}
                icon={e.icon}
                title={e.title}
                identifier={e.identifier}
                option={e.option}
                unit={e.unit}
              />
            ))}
          </List.Accordion>

          <List.Accordion title='Save Quantity' id='3'>
            <SaveQuantity />
          </List.Accordion>

          <List.Accordion title='Delete Latest Quantity' id='4'>
            <DeleteQuantity />
          </List.Accordion>

          <List.Accordion title='Save Workout' id='5'>
            <SaveWorkout />
          </List.Accordion>
        </List.AccordionGroup>
        <Text>{`Can access protected data: ${canAccessProtectedData}`}</Text>
      </ScrollView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  scrollView: { marginTop: 100, flex: 1, width: '100%' },
  buttonWrapper: { paddingTop: 100 },
})

export default App
