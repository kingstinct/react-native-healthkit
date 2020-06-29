import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ReactNativeHealthkit from '../../src/index';
import {
  HKCharacteristicTypeIdentifier,
  HKQuantityTypeIdentifier,
  QuantitySample,
  HKUnitNonSI,
  HKStatisticsOptions,
  StatsResponse,
  Quantity,
} from '../../src/types';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs';

const DisplayQuantity: React.FunctionComponent<{
  title: string;
  sample: QuantitySample | null;
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

const DisplayStat: React.FunctionComponent<{
  title: string;
  sample: Quantity | undefined;
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

export default function App() {
  const [bodyFat, setBodyFat] = React.useState<QuantitySample | null>(null);
  const [bodyWeight, setBodyWeight] = React.useState<QuantitySample | null>(
    null
  );
  const [heartRate, setHeartRate] = React.useState<QuantitySample | null>(null);
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
  const [
    statsResponse,
    setStatsResponse,
  ] = React.useState<StatsResponse | null>(null);
  const [authorizationStatus, setAuthorizationStatus] = React.useState<
    boolean | null
  >(null);

  React.useEffect(() => {
    ReactNativeHealthkit.requestAuthorization(
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
      ],
      [
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKQuantityTypeIdentifier.bloodGlucose,
        HKQuantityTypeIdentifier.bodyFatPercentage,
      ]
    ).then((result) => {
      // setResult(result);
      setAuthorizationStatus(result);
      ReactNativeHealthkit.save(
        HKQuantityTypeIdentifier.bodyFatPercentage,
        HKUnitNonSI.Percent,
        6.7
      ).then((/*success*/) => {
        ReactNativeHealthkit.getDateOfBirth().then(setDateOfBirth);

        ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.bodyFatPercentage
        ).then(setBodyFat);

        ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.bodyMass
        ).then(setBodyWeight);

        ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.heartRate
        ).then(setHeartRate);

        ReactNativeHealthkit.getStatsBetween(
          HKQuantityTypeIdentifier.heartRate,
          [
            HKStatisticsOptions.discreteAverage,
            HKStatisticsOptions.discreteMax,
            HKStatisticsOptions.discreteMin,
          ],
          dayjs().startOf('day').toDate()
        ).then(setStatsResponse);

        ReactNativeHealthkit.on(
          HKQuantityTypeIdentifier.heartRate,
          (samples) => {
            setHeartRate(samples[0]);
          }
        );
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>authorizationStatus: {JSON.stringify(authorizationStatus)}</Text>
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
        <DisplayQuantity sample={bodyFat} title="Body fat" />
        <DisplayQuantity sample={bodyWeight} title="Weight" />
        <DisplayQuantity sample={heartRate} title="Heart rate" />
        <DisplayStat sample={statsResponse?.averageQuantity} title="Avg. HR" />
        <DisplayStat sample={statsResponse?.maximumQuantity} title="High HR" />
        <DisplayStat sample={statsResponse?.minimumQuantity} title="Low HR" />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
