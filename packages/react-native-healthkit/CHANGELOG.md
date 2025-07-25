# @kingstinct/react-native-healthkit

## 9.0.10
### Patch Changes

- 70cce7b: fix: use proper units in queryStatisticsForQuantity to prevent crashes

## 9.0.9
### Patch Changes

- 52f5a90: - Fix anchor filtering for statistic collection
  - Fix queryCategorySamplesWithAnchor type

## 9.0.8
### Patch Changes

- ca2a033: CI improvements, remove all HKWorkoutSession references

## 9.0.7
### Patch Changes

- ddebbcb: Fix imports

## 9.0.6
### Patch Changes

- b47544c: type improvs

## 9.0.5
### Patch Changes

- 01d7ba7: chore: readd app.plugin.js

## 9.0.4
### Patch Changes

- d9e6bb6: migrate to ts app plugin

## 9.0.3
### Patch Changes

- 6540d54: Remove type: module to make app.config.js work again

## 9.0.2
### Patch Changes

- 97f00b0: fix: add missing prepublish

## 9.0.1

### Patch Changes

- 4cf424b: fix: build issue

## 9.0.0

### Major Changes

There are a lot of under-the-hood changes in version 9.0.0, some of them are breaking (although I've tried to reduce it as much as possible).

- Most of all - the library has been migrated to use react-native-nitro-modules. This improves performance, type-safety and gets rid of a lot of boilerplate code that made it harder to maintain and add features to the library.
- Naming conventions have changed - most of the HK-prefixed stuff has been removed to avoid conflicts on the native side and also make the library more beautiful to look at. As an example the type previously called HKQuantityTypeIdentifier is not just QuantityTypeIdentifier on the library level.
- Less required params by default - making it easier to start using the library, for example calling `queryQuantitySamples('HKQuantityTypeIdentifierStepCount')` will simply return the last 20 samples.
- Flexible filters that map closer to the native constructs. This can easily be extended.
- `deleteObjects` replaces all previous deletion methods, using the new flexible filters.
- Workouts are returned as proxies containing not only data but also functions, for example `getWorkoutRoutes`.
- Identifiers are now just strings, and more strictly typed.
- Units are now just strings.

## [8.7.2](https://github.com/kingstinct/react-native-healthkit/compare/v8.7.1...v8.7.2) (2025-06-14)

### Bug Fixes

- remove unimplemented method leftover ([d5087f4](https://github.com/kingstinct/react-native-healthkit/commit/d5087f4e984e7877150f31981d161b9c8c11583d))

## [8.7.1](https://github.com/kingstinct/react-native-healthkit/compare/v8.7.0...v8.7.1) (2025-06-13)

# [8.7.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.5.0...v8.7.0) (2025-06-12)

### Bug Fixes

- added notation to saveStateOfMindSample ([60b19c5](https://github.com/kingstinct/react-native-healthkit/commit/60b19c5109487976d0d6fae444fe40b3ebbc40ae))
- ensures valence does not exceed -1.0 and 1.0 ([bcec3d6](https://github.com/kingstinct/react-native-healthkit/commit/bcec3d6e07ea91dbe2af5a3aa95cdefc2dbb95cf))
- incorrectly referenced HKStateOfMind.Label. Corrected to HKStateOfMind.Association ([0ec66eb](https://github.com/kingstinct/react-native-healthkit/commit/0ec66eb447d7c6f932d6aec020c497ca4de3b091))
- remove not needed decoder ([4f4dafb](https://github.com/kingstinct/react-native-healthkit/commit/4f4dafbd59c06c93004240aab2a132def4452132))
- replace bridge checks with \_hasListeners check ([1cd2f11](https://github.com/kingstinct/react-native-healthkit/commit/1cd2f116d25bc1041b1a7ba24f3d9f903b9fdd75))

### Features

- add deleteWorkoutSample ([325535b](https://github.com/kingstinct/react-native-healthkit/commit/325535b9cf45b320a6583679595c639a1ed491e6))
- add deleteWorkoutSample example ([10822b6](https://github.com/kingstinct/react-native-healthkit/commit/10822b67938d4a2636ac2dff2c2d87c4481495d8))
- add handler and events support ([21b02ef](https://github.com/kingstinct/react-native-healthkit/commit/21b02ef2a0a6f6e2e2abbf09af2b8ba48eb4726b))
- add workout event support ([12618e7](https://github.com/kingstinct/react-native-healthkit/commit/12618e716fcc76f00e0fbe0dd7d828bb21715c64))
- added saveStateOfMindSample ([a2d4321](https://github.com/kingstinct/react-native-healthkit/commit/a2d43210b9593605be48eb819b31a468d90dcca1))
- make sharable data dynamic ([8f78d16](https://github.com/kingstinct/react-native-healthkit/commit/8f78d162a83d48c108c76cc904ef2f32d260f407))

# [8.5.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.3.0...v8.5.0) (2025-01-23)

### Bug Fixes

- feature flag things requiring XCode 16 ([9427461](https://github.com/kingstinct/react-native-healthkit/commit/94274610f829a52ddeaaefca5a7156d20550819b))

### Features

- add state of mind query ([#120](https://github.com/kingstinct/react-native-healthkit/issues/120)) ([a9059d6](https://github.com/kingstinct/react-native-healthkit/commit/a9059d6e7c07198b97abaf985dc5be021efb220a))

# [8.4.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.3.0...v8.4.0) (2025-01-20)

### Features

- add state of mind query ([#120](https://github.com/kingstinct/react-native-healthkit/issues/120)) ([a9059d6](https://github.com/kingstinct/react-native-healthkit/commit/a9059d6e7c07198b97abaf985dc5be021efb220a))

# [8.3.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.2.0...v8.3.0) (2024-11-29)

### Bug Fixes

- add missing property in tests ([532691d](https://github.com/kingstinct/react-native-healthkit/commit/532691d7072eb67e7f7ddc9ac0bdb13297d91b43))
- fix infinite calls in useStatisticsForQuantity ([2d0b4df](https://github.com/kingstinct/react-native-healthkit/commit/2d0b4df37a897f4a884568366d32750df68ddb00))
- linting error ([5a58db6](https://github.com/kingstinct/react-native-healthkit/commit/5a58db6ec38fcf83e85a5a01dcf53c5ec8087dee))
- rename constants ([b29c6c7](https://github.com/kingstinct/react-native-healthkit/commit/b29c6c7d004da1bac91115d187f1659dac2b3445))

### Features

- add queryStatisticsCollectionForQuantity API ([#111](https://github.com/kingstinct/react-native-healthkit/issues/111)) ([5d70584](https://github.com/kingstinct/react-native-healthkit/commit/5d70584ea78a2f59dd4deb0ef81d8da1e5c21227))
- add support to HKHealthStore startWatchApp method ([d90b298](https://github.com/kingstinct/react-native-healthkit/commit/d90b298aa0234e2a22819ca554041c50b1401337))

# [8.2.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.0.1...v8.2.0) (2024-07-31)

### Bug Fixes

- add exports all the way ([26b9b0b](https://github.com/kingstinct/react-native-healthkit/commit/26b9b0bb0fe58c057482ad26c75d5a00200b1c49))
- continutation edge cases ([43b1863](https://github.com/kingstinct/react-native-healthkit/commit/43b186368666fa163ce90cff6463cbbbf3c294ba))

### Features

- add queryWorkoutSamplesWithAnchor ([c991f5d](https://github.com/kingstinct/react-native-healthkit/commit/c991f5ddaf0e8a416089f663f7acfec543ffcb80))

## [8.1.1](https://github.com/kingstinct/react-native-healthkit/compare/v8.1.0...v8.1.1) (2024-07-04)

### Bug Fixes

- add exports all the way ([2bd1813](https://github.com/kingstinct/react-native-healthkit/commit/2bd18131dfcf8edf3e4795ea456f9bd59cab4b4c))

# [8.1.0](https://github.com/kingstinct/react-native-healthkit/compare/v8.0.1...v8.1.0) (2024-07-04)

### Features

- add queryWorkoutSamplesWithAnchor ([edd2f4b](https://github.com/kingstinct/react-native-healthkit/commit/edd2f4b0d084addc872fdf562b84bcbf34016914))

## [8.0.1](https://github.com/kingstinct/react-native-healthkit/compare/v8.0.0...v8.0.1) (2024-06-17)

### Bug Fixes

- building with xcode <16 ([3a2bf22](https://github.com/kingstinct/react-native-healthkit/commit/3a2bf22df13bf2383150d9c2e996871922e6e57e))

# [8.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v7.3.2...v8.0.0) (2024-06-13)

### Features

- support for iOS 18 types, migrate to bun, bump example-expo to expo 51 with bridgeless mode ([e08eecd](https://github.com/kingstinct/react-native-healthkit/commit/e08eecdaed87f295b6d5c1c0ead25a045eb3f817))
- support new lux HKUnit for iOS 17 ([a546e28](https://github.com/kingstinct/react-native-healthkit/commit/a546e2815a818a5ae785134ae84c552a2d31e931)) by @jgfino
- Update native-types.ts with latest activity types ([ba15194](https://github.com/kingstinct/react-native-healthkit/commit/ba15194e31420d01f9ecf2aad2fc43d15c7a7d65)) by @jstheoriginal

## [7.3.2](https://github.com/kingstinct/react-native-healthkit/compare/v7.3.1...v7.3.2) (2023-10-23)

### Bug Fixes

- platform exports gone wrong ([95e9a84](https://github.com/kingstinct/react-native-healthkit/commit/95e9a84014e261cc21e62d8f9826ead656d48737))

## [7.3.1](https://github.com/kingstinct/react-native-healthkit/compare/v7.3.0...v7.3.1) (2023-10-19)

# [7.3.0](https://github.com/kingstinct/react-native-healthkit/compare/v7.2.0...v7.3.0) (2023-09-13)

### Bug Fixes

- handle when enddate is nil ([1146385](https://github.com/kingstinct/react-native-healthkit/commit/11463857c493091ac0b916d1ee7694f77c7dfe9a))
- return uuid string ([9679e8a](https://github.com/kingstinct/react-native-healthkit/commit/9679e8a12507ba51a6ea4088d421ec9c4e56dfe8))
- swift placeholder for workoutPlanId ([3389e17](https://github.com/kingstinct/react-native-healthkit/commit/3389e17d423926ea6b9b8513822a5510cf1370a8))

### Features

- add more types ([c100a64](https://github.com/kingstinct/react-native-healthkit/commit/c100a6419a766a1aa8126202acd7ad2b98576bb5))
- allow totals in saveWorkoutSamples ([89c57db](https://github.com/kingstinct/react-native-healthkit/commit/89c57dbd5c8d312345f2fbf9c9e28db2d676a733))
- create getWorkoutPlanId function ([ec3d7ef](https://github.com/kingstinct/react-native-healthkit/commit/ec3d7ef62aa6ab1a2fff2a8e34ffd13be5976a71))
- handle when function is called by OS less than 17 ([81a5e01](https://github.com/kingstinct/react-native-healthkit/commit/81a5e01a5f8bbb55e9188c027e9330ad59b0b199))
- move getWorkoutPlan into its own async function ([d72d3e5](https://github.com/kingstinct/react-native-healthkit/commit/d72d3e59f982d0cde5602488fb926e2a7109abcb))
- rename function to getWorkoutPlanById and return id and activity type ([edfecf2](https://github.com/kingstinct/react-native-healthkit/commit/edfecf2b40f6b9f94e8d5fd2995b8ee0ea1b8d7b))
- rename function to getWorkoutPlanById and return id and activity type ([ff252ac](https://github.com/kingstinct/react-native-healthkit/commit/ff252acbf85967952c40780298bdbbe352774b7b))
- saveWorkoutRoute function ([e9eaee8](https://github.com/kingstinct/react-native-healthkit/commit/e9eaee83a556ff0112b19384bc945b4e9ccddade))

# [7.2.0](https://github.com/kingstinct/react-native-healthkit/compare/v7.1.1...v7.2.0) (2023-09-04)

### Features

- saveWorkoutRoute ([8760fb8](https://github.com/kingstinct/react-native-healthkit/commit/8760fb8753c5d1deda4677ccfe0a47050385ff63))

## [7.1.1](https://github.com/kingstinct/react-native-healthkit/compare/v7.1.0...v7.1.1) (2023-09-02)

### Bug Fixes

- xcode 15 build error for workoutKit logic ([16f3d4d](https://github.com/kingstinct/react-native-healthkit/commit/16f3d4dae1cd87d656879b60ed39434d236e3ba7))

# [7.1.0](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.6...v7.1.0) (2023-09-01)

### Bug Fixes

- handle when enddate is nil ([6b675eb](https://github.com/kingstinct/react-native-healthkit/commit/6b675ebd1b4deaa4d4352f90ce05323141ba1d06))
- subscribeToObserverQuery not resolving promise ([83296e1](https://github.com/kingstinct/react-native-healthkit/commit/83296e16a1515db3a82f3a6ee9e2e5c968e1da96))

### Features

- add canImport tags so its backwards compatible ([87688be](https://github.com/kingstinct/react-native-healthkit/commit/87688be53de6b60f5f4edef7807d4f63aeadc984))
- add endDate, uuid and duration to HKWorkoutActivity ([d024ce0](https://github.com/kingstinct/react-native-healthkit/commit/d024ce0fc942e3b65cad0c3ac4b4c9c8516c8a49))
- update HL types for activity summary ([e0fcfdd](https://github.com/kingstinct/react-native-healthkit/commit/e0fcfddcf41910e50dd9b35d0de26439bdfa7cb8))
- update type for HKWorkoutEventType ([b168dea](https://github.com/kingstinct/react-native-healthkit/commit/b168dea75cb3e050eeb914cd2bc92b12f02b848f))

## [7.0.6](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.5...v7.0.6) (2023-08-21)

### Bug Fixes

- remove text-decoration in header ([f0d0423](https://github.com/kingstinct/react-native-healthkit/commit/f0d04239845b37a43e4d191006752a2a4e49d04e))

## [7.0.5](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.4...v7.0.5) (2023-08-03)

### Bug Fixes

- nullability on getMostRecent queries ([4acb077](https://github.com/kingstinct/react-native-healthkit/commit/4acb07737447d3326a17d7aa317123db8ae052b1))

## [7.0.4](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.3...v7.0.4) (2023-06-24)

## [7.0.3](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.2...v7.0.3) (2023-06-18)

### Bug Fixes

- make config plugin work without specifying props ([f7b8bc7](https://github.com/kingstinct/react-native-healthkit/commit/f7b8bc790a2ac6b9066d9a6569ecae7be4583c0c))

## [7.0.2](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.1...v7.0.2) (2023-06-18)

### Bug Fixes

- deserialization of non-anchor queries ([bd8808f](https://github.com/kingstinct/react-native-healthkit/commit/bd8808f35eb0cb63b85357e9d8adf8e977920df8))

## [7.0.1](https://github.com/kingstinct/react-native-healthkit/compare/v7.0.0...v7.0.1) (2023-06-17)

### Bug Fixes

- don’t modify info.plist when not necessary ([672064a](https://github.com/kingstinct/react-native-healthkit/commit/672064a184753c2add8fb54661ebbad128add083))

# [7.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v6.1.0...v7.0.0) (2023-05-31)

### Features

- Fix authorizationStatus return type ([64]https://github.com/Kingstinct/react-native-healthkit/pull/64)
- Re-add queries without anchors - since anchored queries don't support sorting ([65](https://github.com/Kingstinct/react-native-healthkit/pull/65))

### Maintenance

- add swiftlint to pre-commit hook
- remove Android traces - to improve maintainability.

# [6.1.0](https://github.com/kingstinct/react-native-healthkit/compare/v6.0.0...v6.1.0) (2023-04-25)

### Features

- exposing HKHeartbeatSeriesQuery for Heartbeat series data ([e7c3cb2](https://github.com/kingstinct/react-native-healthkit/commit/e7c3cb2c006f9144e4d8c7cd27955621347add0c))

# [6.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v5.4.0...v6.0.0) (2023-03-29)

### Breaking change and new feature

- add support for healthkit anchors ([55](https://github.com/Kingstinct/react-native-healthkit/pull/55))

# [5.4.0](https://github.com/kingstinct/react-native-healthkit/compare/v5.3.0...v5.4.0) (2023-01-03)

### Bug Fixes

- **lint:** fix few changes caused by default formatter ([ebe98a0](https://github.com/kingstinct/react-native-healthkit/commit/ebe98a0d0187056802264c40d9c82cae5ce7d1e0))

### Features

- **hk sources:** add func for fetching hk sources ([3d534b4](https://github.com/kingstinct/react-native-healthkit/commit/3d534b40f1e2560599849f08258bcec1b050dfa4))

# [5.3.0](https://github.com/kingstinct/react-native-healthkit/compare/v5.2.1...v5.3.0) (2022-12-20)

### Bug Fixes

- **lint:** use lint to fix warnings ([f078fc7](https://github.com/kingstinct/react-native-healthkit/commit/f078fc76e6a12ae183ca241cc6bd0593737aad09))

### Features

- add new method deleteSamples ([aad94fa](https://github.com/kingstinct/react-native-healthkit/commit/aad94fa35210e54f9f020b6186479913e7d2661e))
- **example:** add example for deleteSamples method ([64b5f05](https://github.com/kingstinct/react-native-healthkit/commit/64b5f05f16625be80c30091dc2921e28e4680b83))

## [5.2.1](https://github.com/kingstinct/react-native-healthkit/compare/v5.2.0...v5.2.1) (2022-12-08)

### Bug Fixes

- add more sleep types and fixing VO2Max and UVExposure ([207614c](https://github.com/kingstinct/react-native-healthkit/commit/207614c30a19ed4a8b5b5617bddff931dc7308b4))

# [5.2.0](https://github.com/kingstinct/react-native-healthkit/compare/v5.1.1...v5.2.0) (2022-11-07)

### Bug Fixes

- clean test run ([49c81d7](https://github.com/kingstinct/react-native-healthkit/commit/49c81d7fcf75e7e970c6841696c858a5d0e73ce5))
- EventEmitter import ([54c03a6](https://github.com/kingstinct/react-native-healthkit/commit/54c03a69a98ee1deaf8b2873b245b48445035e13))
- improve readme ([326038a](https://github.com/kingstinct/react-native-healthkit/commit/326038a049f2da2c7ce0010c62d0a2d93794db9e))
- make tests pass, make EAS build workflow not wait ([1da9701](https://github.com/kingstinct/react-native-healthkit/commit/1da97015242b4761dd276efbb8b75788f172d716))

### Features

- adding canAccessProtect data and distance to workoutLocation ([b0ce174](https://github.com/kingstinct/react-native-healthkit/commit/b0ce174e3fcd7a289d3dbc8e4aa63408e6326476))

## [5.1.1](https://github.com/kingstinct/react-native-healthkit/compare/v5.1.0...v5.1.1) (2022-09-03)

# [5.1.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-09-02)

### Bug Fixes

- add eas projectId ([ecc067d](https://github.com/kingstinct/react-native-healthkit/commit/ecc067d325f6785c8e4e1cea1a2160ef89edb6e5))
- add expo-updatesa ([a0cea6f](https://github.com/kingstinct/react-native-healthkit/commit/a0cea6f6a636134e06da00a60e903fff12d9c0a2))
- add fonts to native project, fix get workout crash ([b3f5875](https://github.com/kingstinct/react-native-healthkit/commit/b3f587519aee5e1bdcf20bb58d51e22fc3ca614d))
- checkout the PR files as they will look after merge ([7a591da](https://github.com/kingstinct/react-native-healthkit/commit/7a591da85aa7c9d189c52796c33a101da3027c02))
- eslint configuration, fix hooks, improving example app ([4c93e94](https://github.com/kingstinct/react-native-healthkit/commit/4c93e9404a796d164e76c05d1e8529d8fd9849c1))
- specify working directory ([87812b9](https://github.com/kingstinct/react-native-healthkit/commit/87812b9cc56b05e5f0f510aa8b72d864face703f))
- use pull_request_target in PR workflow to enable publishing to expo ([f1e1972](https://github.com/kingstinct/react-native-healthkit/commit/f1e19727e92e5b72d2a22589d32cd4c871805941))
- using more expo-like metro config ([68d6bac](https://github.com/kingstinct/react-native-healthkit/commit/68d6bac3730c22fe78dccadc87c3791684a7b62d))
- workflow fix ([58195df](https://github.com/kingstinct/react-native-healthkit/commit/58195df427e18b777b9e1d768078e651ea6420c2))
- workflow fix ([a9dbba2](https://github.com/kingstinct/react-native-healthkit/commit/a9dbba21a91cedf030279d89d3019d44302ec236))

### Features

- added delete methods for samples ([d48b657](https://github.com/kingstinct/react-native-healthkit/commit/d48b657548bf6a91b9fd2f71a01766b07712dcd9))
- improve example app ([c6840b9](https://github.com/kingstinct/react-native-healthkit/commit/c6840b959c4f01290b89c68f703d33b070388a53))
- improve typings a lot, still trying to get autocompletion with enums/literals just right ([178eb27](https://github.com/kingstinct/react-native-healthkit/commit/178eb2773ac2f01e5bcabc2cd2e0e95b0ce58af3))

## [4.4.6](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

## [4.4.5](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

## [4.4.4](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

## [4.4.3](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

## [4.4.2](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

## [4.4.1](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-19)

# [4.4.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-08-18)

### Bug Fixes

- double conversion ([3848d37](https://github.com/kingstinct/react-native-healthkit/commit/3848d370d53e05d16692e29a65551aff87833564))

### Features

- updating expo example ([c96f976](https://github.com/kingstinct/react-native-healthkit/commit/c96f976b624748b6b94f9c0644fc575639c7d294))
- updating types ([148402d](https://github.com/kingstinct/react-native-healthkit/commit/148402db6cf92a61a11d220a3ec9312d23ce17fb))

# [4.3.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-06-14)

### Features

- add support for workout locations ([f29a3c7](https://github.com/kingstinct/react-native-healthkit/commit/f29a3c71a00d3b503b4c883953d7349cecb8c0d2))
- adding support for missing metadata ([fe31b31](https://github.com/kingstinct/react-native-healthkit/commit/fe31b31484ee5c1a5779556cfb392b31b85bf5f2))
- rename swift to getWorkoutRoutes ([636fac6](https://github.com/kingstinct/react-native-healthkit/commit/636fac6aef281e09f5f467dd5ada9f0e9f347187))
- rename to getWorkoutRoutes ([8d384be](https://github.com/kingstinct/react-native-healthkit/commit/8d384be4a01fa8a66604c61fd8aed09b5d3f790e))
- updating metadata for routes ([6633c37](https://github.com/kingstinct/react-native-healthkit/commit/6633c371dde086164f3fdf63dc57b651b3ac0986))

### Reverts

- Revert "Add husky, rn-native-hash and dev-client action" ([7ebee37](https://github.com/kingstinct/react-native-healthkit/commit/7ebee3795d285cd77817fb442d7b68b316959d50))

# [4.2.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2022-05-20)

### Bug Fixes

- fixed mismatched objc method signatures between .m and .swift files ([2bae174](https://github.com/kingstinct/react-native-healthkit/commit/2bae17409e6a9337bd7b2ebd441a2b7fddc3b3d9))
- lint issues ([0cbeb22](https://github.com/kingstinct/react-native-healthkit/commit/0cbeb225d3632e9bb67cbf761c6642f82fbc171b))
- updated react-native-paper to version 4.0.0 to fix typescript bindings issue ([f00c287](https://github.com/kingstinct/react-native-healthkit/commit/f00c287c535fbd8f57129638e9e1c88398d9796b))

## [4.1.1](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2021-06-27)

# [4.1.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2021-03-12)

### Bug Fixes

- badge text and bump packages ([f741145](https://github.com/kingstinct/react-native-healthkit/commit/f74114557ef8778ff88f268a6e27a10a5b1396e9))

### Features

- add sourceRevision info to HK samples ([36b9bd2](https://github.com/kingstinct/react-native-healthkit/commit/36b9bd2036b03fa718d67466fc9fc3619d2a93d2))

## [4.0.1](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2021-03-10)

# [4.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2021-01-16)

### Bug Fixes

- removed references to clinical records ([49b392a](https://github.com/kingstinct/react-native-healthkit/commit/49b392a9dffefbcbd4094629e4ccb1ca07df256b))

# [3.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2021-01-01)

### Bug Fixes

- Fix diabetes related methods ([f6a320e](https://github.com/kingstinct/react-native-healthkit/commit/f6a320ee0b966da1beb6bdbef03860789cae7c36))
- note on metadata keys ([e9aa91e](https://github.com/kingstinct/react-native-healthkit/commit/e9aa91ed778445cda5921cf0673f9942cb1453c4))

# [2.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-07-02)

## [1.0.1](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-06-30)

# [1.0.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-06-30)

# [0.3.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-06-29)

# [0.2.0](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-06-28)

## [0.1.1](https://github.com/kingstinct/react-native-healthkit/compare/v4.4.6...v5.1.0) (2020-06-26)

### Bug Fixes

- added requiresMainQueueSetup ([7fc1c2c](https://github.com/kingstinct/react-native-healthkit/commit/7fc1c2cfcda2bb75d881f879d162c8494827fbfa))

### Features

- first stable release ([9467bc2](https://github.com/kingstinct/react-native-healthkit/commit/9467bc2ec88b0ca821c6f5c084c5ba6118cf7a7b))
