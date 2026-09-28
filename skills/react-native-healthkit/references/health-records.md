# Clinical health records (`@react-native-healthkit/health-records`)

This is a separate package for HealthKit clinical records: allergies, conditions, immunizations, lab results, medications, procedures, vital signs, clinical notes and coverage. Records are delivered as FHIR resources. It is **read-only**, works standalone or alongside `@kingstinct/react-native-healthkit`, and must be on the **same version** as it.

## Constraints to tell the user up front

- Health Records only exist in [regions where Apple supports them](https://support.apple.com/en-us/HT208680), and only when the user has connected a provider in the Health app.
- The simulator always reports `supportsHealthRecords() === false`. You need a real device with a connected provider to see data.
- Your App ID needs the **Clinical Health Records** HealthKit capability, or signing fails. Apple reviews apps using it more strictly: explain the use in your usage string and App Review notes.

## Setup

```sh
npx expo install @react-native-healthkit/health-records react-native-nitro-modules
```

```json
["@react-native-healthkit/health-records", {
  "NSHealthClinicalHealthRecordsShareUsageDescription": "Used to show your lab results in the app"
}]
```

The plugin:
- adds the HealthKit entitlement and appends `health-records` to `com.apple.developer.healthkit.access`;
- sets `NSHealthClinicalHealthRecordsShareUsageDescription`, and `NSHealthShareUsageDescription` if the main plugin isn't used;
- adds background delivery unless `background: false`.

**Bare RN:**
1. Add `@react-native-healthkit/core` to `package.json`.
2. Run `pod install`.
3. Enable the HealthKit capability with **Clinical Health Records** ticked.
4. Add the Info.plist key.

## Usage

```ts
import {
  supportsHealthRecords,
  requestAuthorization,
  queryClinicalRecords,
  queryClinicalRecordsWithAnchor,
  subscribeToClinicalRecordChanges,
  parseFHIRResourceData,
} from '@react-native-healthkit/health-records'

if (supportsHealthRecords()) {
  // NOTE: takes an array of clinical types (read-only), unlike the main package's { toRead, toShare }
  await requestAuthorization(['HKClinicalTypeIdentifierLabResultRecord', 'HKClinicalTypeIdentifierAllergyRecord'])

  const labs = await queryClinicalRecords('HKClinicalTypeIdentifierLabResultRecord', { limit: 0, ascending: false })
  for (const r of labs) {
    r.displayName                  // "Hemoglobin A1c"
    r.fhirResource?.resourceType   // "Observation"
    const fhir = parseFHIRResourceData(r) // parsed FHIR JSON (typed generic), or undefined
  }

  const { records, deletedRecords, newAnchor } = await queryClinicalRecordsWithAnchor(
    'HKClinicalTypeIdentifierConditionRecord', { limit: 0, anchor: storedAnchor },
  )

  const sub = subscribeToClinicalRecordChanges('HKClinicalTypeIdentifierImmunizationRecord', () => refetch())
  sub.remove()
}
```

- Clinical types: `HKClinicalTypeIdentifier{Allergy,ClinicalNote,Condition,Coverage,Immunization,LabResult,Medication,Procedure,VitalSign}Record`. `AllClinicalTypeIdentifiers` lists them all.
- Filters: `uuid`, `uuids`, `date`, `metadata` and `fhirResourceType`, combinable with `AND` / `OR` / `NOT`.
- FHIR version varies by provider (DSTU2 or R4). Check `record.fhirResource?.fhirVersion` before assuming a schema.
- Hooks:
  - `useHealthRecordsAuthorization(types)` returns `[status, request]`.
  - `useClinicalRecords(type, options?)` returns `{ records, error, refetch }`.
  - `useSubscribeToClinicalRecordChanges(type, onChange)`.
- Background: `configureBackgroundTypes(types, UpdateFrequency.immediate)` / `clearBackgroundTypes()`. This works like the main package (see [subscriptions-and-background.md](subscriptions-and-background.md)).

## Apple references

- [Accessing Health Records](https://developer.apple.com/documentation/healthkit/accessing-health-records.md)
- [HKClinicalRecord](https://developer.apple.com/documentation/healthkit/hkclinicalrecord.md)
- [NSHealthClinicalHealthRecordsShareUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthclinicalhealthrecordsshareusagedescription.md)
- [HealthKit access entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.access.md)
