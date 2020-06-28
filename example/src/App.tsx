import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ReactNativeHealthkit from 'src/index.ios';
import {
  HKCharacteristicTypeIdentifier,
  HKQuantityTypeIdentifier,
  QuantitySample,
  HKUnitNonSI,
} from 'src/types';

export default function App() {
  const [activeEnergyBurned, setActiveEnergyBurned] = React.useState<
    QuantitySample[]
  >([]);
  const [bodyMass, setBodyMass] = React.useState<QuantitySample[] | null>(null);
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
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
      ReactNativeHealthkit.writeSample(
        HKQuantityTypeIdentifier.bodyFatPercentage,
        HKUnitNonSI.Percent,
        6.7
      ).then((/*success*/) => {
        ReactNativeHealthkit.getDateOfBirth().then(setDateOfBirth);

        /*ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.bodyMass
        ).then(setBodyMass);*/

        ReactNativeHealthkit.getLastSamples(
          HKQuantityTypeIdentifier.bodyFatPercentage,
          2
        ).then(setActiveEnergyBurned);
      });

      ReactNativeHealthkit.on(
        HKQuantityTypeIdentifier.bodyFatPercentage,
        (samples) => {
          setBodyMass(samples);
        }
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>authorizationStatus: {JSON.stringify(authorizationStatus)}</Text>
      <Text>Energy samples: {JSON.stringify(activeEnergyBurned)}</Text>
      <Text>Date of birth: {dateOfBirth?.toISOString()}</Text>
      <Text>Body mass: {JSON.stringify(bodyMass)}</Text>
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
