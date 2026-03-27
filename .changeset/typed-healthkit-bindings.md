---
'@kingstinct/react-native-healthkit': major
---

Make typed `metadata` the canonical metadata API and generate more of the HealthKit type surface from Apple’s SDK.

This release introduces generated identifier/value/unit metadata, typed metadata payloads on returned models, generic quantity sample typing, and SDK-backed schema verification to keep the surfaced API aligned with the pinned Xcode HealthKit SDK.

Breaking changes:

- Remove the legacy flattened `metadataX` fields from returned models.
- Make `metadata` the single canonical metadata surface.

Migration examples:

- `sample.metadataExternalUUID` -> `sample.metadata.HKExternalUUID`
- `sample.metadataWeatherCondition` -> `sample.metadata.HKWeatherCondition`
- `workout.metadataAverageMETs` -> `workout.metadata.HKAverageMETs`
- `categorySample.metadataMenstrualCycleStart` -> `categorySample.metadata.HKMenstrualCycleStart`

This is intended to make the library easier to extend over time: Apple SDK metadata flows into the generated schema and typed `metadata` surface with much less hand-maintained code.
