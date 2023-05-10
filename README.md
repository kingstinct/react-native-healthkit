# @kingstinct/react-native-healthkit

[![Test](https://github.com/Kingstinct/react-native-healthkit/actions/workflows/test.yml/badge.svg)](https://github.com/Kingstinct/react-native-healthkit/actions/workflows/test.yml)
[![@kingstinct/react-native-healthkit on NPM](https://img.shields.io/npm/v/@kingstinct/react-native-healthkit)](https://www.npmjs.com/package/@kingstinct/react-native-healthkit)
![npm](https://img.shields.io/npm/dt/@kingstinct/react-native-healthkit)

React Native bindings for HealthKit with full TypeScript and Promise support covering about any kind of data. Keeping TypeScript mappings as close as possible to HealthKit - both in regards to naming and serialization. This will make it easier to keep this library up-to-date with HealthKit as well as browsing [the official documentation](https://developer.apple.com/documentation/healthkit) (and if something - metadata properties for example - is not typed it will still be accessible).

| Data Types                  | Query | Save  | Subscribe | Examples                               |
| ----------------------------|:------|:------|:----------|:---------------------------------------|
| 80+ Quantity Types          | ✅    | ✅    | ✅       | Steps, energy burnt, blood glucose etc.. |
| 63 Category Types           | ✅    | ✅    | ✅       | Sleep analysis, mindful sessions etc.. |
| 75+ Workout Activity Types  | ✅    | ✅    | ✅       | Swimming, running, table tennis etc..  |
| Correlation Types           | ✅    | ✅    | ✅       | Food and blood pressure                |
| Document Types              | ✅    | ❌    | ✅       | [CDA documents](https://developer.apple.com/documentation/healthkit/hkcdadocument) exposed as Base64 data  |
| Clinical Records            | ✅    | ❌    | ✅       | Lab results etc in [FHIR JSON format](https://www.hl7.org/fhir/json.html)  |

### Disclaimer

This library is provided as-is without any warranty and is not affiliated with Apple in any way. The data might be incomplete or inaccurate.

## Installation

### Expo Managed Workflow (easiest - with config plugin)
Usage with Expo is possible - just keep in mind it will not work in Expo Go and [you'll need to roll your own Dev Client](https://docs.expo.dev/development/getting-started/). 

1. `yarn add @kingstinct/react-native-healthkit` (or `npm install @kingstinct/react-native-healthkit`)
2. Update your app.json with the config plugin:
```json
{
  "expo": {
    "plugins": ["@kingstinct/react-native-healthkit"]
  }
}
```
this will give you defaults that make the app build without any further configuration. If you want, you can override the defaults:
```json
{
  "expo": {
    "plugins": [
      ["@kingstinct/react-native-healthkit", {
        "NSHealthShareUsageDescription": "Your own custom usage description",
        "NSHealthUpdateUsageDescription": false,  // if you have no plans to update data, you can skip adding it to your info.plist
        "background": false // if you have no plans to use it in background mode, skip adding it to the entitlements
      }]
    ]
  }
}
```
3. Build a new Dev Client
4. During runtime check and request permissions with `requestAuthorization`. Failing to request authorization, or requesting a permission you haven't requested yet, will result in the app crashing.

### Expo Managed Workflow (manual)
Usage with Expo is possible - just keep in mind it will not work in Expo Go and [you'll need to roll your own Dev Client](https://docs.expo.dev/development/getting-started/). 

1. `yarn add @kingstinct/react-native-healthkit` (or `npm install @kingstinct/react-native-healthkit`)
2. Update your app.json:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSHealthShareUsageDescription": "<< your usage description here >>", // (optional) if you want to read healthkit data
        "NSHealthUpdateUsageDescription": "<< your usage description here >>" // (optional) if you want to write healthkit data
      },
      "entitlements": {
        "com.apple.developer.healthkit": true, // required to use healthkit
        "com.apple.developer.healthkit.background-delivery": true // (optional) if you want to use background delivery
      }
    }
  }
}
```
3. Build a new Dev Client
4. During runtime check and request permissions with `requestAuthorization`. Failing to request authorization, or requesting a permission you haven't requested yet, will result in the app crashing.

### Native or Expo Bare Workflow
1. `yarn add @kingstinct/react-native-healthkit` (or `npm install @kingstinct/react-native-healthkit`)
2. `npx pod-install`
3. Set `NSHealthUpdateUsageDescription` and `NSHealthShareUsageDescription` in your `Info.plist` 
4. Enable the HealthKit capability for the project in Xcode.
5. Since this package is using Swift you might also need to add a bridging header in your project if you haven't already, you can [find more about that in the official React Native docs](https://reactnative.dev/docs/native-modules-ios#exporting-swift)
6. During runtime check and request permissions with `requestAuthorization`. Failing to request authorization, or requesting a permission you haven't requested yet, will result in the app crashing.

## Usage

Some hook examples:
```TypeScript
import { HKQuantityTypeIdentifier, useHealthkitAuthorization } from '@kingstinct/react-native-healthkit';

const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization([HKQuantityTypeIdentifier.bloodGlucose])

// make sure that you've requested authorization before requesting data, otherwise your app will crash
import { useMostRecentQuantitySample, HKQuantityTypeIdentifier, useMostRecentCategorySample } from '@kingstinct/react-native-healthkit';

const mostRecentBloodGlucoseSample = useMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodGlucose)
const lastBodyFatSample = useMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyFatPercentage)
const lastMindfulSession = useMostRecentCategorySample(HKCategoryTypeIdentifier.mindfulSession)
const lastWorkout = useMostRecentWorkout()
```

Some imperative examples:
```TypeScript
  import HealthKit, { HKUnit, HKQuantityTypeIdentifier, HKInsulinDeliveryReason, HKCategoryTypeIdentifier } from '@kingstinct/react-native-healthkit';

  const isAvailable = await HealthKit.isHealthDataAvailable();

  /* Read latest sample of any data */
  await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bodyFatPercentage]); // request read permission for bodyFatPercentage

  const { quantity, unit, startDate, endDate } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyFatPercentage); // read latest sample
  
  console.log(quantity) // 17.5
  console.log(unit) // %

  /* Listen to data */
  await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.heartRate]); // request read permission for heart rate

  const unsubscribe = HealthKit.subscribeToChanges(HKQuantityTypeIdentifier.heartRate, () => {
    // refetch whichever queries you need
  });

  /* write data */
  await HealthKit.requestAuthorization([], [HKQuantityTypeIdentifier.insulinDelivery]); // request write permission for insulin delivery

  ReactNativeHealthkit.saveQuantitySample(
      HKQuantityTypeIdentifier.insulinDelivery,
      HKUnit.InternationalUnit,
      5.5,
      {
        metadata: {
          // Metadata keys could be arbirtary string to store app-specific data.
          // To use built-in types from https://developer.apple.com/documentation/healthkit/samples/metadata_keys
          // you need to specify string values instead of variable names (by dropping MetadataKey from the name).
          HKInsulinDeliveryReason: HKInsulinDeliveryReason.basal,
        },
      }
    );
```

### HealthKit Anchors (breaking change in 6.0)
In 6.0 you can use HealthKit anchors to get changes and deleted items which is very useful for syncing. This is a breaking change - but a very easy one to handle that TypeScript should help you with. Most queries now return an object containing samples which is what was returned as only an array before. In addition you also get deletedSamples and a newAnchor you can use for more advanced use cases, example:
```TypeScript
  const { newAnchor, samples, deletedSamples } = await queryQuantitySamples(HKQuantityTypeIdentifier.stepCount, {
    limit: 2,
  })

  const nextResult = await queryQuantitySamples(HKQuantityTypeIdentifier.stepCount, {
    limit: 2,
    anchor: newAnchor,
  })

  // etc..
```

## A note on Apple Documentation

We're striving to do as straight a mapping as possible to the Native Libraries. This means that in most cases the Apple Documentation makes sense. However, when it comes to the Healthkit [Metadata Keys](https://developer.apple.com/documentation/healthkit/samples/metadata_keys) the documentation doesn't actually reflect the serialized values. For example HKMetadataKeyExternalUUID in the documentation serializes to HKExternalUUID - which is what we use.

## Clinical Records

For accessing Clinical Records use old version (3.x) or use specific branch ""

## Android alternatives

For a similar library for Android, check out [react-native-health-connect](https://github.com/matinzd/react-native-health-connect/) that works with the new Health Connect. For Google Fit [react-native-google-fit](https://www.npmjs.com/package/react-native-google-fit) seems to be the most popular option, and and another possible option is to work directly with the Google Fit REST API which I've some experience with.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
