import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ReactNativeHealthkit, {
  HKCharacteristicTypeIdentifier,
  HKQuantityTypeIdentifier,
  QuantitySample,
  HKUnitNonSI,
} from '@kingstinct/react-native-healthkit';

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
      {
        [HKQuantityTypeIdentifier.waistCircumference]: true,
        [HKQuantityTypeIdentifier.activeEnergyBurned]: true,
      },
      {
        [HKCharacteristicTypeIdentifier.biologicalSex]: true,
        [HKCharacteristicTypeIdentifier.bloodType]: true,
        [HKCharacteristicTypeIdentifier.dateOfBirth]: true,
        [HKCharacteristicTypeIdentifier.fitzpatrickSkinType]: true,
        [HKQuantityTypeIdentifier.waistCircumference]: true,
        [HKQuantityTypeIdentifier.bodyMassIndex]: true,
        [HKQuantityTypeIdentifier.bodyMass]: true,
        [HKQuantityTypeIdentifier.bloodGlucose]: true,
        [HKQuantityTypeIdentifier.activeEnergyBurned]: true,
      }
    ).then((result) => {
      // setResult(result);
      setAuthorizationStatus(result);
      ReactNativeHealthkit.writeSample(
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKUnitNonSI.Kilocalories,
        99
      ).then((/*success*/) => {
        ReactNativeHealthkit.getDateOfBirth().then(setDateOfBirth);

        /*ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.bodyMass
        ).then(setBodyMass);*/

        ReactNativeHealthkit.getLastSamples(
          HKQuantityTypeIdentifier.activeEnergyBurned,
          2
        ).then(setActiveEnergyBurned);
      });

      ReactNativeHealthkit.on(HKQuantityTypeIdentifier.bodyMass, (samples) => {
        setBodyMass(samples);
      });
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
