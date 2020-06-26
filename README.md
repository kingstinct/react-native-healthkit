# @kingstinct/react-native-healthkit

React Native bindings for HealthKit. Built natively for TypeScript and mapping as much as possible directly to Healthkit which means it's easy to access most of the data.

## Installation

```sh
npm install @kingstinct/react-native-healthkit
```

or

```sh
yarn add @kingstinct/react-native-healthkit
```

Remember to set `NSHealthUpdateUsageDescription` and `NSHealthShareUsageDescription` in your `Info.plist` as well as enable the HealthKit capability for the project in Xcode. During runtime you need to check if HealthKit is available on the device with `isHealthDataAvailable` and request permissions with `requestAuthorization`;

## Usage

```TypeScript
  import HealthKit from '@kingstinct/react-native-healthkit';

  const isAvailable = await HealthKit.isHealthDataAvailable();

  /* Read latest sample of any data */
  await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bodyFatPercentage]); // request read permission for bodyFatPercentage

  const { quantity, unit, startDate, endDate } = await HealthKit.getLastSample(HKQuantityTypeIdentifier.bodyFatPercentage); // read latest sample
  
  console.log(quantity) // 17.5
  console.log(unit) // %

  /* Listen to data */
  await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.heartRate]); // request read permission for bodyFatPercentage

  HealthKit.on(HKQuantityTypeIdentifier.heartRate, (samples) => {
    console.log(samples) // |{ quantity: 80, unit: 'count/min', ... }]
  });

  /* write data */
  await HealthKit.requestAuthorization([], [HKQuantityTypeIdentifier.bodyFatPercentage]); // request write permission for bodyFatPercentage

  await HealthKit.writeSample(HKQuantityTypeIdentifier.bodyFatPercentage, HKOtherUnits.Mmol_glucose, 15.7); // write data
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
