/* eslint-disable react-native/no-inline-styles */
import 'expo-dev-client';
import * as React from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs';
import Healthkit, {
  HKCategorySample,
  HKCategoryTypeIdentifier,
  HKCharacteristicTypeIdentifier,
  HKCorrelationTypeIdentifier,
  HKInsulinDeliveryReason,
  HKQuantity,
  HKQuantitySample,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKUnit,
  HKWeatherCondition,
  HKWorkout,
  HKWorkoutActivityType,
  QueryStatisticsResponse,
} from '../src/index'; // this way we can work with the working copy - but keep in mind native changes requires a new build 🚀

const DisplayWorkout: React.FunctionComponent<{
  workout: HKWorkout;
}> = ({ workout }) => {
  return (
    <DataTable.Row>
      <DataTable.Cell>
        {HKWorkoutActivityType[workout.workoutActivityType]}
      </DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} numeric>
        {workout ? workout.duration.toFixed(0) + 's' : '-'}
      </DataTable.Cell>
      <DataTable.Cell>
        {workout
          ? workout.totalDistance?.quantity.toFixed(1) +
            ' ' +
            workout.totalDistance?.unit
          : '-'}
      </DataTable.Cell>
      <DataTable.Cell>
        {workout
          ? workout.totalEnergyBurned?.quantity.toFixed(1) +
            ' ' +
            workout.totalEnergyBurned?.unit
          : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayQuantitySample: React.FunctionComponent<{
  title: string;
  sample: HKQuantitySample | null;
}> = ({ title, sample }) => {
  return (
    <DataTable.Row>
      <DataTable.Cell>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} numeric>
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell>{sample ? sample.unit : '-'}</DataTable.Cell>
      <DataTable.Cell>
        {sample ? sample.startDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayCategorySample: React.FunctionComponent<{
  title: string;
  sample: HKCategorySample | null;
}> = ({ title, sample }) => {
  return (
    <DataTable.Row>
      <DataTable.Cell>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} numeric>
        {sample ? sample.value : '-'}
      </DataTable.Cell>
      <DataTable.Cell>
        {sample ? sample.startDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
      <DataTable.Cell>
        {sample ? sample.endDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayStat: React.FunctionComponent<{
  title: string;
  sample: HKQuantity | undefined;
}> = ({ title, sample }) => {
  return (
    <DataTable.Row>
      <DataTable.Cell>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} numeric>
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell>{sample ? sample.unit : '-'}</DataTable.Cell>
      <DataTable.Cell>N/A</DataTable.Cell>
    </DataTable.Row>
  );
};

function DataView() {
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);

  const [bloodGlucoseSamples, setBloodGlucoseSamples] =
    React.useState<Array<HKQuantitySample> | null>(null);

  const bodyFat = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.bodyFatPercentage
  );

  const bloodGlucose = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.bloodGlucose
  );

  const bodyWeight = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.bodyMass
  );
  const heartRate = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.heartRate
  );
  const lastWorkout = Healthkit.useMostRecentWorkout();
  const lastMindfulSession = Healthkit.useMostRecentCategorySample(
    HKCategoryTypeIdentifier.mindfulSession
  );

  const walkingSpeed = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.walkingSpeed
  );
  const sixMinWalk = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.sixMinuteWalkTestDistance
  );
  const walkingStepLength = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.walkingStepLength
  );
  const walkingAsymmetryPercentage = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.walkingAsymmetryPercentage
  );
  const walkingDoubleSupportPercentage = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.walkingDoubleSupportPercentage
  );

  const stairAscentSpeed = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.stairAscentSpeed
  );

  const stairDescentSpeed = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.stairDescentSpeed
  );

  const [queryStatisticsResponse, setQueryStatisticsResponse] =
    React.useState<QueryStatisticsResponse | null>(null);

  const writeSampleToHealthkit = () => {
    Healthkit.saveQuantitySample(
      HKQuantityTypeIdentifier.insulinDelivery,
      HKUnit.InternationalUnit,
      4.2,
      {
        metadata: {
          HKInsulinDeliveryReason: HKInsulinDeliveryReason.basal,
        },
      }
    );
    Healthkit.saveCorrelationSample(HKCorrelationTypeIdentifier.food, [
      {
        quantityType: HKQuantityTypeIdentifier.dietaryCaffeine,
        unit: HKUnit.Grams,
        quantity: 1,
        metadata: {},
      },
      {
        quantityType: HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        unit: HKUnit.Kilocalories,
        quantity: 1,
        metadata: {},
      },
    ]);

    Healthkit.saveWorkoutSample(
      HKWorkoutActivityType.archery,
      [
        {
          quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
          unit: HKUnit.Kilocalories,
          quantity: 63,
          metadata: {},
        },
        {
          quantityType: HKQuantityTypeIdentifier.appleExerciseTime,
          unit: HKUnit.Minutes,
          quantity: 11,
          metadata: {},
        },
      ],
      new Date(),
      {
        metadata: {
          HKWeatherCondition: HKWeatherCondition.hurricane,
        },
      }
    );

    Healthkit.getDateOfBirth().then(setDateOfBirth);

    Healthkit.queryStatisticsForQuantity(
      HKQuantityTypeIdentifier.heartRate,
      [
        HKStatisticsOptions.discreteAverage,
        HKStatisticsOptions.discreteMax,
        HKStatisticsOptions.discreteMin,
      ],
      dayjs().startOf('day').toDate()
    ).then(setQueryStatisticsResponse);

    Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.bloodGlucose, {
      ascending: true,
      from: dayjs().startOf('day').toDate(),
      to: new Date(),
    }).then(setBloodGlucoseSamples);
  };

  console.log(walkingDoubleSupportPercentage);

  return (
    <ScrollView style={{ flex: 1, paddingTop: 40 }}>
      <Button
        title="Write Sample to HealthKit"
        onPress={() => writeSampleToHealthkit()}
      />
      <Text>Date of birth: {dateOfBirth?.toLocaleDateString()}</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Metric</DataTable.Title>
          <DataTable.Title style={{ paddingRight: 10 }} numeric>
            Value
          </DataTable.Title>
          <DataTable.Title>Unit</DataTable.Title>
          <DataTable.Title>Time</DataTable.Title>
        </DataTable.Header>

        <DisplayQuantitySample sample={bodyFat} title="Body fat" />
        <DisplayQuantitySample sample={bodyWeight} title="Weight" />
        <DisplayQuantitySample sample={heartRate} title="Heart rate" />
        <DisplayQuantitySample sample={bloodGlucose} title="Glucose" />

        <DisplayStat
          sample={queryStatisticsResponse?.averageQuantity}
          title="Avg. HR"
        />
        <DisplayStat
          sample={queryStatisticsResponse?.maximumQuantity}
          title="High HR"
        />
        <DisplayStat
          sample={queryStatisticsResponse?.minimumQuantity}
          title="Low HR"
        />

        <DisplayCategorySample sample={lastMindfulSession} title="Mindful" />

        <DataTable.Header>
          <DataTable.Title>Workout</DataTable.Title>
          <DataTable.Title style={{ paddingRight: 10 }} numeric>
            Duration
          </DataTable.Title>
          <DataTable.Title>Distance</DataTable.Title>
          <DataTable.Title>Energy</DataTable.Title>
        </DataTable.Header>
        {lastWorkout ? <DisplayWorkout workout={lastWorkout} /> : null}

        <DataTable.Header>
          <DataTable.Title>Blood Glucose</DataTable.Title>
          <DataTable.Title style={{ paddingRight: 10 }} numeric>
            Value
          </DataTable.Title>
          <DataTable.Title>Units</DataTable.Title>
          <DataTable.Title>Time</DataTable.Title>
        </DataTable.Header>
        {bloodGlucoseSamples
          ? bloodGlucoseSamples.map((sample: HKQuantitySample) => (
              <DisplayQuantitySample sample={sample} title="Glucose" />
            ))
          : null}

        <DataTable.Header>
          <DataTable.Title>Mobility</DataTable.Title>
          <DataTable.Title style={{ paddingRight: 10 }} numeric>
            Value
          </DataTable.Title>
          <DataTable.Title>Units</DataTable.Title>
          <DataTable.Title>Time</DataTable.Title>
        </DataTable.Header>
        <DisplayQuantitySample sample={walkingSpeed} title="Walking speed" />
        <DisplayQuantitySample
          sample={sixMinWalk}
          title="Six-minute walk test"
        />
        <DisplayQuantitySample
          sample={walkingStepLength}
          title="Walking Step Length"
        />
        <DisplayQuantitySample
          sample={walkingAsymmetryPercentage}
          title="Walking Asymmetry"
        />
        <DisplayQuantitySample
          sample={walkingDoubleSupportPercentage}
          title="Walking Double Support"
        />
        <DisplayQuantitySample sample={stairAscentSpeed} title="Stair Ascent" />
        <DisplayQuantitySample
          sample={stairDescentSpeed}
          title="Stair Descent"
        />
      </DataTable>
    </ScrollView>
  );
}

const App = () => {
  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false);
  React.useEffect(() => {
    Healthkit.requestAuthorization(
      [
        HKCharacteristicTypeIdentifier.biologicalSex,
        HKCharacteristicTypeIdentifier.bloodType,
        HKCharacteristicTypeIdentifier.dateOfBirth,
        HKCharacteristicTypeIdentifier.fitzpatrickSkinType,
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.bodyMassIndex,
        HKQuantityTypeIdentifier.bodyMass,
        HKQuantityTypeIdentifier.heartRate,
        HKQuantityTypeIdentifier.bloodGlucose,
        HKQuantityTypeIdentifier.insulinDelivery,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKCategoryTypeIdentifier.mindfulSession,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        HKQuantityTypeIdentifier.walkingSpeed,
        HKQuantityTypeIdentifier.walkingAsymmetryPercentage,
        HKQuantityTypeIdentifier.walkingDoubleSupportPercentage,
        HKQuantityTypeIdentifier.stairAscentSpeed,
        HKQuantityTypeIdentifier.stairDescentSpeed,
        HKQuantityTypeIdentifier.walkingStepLength,
        'HKWorkoutTypeIdentifier',
      ],
      [
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKQuantityTypeIdentifier.bloodGlucose,
        HKQuantityTypeIdentifier.insulinDelivery,
        HKQuantityTypeIdentifier.bodyFatPercentage,
        HKCategoryTypeIdentifier.mindfulSession,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        'HKWorkoutTypeIdentifier',
      ]
    ).then(setHasPermissions);
  }, []);

  return hasPermissions ? (
    <DataView />
  ) : (
    <Text style={{ paddingTop: 40, textAlign: 'center' }}>
      Waiting for user to authorize..
    </Text>
  );
};

export default App;
