import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ReactNativeHealthkit, {
  HKCharacteristicTypeIdentifier,
  HKQuantityTypeIdentifier,
  QuantitySample,
  NonSIUnit,
} from '@kingstinct/react-native-healthkit';

export default function App() {
  const [results, setResults] = React.useState<QuantitySample[]>([]);

  React.useEffect(() => {
    // ReactNativeHealthkit.isHealthDataAvailable().then(setResult);
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
        [HKQuantityTypeIdentifier.bloodGlucose]: true,
        [HKQuantityTypeIdentifier.activeEnergyBurned]: true,
      }
    ).then((result) => {
      // setResult(result);
      console.log('RESULT', result);
      ReactNativeHealthkit.writeSample(
        HKQuantityTypeIdentifier.activeEnergyBurned,
        NonSIUnit.Kilocalories,
        99
      ).then((/*success*/) => {
        // alert(success);
        ReactNativeHealthkit.getLastSample(
          HKQuantityTypeIdentifier.activeEnergyBurned
        ).then((result) => {
          setResults([result]);
        });
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {JSON.stringify(results)}</Text>
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
