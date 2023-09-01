/* eslint-disable import/no-unresolved */
import Healthkit, {
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKWorkoutActivityType,
  HKCategoryTypeIdentifier,
  HKWorkoutRouteTypeIdentifier,
  HKWorkoutTypeIdentifier,
} from "@kingstinct/react-native-healthkit";
import useHealthkitAuthorization from "@kingstinct/react-native-healthkit/hooks/useHealthkitAuthorization";
import useMostRecentQuantitySample from "@kingstinct/react-native-healthkit/hooks/useMostRecentQuantitySample";
import useMostRecentWorkout from "@kingstinct/react-native-healthkit/hooks/useMostRecentWorkout";
import useSources from "@kingstinct/react-native-healthkit/hooks/useSources";
import useStatisticsForQuantity from "@kingstinct/react-native-healthkit/hooks/useStatisticsForQuantity";
import deleteQuantitySample from "@kingstinct/react-native-healthkit/utils/deleteQuantitySample";
import deleteSamples from "@kingstinct/react-native-healthkit/utils/deleteSamples";
import queryHeartbeatSeriesSamplesWithAnchor from "@kingstinct/react-native-healthkit/utils/queryHeartbeatSeriesSamplesWithAnchor";
import queryQuantitySamplesWithAnchor from "@kingstinct/react-native-healthkit/utils/queryQuantitySamplesWithAnchor";
import saveQuantitySample from "@kingstinct/react-native-healthkit/utils/saveQuantitySample";
import saveWorkoutSample from "@kingstinct/react-native-healthkit/utils/saveWorkoutSample";
import saveWorkoutRoute from "@kingstinct/react-native-healthkit/utils/saveWorkoutRoute";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  List,
  Menu,
  Provider,
  Text,
  TextInput,
} from "react-native-paper";

import type {
  HealthkitReadAuthorization,
  HealthkitWriteAuthorization,
  HKUnit,
} from "@kingstinct/react-native-healthkit";
import type { ComponentProps } from "react";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";

dayjs.extend(relativeTime);

const LatestListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit?: HKUnit;
  readonly icon: IconSource;
  readonly title: string;
}> = ({ identifier, unit, title, icon }) => {
  const latestValue = useMostRecentQuantitySample(identifier, unit),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, "icon">) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon]
    );

  return (
    <List.Item
      title={title || identifier}
      left={left}
      description={
        latestValue
          ? `${
              latestValue.unit === "%"
                ? (latestValue.quantity * 100).toFixed(1)
                : latestValue.quantity.toFixed(
                    latestValue.unit === "count" ||
                      latestValue.unit === "count/min"
                      ? 0
                      : 2
                  )
            } ${latestValue.unit} (${dayjs(latestValue.endDate).fromNow()})`
          : "No data found"
      }
    />
  );
};

const LatestWorkout: React.FC<{
  readonly icon: IconSource;
  readonly title: string;
}> = ({ title, icon }) => {
  const latestValue = useMostRecentWorkout(),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, "icon">) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon]
    );

  return (
    <List.Accordion title="Latest workout" id="workout">
      <List.Item
        title={title}
        left={left}
        description={
          latestValue
            ? `${
                TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                  latestValue.workoutActivityType as WorkoutType
                ] ??
                `Untranslated workout type (${latestValue.workoutActivityType})`
              } (${dayjs(latestValue.endDate).fromNow()})`
            : "No data found"
        }
      />
      <List.Item
        title="Distance"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon="map-marker-distance" />}
        description={
          latestValue?.totalDistance
            ? `${latestValue.totalDistance.quantity.toFixed(2)} ${
                latestValue.totalDistance.unit
              }`
            : "No data found"
        }
      />
      <List.Item
        title="Energy"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon="fire" />}
        description={
          latestValue?.totalEnergyBurned
            ? `${latestValue.totalEnergyBurned.quantity.toFixed(0)} ${
                latestValue.totalEnergyBurned.unit
              }`
            : "No data found"
        }
      />
      <List.Item
        title="Metadata"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon="database" />}
        description={
          latestValue?.metadata
            ? `${JSON.stringify(latestValue.metadata)}`
            : "No data found"
        }
      />
      <List.Item
        title="Device"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={(props) => <List.Icon {...props} icon="watch" />}
        description={
          latestValue?.device ? `${latestValue.device.name}` : "No data found"
        }
      />
    </List.Accordion>
  );
};

const TodayListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit: HKUnit;
  readonly title: string;
  readonly icon: IconSource;
  readonly option: HKStatisticsOptions;
}> = ({ identifier, option, unit, title, icon }) => {
  const latestValue = useStatisticsForQuantity(
      identifier,
      [option],
      dayjs().startOf("day").toDate(),
      undefined,
      unit
    ),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, "icon">) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon]
    );

  return (
    <List.Item
      title={title}
      left={left}
      description={
        latestValue
          ? `${
              latestValue.sumQuantity?.unit === "count"
                ? latestValue.sumQuantity?.quantity
                : latestValue.sumQuantity?.quantity.toFixed(2)
            } (${latestValue.sumQuantity?.unit})`
          : "No data found"
      }
    />
  );
};

const SourceListItem: React.FC<{
  readonly identifier: HKCategoryTypeIdentifier | HKQuantityTypeIdentifier;
  readonly title: string;
  readonly icon: IconSource;
}> = ({ identifier, title, icon }) => {
  const sources = useSources(identifier),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, "icon">) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon]
    );

  return (
    <List.Item
      title={title}
      left={left}
      description={
        sources
          ? `${
              sources.length === 1
                ? `1 source for this data type`
                : `${sources.length} sources for this data type`
            }`
          : "No sources found"
      }
    />
  );
};

// feel free to add more :)
const LATEST_QUANTITIES_TO_SHOW = [
  {
    icon: "battery-heart-variant" as const,
    title: "Resting Heart Rate",
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
  },
  {
    icon: "lungs" as const,
    title: "Respiratory Rate",
    identifier: HKQuantityTypeIdentifier.respiratoryRate,
  },
  {
    icon: "account-heart" as const,
    title: "Walking Heart Rate Average",
    identifier: HKQuantityTypeIdentifier.walkingHeartRateAverage,
  },
  {
    icon: "needle" as const,
    title: "Blood Glucose",
    identifier: HKQuantityTypeIdentifier.bloodGlucose,
  },
  {
    icon: "heart-pulse",
    title: "Heart rate",
    identifier: HKQuantityTypeIdentifier.heartRate,
    unit: "count/min",
  },
  {
    icon: "water-percent",
    title: "Oxygen saturation",
    identifier: HKQuantityTypeIdentifier.oxygenSaturation,
    unit: "%",
  },
  {
    icon: "percent",
    title: "Body Fat",
    identifier: HKQuantityTypeIdentifier.bodyFatPercentage,
    unit: "%",
  },
];

// feel free to add more :)
const TODAY_STATS_TO_SHOW = [
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    option: HKStatisticsOptions.discreteAverage,
    icon: "heart",
    title: "Resting Heart Rate",
    unit: "count/min" as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.stepCount,
    option: HKStatisticsOptions.cumulativeSum,
    icon: "walk",
    title: "Steps",
    unit: "count" as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.activeEnergyBurned,
    option: HKStatisticsOptions.cumulativeSum,
    icon: "fire",
    title: "Active Energy Burned",
    unit: "kcal" as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.distanceWalkingRunning,
    option: HKStatisticsOptions.cumulativeSum,
    icon: "walk",
    title: "Distance Walking/Running",
    unit: "km" as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.flightsClimbed,
    option: HKStatisticsOptions.cumulativeSum,
    icon: "stairs",
    title: "Flights Climbed",
    unit: "count" as const,
  },
];

const SOURCES_TO_SHOW = [
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    icon: "heart",
    title: "Resting Heart Rate",
  },
  {
    identifier: HKQuantityTypeIdentifier.stepCount,
    icon: "walk",
    title: "Steps",
  },
  {
    identifier: HKCategoryTypeIdentifier.sexualActivity,
    icon: "bed",
    title: "Sexual activity",
  },
];
// Note: we need to add a translation to present a workout type in a meaningful way since it maps to a number enum on
// the native side
const TRANSLATED_WORKOUT_TYPES_TO_SHOW = {
  [HKWorkoutActivityType.americanFootball]: "American Football",
  [HKWorkoutActivityType.soccer]: "Football",
  [HKWorkoutActivityType.running]: "Running",
  [HKWorkoutActivityType.walking]: "Walking",
};

type WorkoutType = keyof typeof TRANSLATED_WORKOUT_TYPES_TO_SHOW;

const SaveWorkout = () => {
  const [typeToSave, setTypeToSave] = useState<WorkoutType>(
    HKWorkoutActivityType.running
  );
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [kcalStr, setkcalStr] = useState<string>("50");
  const [distanceMetersStr, setDistanceMetersStr] = useState<string>("1000");

  const save = useCallback(async () => {
    const distance = parseFloat(distanceMetersStr);
    if (distance !== undefined && !Number.isNaN(distance)) {
      try {
        const x = await Healthkit.requestAuthorization(
          [
            HKWorkoutTypeIdentifier,
            HKWorkoutRouteTypeIdentifier,
            HKQuantityTypeIdentifier.activeEnergyBurned,
            HKQuantityTypeIdentifier.heartRate,
            HKQuantityTypeIdentifier.runningSpeed,
          ],
          [
            HKWorkoutTypeIdentifier,
            HKWorkoutRouteTypeIdentifier,
            HKQuantityTypeIdentifier.heartRate,
            HKQuantityTypeIdentifier.activeEnergyBurned,
            HKQuantityTypeIdentifier.runningSpeed,
          ]
        )
        // console.log("XXXX", x);
        const workoutUUID = await saveWorkoutSample(
          typeToSave,
          [
            // distance
            {
              quantity: 1609.34,
              unit: 'm',
              quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
              startDate: new Date(1693238969173 + 40000),
              endDate: new Date(1693238969173 + 60000),
            },
            // calories
            {
              quantity: 123,
              unit: 'kcal',
              quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
              startDate: new Date(1693238969173),
              endDate: new Date(1693238969173 + 60000),
            },
            // heart rate
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 180,
              startDate: new Date(1693238969173),
              endDate: new Date(1693238969173 + 5000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 120,
              startDate: new Date(1693238969173 + 5000),
              endDate: new Date(1693238969173 + 10000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 90,
              startDate: new Date(1693238969173 + 10000),
              endDate: new Date(1693238969173 + 15000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 60,
              startDate: new Date(1693238969173 + 15000),
              endDate: new Date(1693238969173 + 20000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 120,
              startDate: new Date(1693238969173 + 20000),
              endDate: new Date(1693238969173 + 25000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 110,
              startDate: new Date(1693238969173 + 25000),
              endDate: new Date(1693238969173 + 30000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 120,
              startDate: new Date(1693238969173 + 30000),
              endDate: new Date(1693238969173 + 35000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 110,
              startDate: new Date(1693238969173 + 35000),
              endDate: new Date(1693238969173 + 40000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 120,
              startDate: new Date(1693238969173 + 40000),
              endDate: new Date(1693238969173 + 45000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.heartRate,
              unit: 'count/min',
              quantity: 110,
              startDate: new Date(1693238969173 + 45000),
              endDate: new Date(1693238969173 + 60000),
            },
            {
              quantity: 250,
              unit: 'm',
              quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
              startDate: new Date(1693238969173),
              endDate: new Date(1693238969173 + 20000),
            },
            {
              quantity: 500,
              unit: 'm',
              quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
              startDate: new Date(1693238969173 + 20000),
              endDate: new Date(1693238969173 + 40000),
            },
            // running speed
            {
              quantityType: HKQuantityTypeIdentifier.runningSpeed,
              unit: 'm/s',
              quantity: 2,
              startDate: new Date(1693238969173),
              endDate: new Date(1693238969173 + 10000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.runningSpeed,
              unit: 'm/s',
              quantity: 2.4,
              startDate: new Date(1693238969173 + 10000),
              endDate: new Date(1693238969173 + 20000),
            },
            {
              quantityType: HKQuantityTypeIdentifier.runningSpeed,
              unit: 'm/s',
              quantity: 2.2,
              startDate: new Date(1693238969173 + 20000),
              endDate: new Date(1693238969173 + 30000),
            },
          ],
          new Date(1693238969173),
          {
            end: new Date(1693238969173 + 60000),
          },
        )

        console.log('CREATED WORKOUT: ', workoutUUID)

        let coordinates = [
          {
            "timestamp": 1693238969173,
            "latitude": 41.74364785389859,
            "longitude": -71.39388712994852,
            "speed": 1.1455277261275059,
            "altitude": 12.7,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 2000,
            "latitude": 41.7436924395713,
            "longitude": -71.39382793275263,
            "speed": 1.285095821168931,
            "altitude": 13.6,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 4000,
            "latitude": 41.74375026860205,
            "longitude": -71.39383171297953,
            "speed": 1.402523088645488,
            "altitude": 14.5,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 6000,
            "latitude": 41.74383150307069,
            "longitude": -71.39385647966317,
            "speed": 1.5322020207350469,
            "altitude": 13.7,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 8000,
            "latitude": 41.74389953300524,
            "longitude": -71.39388352711296,
            "speed": 2.1356288346039416,
            "altitude": 14,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 10000,
            "latitude": 41.743968134802216,
            "longitude": -71.3938922341416,
            "speed": 2.1841806264885295,
            "altitude": 12.6,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 12000,
            "latitude": 41.743968134802216,
            "longitude": -71.3938922341416,
            "speed": 2.1502912379836863,
            "altitude": 12.6,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 14000,
            "latitude": 41.743968134802216,
            "longitude": -71.3938922341416,
            "speed": 2.1502912379836863,
            "altitude": 12.6,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 16000,
            "latitude": 41.74397967941766,
            "longitude": -71.39389982348058,
            "speed": 2.1753854497292195,
            "altitude": 13.3,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 18000,
            "latitude": 41.74394541465364,
            "longitude": -71.39390031498536,
            "speed": 2.1638740622473494,
            "altitude": 13.5,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 20000,
            "latitude": 41.74389976375784,
            "longitude": -71.39389187510491,
            "speed": 2.1693958013404178,
            "altitude": 13.5,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 22000,
            "latitude": 41.74386230015217,
            "longitude": -71.3938756889455,
            "speed": 2.7971076334601155,
            "altitude": 13.3,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 24000,
            "latitude": 41.74386230015217,
            "longitude": -71.3938756889455,
            "speed": 2.7288485957616135,
            "altitude": 13.3,
            "verticalAccuracy": 4.7,
            "horizontalAccuracy": 3.4,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 26000,
            "latitude": 41.743357514293365,
            "longitude": -71.39403322169645,
            "speed": 2.7288485957616135,
            "altitude": 13.8,
            "verticalAccuracy": 5.1,
            "horizontalAccuracy": 2.8,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 28000,
            "latitude": 41.74336392598611,
            "longitude": -71.39402508867961,
            "speed": 2.710493562684472,
            "altitude": 13.7,
            "verticalAccuracy": 5,
            "horizontalAccuracy": 2.9,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 30000,
            "latitude": 41.74341265361281,
            "longitude": -71.39401247309405,
            "speed": 2.7128010044790143,
            "altitude": 14.1,
            "verticalAccuracy": 4.8,
            "horizontalAccuracy": 3.3,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 32000,
            "latitude": 41.74344194768131,
            "longitude": -71.3940220117494,
            "speed": 2.7484091075606267,
            "altitude": 13.6,
            "verticalAccuracy": 4.8,
            "horizontalAccuracy": 3.3,
            "course": -1
          },
          {
            "timestamp": 1693238969173 + 34000,
            "latitude": 41.743488388272596,
            "longitude": -71.39400270961247,
            "speed": 2.73806763140424,
            "altitude": 13.3,
            "verticalAccuracy": 4.8,
            "horizontalAccuracy": 3.3,
            "course": -1
          }
        ]
        

        if (workoutUUID) {
          await saveWorkoutRoute(workoutUUID, [])
          console.log('SAVED ROUTE')
        }
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }
  }, [typeToSave, distanceMetersStr]);

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {TRANSLATED_WORKOUT_TYPES_TO_SHOW[typeToSave]}
          </Button>
        }
      >
        {Object.keys(TRANSLATED_WORKOUT_TYPES_TO_SHOW).map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(parseInt(type, 10) as WorkoutType);
              setMenuVisible(false);
            }}
            title={
              TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                type as unknown as WorkoutType
              ] ?? `Untranslated workout type (${type})`
            }
          />
        ))}
      </Menu>
      {/* <TextInput
        accessibilityLabel='Value'
        keyboardType='numeric'
        onSubmitEditing={save}
        label='Kcal'
        returnKeyType='done'
        accessibilityHint='Enter a value to save'
        value={kcalStr}
        onChangeText={setkcalStr}
      /> */}
      <TextInput
        accessibilityLabel="Value"
        keyboardType="numeric"
        onSubmitEditing={save}
        label="Meters running/walking"
        returnKeyType="done"
        accessibilityHint="Enter a value to save"
        value={distanceMetersStr}
        onChangeText={setDistanceMetersStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  );
};

const DeleteQuantity = () => {
  const typeToDelete = HKQuantityTypeIdentifier.stepCount;
  const latestValue = useMostRecentQuantitySample(typeToDelete);

  const deleteFn = useCallback(() => {
    if (latestValue) {
      void deleteQuantitySample(typeToDelete, latestValue?.uuid);
    }
  }, [latestValue, typeToDelete]);

  return (
    <>
      <LatestListItem
        key={typeToDelete}
        icon="clock"
        title="Latest value"
        identifier={typeToDelete}
      />
      <Button onPress={deleteFn}>Delete Last Value</Button>
    </>
  );
};

const DeleteSample = () => {
  const typeToDelete = HKQuantityTypeIdentifier.bodyMass;
  const latestValue = useMostRecentQuantitySample(typeToDelete);

  const deleteFn = useCallback(() => {
    if (latestValue) {
      void deleteSamples({
        identifier: typeToDelete,
        startDate: new Date(new Date(latestValue.startDate).getTime() - 1000),
        endDate: new Date(new Date(latestValue.endDate).getTime() + 1000),
      });
    }
  }, [latestValue, typeToDelete]);

  return (
    <>
      <LatestListItem
        key={typeToDelete}
        icon="clock"
        title="Latest value"
        identifier={typeToDelete}
      />
      <Button onPress={deleteFn}>Delete Last Value</Button>
    </>
  );
};

const SaveQuantity = () => {
  const [typeToSave, setTypeToSave] = useState<HKQuantityTypeIdentifier>(
    HKQuantityTypeIdentifier.stepCount
  );
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [saveValueStr, setSaveValueStr] = useState<string>("0");

  const unit =
    saveableMassTypes.includes(typeToSave) ||
    typeToSave === HKQuantityTypeIdentifier.bodyMass
      ? "g"
      : "count";

  const save = useCallback(() => {
    const val = parseFloat(saveValueStr);
    if (saveValueStr !== undefined && !Number.isNaN(val)) {
      void saveQuantitySample(typeToSave, unit, val);
      setSaveValueStr("0");
    }
  }, [saveValueStr, typeToSave, unit]);

  return (
    <>
      <LatestListItem
        key={typeToSave}
        icon="clock"
        title="Latest value"
        identifier={typeToSave}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {typeToSave.replace("HKQuantityTypeIdentifier", "")}
          </Button>
        }
      >
        {[
          ...saveableCountTypes,
          ...saveableMassTypes,
          HKQuantityTypeIdentifier.bodyMass,
        ].map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(type);
              setMenuVisible(false);
            }}
            title={type.replace("HKQuantityTypeIdentifier", "")}
          />
        ))}
      </Menu>
      <TextInput
        accessibilityLabel="Value"
        keyboardType="numeric"
        label={unit}
        onSubmitEditing={save}
        returnKeyType="done"
        accessibilityHint="Enter a value to save"
        value={saveValueStr}
        onChangeText={setSaveValueStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  );
};

const saveableCountTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.pushCount,
];

const saveableMassTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.dietaryFatTotal,
  HKQuantityTypeIdentifier.dietaryCarbohydrates,
  HKQuantityTypeIdentifier.dietaryProtein,
];

const saveableWorkoutStuff: readonly HealthkitWriteAuthorization[] = [
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKQuantityTypeIdentifierHeight",
  "HKWorkoutTypeIdentifier",
  "HKWorkoutRouteTypeIdentifier",
];

const readPermissions: readonly HealthkitReadAuthorization[] = [
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.basalEnergyBurned,
  HKQuantityTypeIdentifier.restingHeartRate,
  "HKCharacteristicTypeIdentifierActivityMoveMode",
  "HKWorkoutTypeIdentifier",
  "HKWorkoutRouteTypeIdentifier",
  "HKQuantityTypeIdentifierStepCount",
  HKQuantityTypeIdentifier.distanceCycling,
  HKQuantityTypeIdentifier.distanceSwimming,
  HKQuantityTypeIdentifier.distanceWalkingRunning,
  HKQuantityTypeIdentifier.oxygenSaturation,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  "HKDataTypeIdentifierHeartbeatSeries",
  HKQuantityTypeIdentifier.swimmingStrokeCount,
  HKQuantityTypeIdentifier.bodyFatPercentage,
  HKQuantityTypeIdentifier.bodyMass,
  ...LATEST_QUANTITIES_TO_SHOW.map((entry) => entry.identifier),
  ...TODAY_STATS_TO_SHOW.map((entry) => entry.identifier),
  ...SOURCES_TO_SHOW.map((entry) => entry.identifier),
  ...saveableMassTypes,
  ...saveableCountTypes,
];

const App = () => {
  const [status, request] = useHealthkitAuthorization(readPermissions, [
    HKQuantityTypeIdentifier.bodyMass,
    ...saveableCountTypes,
    ...saveableMassTypes,
    ...saveableWorkoutStuff,
  ]);

  const [canAccessProtectedData, setAccessProtectedData] =
    useState<boolean>(false);

  useEffect(() => {
    Healthkit.canAccessProtectedData()
      .then(setAccessProtectedData)
      .catch(() => setAccessProtectedData(false));
  }, []);

  const anchor = useRef<string>();
  const heartbeatsAnchor = useRef<string>();

  return status !== HKAuthorizationRequestStatus.unnecessary ? (
    <View style={styles.buttonWrapper}>
      <Button onPress={request}>Authorize</Button>
    </View>
  ) : (
    <Provider>
      <ScrollView style={styles.scrollView}>
        <Button
          onPress={async () => {
            const res = await queryQuantitySamplesWithAnchor(
              HKQuantityTypeIdentifier.stepCount,
              {
                limit: 2,
              }
            );

            anchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}
        >
          First 2 stepCount
        </Button>
        <Button
          onPress={async () => {
            const res = await queryQuantitySamplesWithAnchor(
              HKQuantityTypeIdentifier.stepCount,
              {
                limit: 2,
                anchor: anchor.current,
              }
            );

            anchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}
        >
          Next 2 stepCount
        </Button>
        <Button
          onPress={async () => {
            const res = await queryHeartbeatSeriesSamplesWithAnchor({
              limit: 2,
              anchor: heartbeatsAnchor.current,
            });

            heartbeatsAnchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}
        >
          Next 2 HeartbeatSeries samples
        </Button>
        <LatestWorkout icon="run" title="Latest workout" />
        <List.AccordionGroup>
          <List.Accordion title="Latest values" id="1">
            {LATEST_QUANTITIES_TO_SHOW.map((e) => (
              <LatestListItem
                key={e.identifier}
                icon={e.icon}
                title={e.title}
                identifier={e.identifier}
              />
            ))}
          </List.Accordion>

          <List.Accordion title="Today stats" id="2">
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

          <List.Accordion title="Sources" id="3">
            {SOURCES_TO_SHOW.map((e) => (
              <SourceListItem
                key={e.identifier}
                identifier={e.identifier}
                title={e.title}
                icon={e.icon}
              />
            ))}
          </List.Accordion>

          <List.Accordion title="Save Quantity" id="4">
            <SaveQuantity />
          </List.Accordion>

          <List.Accordion title="Delete Latest Quantity" id="5">
            <DeleteQuantity />
          </List.Accordion>

          <List.Accordion title="Save Workout" id="6">
            <SaveWorkout />
          </List.Accordion>

          <List.Accordion title="Delete Latest body mass Value" id="7">
            <DeleteSample />
          </List.Accordion>
        </List.AccordionGroup>
        <Text>{`Can access protected data: ${canAccessProtectedData}`}</Text>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: { marginTop: 100, flex: 1, width: "100%" },
  buttonWrapper: { paddingTop: 100 },
});

export default App;
