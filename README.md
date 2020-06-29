# @kingstinct/react-native-healthkit

React Native bindings for HealthKit. Built natively for TypeScript and mapping as much as possible directly to how Healthkit serializes and introduce as little magic on top as possible - which makes it easy to keep it up to date with all current healthkit features - and since it maps fairly directly the official documentation will make sense as well.

* With TypeScript bindings
* Promises all the way
* Maps as directly to Healthkit as possible - uses native Healthkit serialized formats where applicable.
* Providing sensible defaults. Read units based on devices preferred unit by default.
* React hook support with `useLastSample`

## Installation

```sh
npm install @kingstinct/react-native-healthkit
cd ios
pod install
```

or

```sh
yarn add @kingstinct/react-native-healthkit
cd ios
pod install
```

Remember to set `NSHealthUpdateUsageDescription` and `NSHealthShareUsageDescription` in your `Info.plist` as well as enable the HealthKit capability for the project in Xcode. During runtime you need to check if HealthKit is available on the device with `isHealthDataAvailable` and request permissions with `requestAuthorization`;

Since this package is using Swift you might also need to add a bridging header in your project if you haven't already, you can [find more about that in the official React Native docs](https://reactnative.dev/docs/native-modules-ios#exporting-swift)

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

  const unsubscribe = HealthKit.on(HKQuantityTypeIdentifier.heartRate, (samples) => {
    console.log(samples) // |{ quantity: 80, unit: 'count/min', ... }]
  });

  /* write data */
  await HealthKit.requestAuthorization([], [HKQuantityTypeIdentifier.bodyFatPercentage]); // request write permission for bodyFatPercentage

  await HealthKit.save(HKQuantityTypeIdentifier.bodyFatPercentage, HKUnitNonSI.Percent, 15.7); // write data


  /* useLastSample hook, always listening to latest sample */
  const lastBodyFatSample = HealthKit.useLastSample(HKQuantityTypeIdentifier.bodyFatPercentage);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
