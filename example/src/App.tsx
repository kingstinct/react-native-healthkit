import * as React from 'react';
import { Text, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs';
import Healthkit, {
  HKCategoryTypeIdentifier,
  HKCharacteristicTypeIdentifier,
  HKQuantity,
  HKQuantitySample,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKWorkout,
  QueryStatisticsResponse,
  HKCategorySample,
  HKClinicalTypeIdentifier,
  HKDocumentTypeIdentifier,
  HKCorrelationTypeIdentifier,
  HKUnit,
  HKWeatherCondition,
  HKWorkoutActivityType,
  HKInsulinDeliveryReason,
} from '../../src/index';

const DisplayWorkout: React.FunctionComponent<{
  workout: HKWorkout;
}> = ({ workout }) => {
  return (
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>
        {workout.workoutActivityType}
      </DataTable.Cell>
      <DataTable.Cell
        style={{ paddingRight: 10 }}
        accessibilityStates={[]}
        numeric
      >
        {workout ? workout.duration.toFixed(0) + 's' : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {workout
          ? workout.totalDistance?.quantity.toFixed(1) +
            ' ' +
            workout.totalDistance?.unit
          : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
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
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell
        style={{ paddingRight: 10 }}
        accessibilityStates={[]}
        numeric
      >
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.unit : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
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
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell
        style={{ paddingRight: 10 }}
        accessibilityStates={[]}
        numeric
      >
        {sample ? sample.value : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.startDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
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
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell
        style={{ paddingRight: 10 }}
        accessibilityStates={[]}
        numeric
      >
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.unit : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>N/A</DataTable.Cell>
    </DataTable.Row>
  );
};

function DataView() {
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
  const bodyFat = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.bodyFatPercentage
  );

  const bloodGlucose = Healthkit.useMostRecentQuantitySample(
    HKQuantityTypeIdentifier.bloodGlucose
  );

  const clinicalSample = Healthkit.useMostRecentClinicalSample(
    HKClinicalTypeIdentifier.labResultRecord
  );

  const document = Healthkit.useMostRecentDocumentSample(
    HKDocumentTypeIdentifier.CDA
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

  const [
    queryStatisticsResponse,
    setQueryStatisticsResponse,
  ] = React.useState<QueryStatisticsResponse | null>(null);

  React.useEffect(() => {
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
    // });
  }, []);

  return (
    <ScrollView style={{ flex: 1, paddingTop: 40 }}>
      <Text>Date of birth: {dateOfBirth?.toLocaleDateString()}</Text>
      <DataTable>
        <DataTable.Header accessibilityStates={[]}>
          <DataTable.Title accessibilityStates={[]}>Metric</DataTable.Title>
          <DataTable.Title
            accessibilityStates={[]}
            style={{ paddingRight: 10 }}
            numeric
          >
            Value
          </DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Unit</DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Time</DataTable.Title>
        </DataTable.Header>

        {document ? (
          <DataTable.Row accessibilityStates={[]}>
            <DataTable.Cell accessibilityStates={[]}>
              {document.title}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {document.patientName}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {document.authorName}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {document.startDate.toLocaleString()}
            </DataTable.Cell>
          </DataTable.Row>
        ) : null}

        {clinicalSample ? (
          <DataTable.Row accessibilityStates={[]}>
            <DataTable.Cell accessibilityStates={[]}>
              {clinicalSample.clinicalType}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {clinicalSample.displayName}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {clinicalSample.fhirResource ? 'data' : '-'}
            </DataTable.Cell>
            <DataTable.Cell accessibilityStates={[]}>
              {clinicalSample.startDate.toLocaleString()}
            </DataTable.Cell>
          </DataTable.Row>
        ) : null}

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

        <DataTable.Header accessibilityStates={[]}>
          <DataTable.Title accessibilityStates={[]}>Workout</DataTable.Title>
          <DataTable.Title
            accessibilityStates={[]}
            style={{ paddingRight: 10 }}
            numeric
          >
            Duration
          </DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Distance</DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Energy</DataTable.Title>
        </DataTable.Header>
        {lastWorkout ? <DisplayWorkout workout={lastWorkout} /> : null}
      </DataTable>
    </ScrollView>
  );
}

/*

                
        
        
      </DataTable>*/

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
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKCategoryTypeIdentifier.mindfulSession,
        HKClinicalTypeIdentifier.labResultRecord,
        HKClinicalTypeIdentifier.allergyRecord,
        HKClinicalTypeIdentifier.vitalSignRecord,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        HKDocumentTypeIdentifier.CDA,
        'HKWorkoutTypeIdentifier',
      ],
      [
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKQuantityTypeIdentifier.bloodGlucose,
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
