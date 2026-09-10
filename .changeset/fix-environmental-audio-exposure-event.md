---
"@kingstinct/react-native-healthkit": patch
---

Fix `HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent` failing with "unrecognized categoryType". Apple's `HKCategoryTypeIdentifier.environmentalAudioExposureEvent` constant still carries the pre-iOS 14 raw string `HKCategoryTypeIdentifierAudioExposureEvent`, so building the identifier from the modern name as a raw string made `categoryType(forIdentifier:)` return nil. The native side now maps the modern name to Apple's constant for queries, authorization, and background delivery, and maps samples read back from HealthKit to the modern identifier. Note that samples of this type now report `HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent` as their `categoryType` and `sampleType.identifier`, even when queried through the deprecated `HKCategoryTypeIdentifierAudioExposureEvent` alias.
