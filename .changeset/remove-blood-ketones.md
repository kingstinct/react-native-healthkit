---
"@kingstinct/react-native-healthkit": minor
---

Remove `HKQuantityTypeIdentifierBloodKetones` from `QuantityTypeIdentifier`. Apple has never shipped a blood ketones quantity type: it is absent from `HKTypeIdentifiers.h` in every SDK and `HKQuantityType.quantityType(forIdentifier:)` returns nil for it at runtime, so any query or authorization request using it always failed. The identifier had been added from an issue citing a non-existent Apple docs page and was later pinned back in via a generator override. The override mechanism and the `'mmol/L'` member of `BloodGlucoseUnit` that only existed for it are removed as well.
