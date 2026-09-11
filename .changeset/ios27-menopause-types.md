---
"@kingstinct/react-native-healthkit": minor
---

Add iOS 27 category types `HKCategoryTypeIdentifierMenopausalState` and `HKCategoryTypeIdentifierBleedingAfterMenopause`. Fix the schema generator to read `HKWorkoutActivityType` from its relocated header (`HKWorkoutActivityType.h`) on iOS 27 SDKs — where it moved out of `HKWorkout.h` — and add a verify guard so the enum can't silently drop again.
