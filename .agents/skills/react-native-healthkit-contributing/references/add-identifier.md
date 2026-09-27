# Adding or updating HealthKit identifiers

Nothing is declared by hand. `packages/react-native-healthkit/scripts/generate-healthkit-cli.ts` reads the iOS SDK's HealthKit symbol graph and headers, then writes:

| Output (committed) | Contains |
| --- | --- |
| `src/generated/healthkit-schema.json` | One entry per identifier: `name`, `ios` (min version), `canonicalUnit`, `aggregationStyle`, `writeable`, `legacy` |
| `src/generated/healthkit.generated.ts` | Identifier unions (`QuantityTypeIdentifierWriteable` / `ReadOnly`, category equivalents), `QUANTITY_IDENTIFIER_IOS_AVAILABILITY`, `QUANTITY_IDENTIFIER_CANONICAL_UNITS`, `QuantityUnitByIdentifierMap`, `CATEGORY_IDENTIFIER_*`, `CategoryValue*` enums, `CategoryValueByIdentifierMap`, `WorkoutActivityType`, metadata key interfaces |
| `apps/example/contracts/generated/healthkit.contract.generated.ts` | zod metadata schemas for the contract tests |
| `ios/generated/HealthkitGenerated.swift` | Boolean and numeric metadata-key sets used for serialization |

`src/types/QuantityTypeIdentifier.ts` and `CategoryTypeIdentifier.ts` only re-export from the generated file. No Swift list needs updating either: `packages/core/ios/TypeIdentifiers.swift` resolves identifiers by prefix at runtime.

## Steps

1. **Requires macOS** with an Xcode whose iOS SDK contains the new symbol. Check it with `xcrun --sdk iphonesimulator --show-sdk-version`. Alternatively, point `HEALTHKIT_SDK_PATH` at an SDK.
2. Regenerate:
   ```sh
   cd packages/react-native-healthkit
   bun run generate:healthkit     # writes the four outputs and runs biome on them
   bun run verify:healthkit-sdk   # regression asserts (SleepAnalysis→HKCategoryValueSleepAnalysis, BloodGlucose unit mg/dL, ...)
   ```
3. Review the diff. Expected changes are limited to the generated files. Check the new entry's `ios` version, `canonicalUnit`, `aggregationStyle` and `writeable`.
4. Fix up the generator's knowledge when needed:
   - **Should be read-only but is generated writeable** (Apple-computed data): add it to `scripts/healthkit-schema/identifier-overrides.json` (`quantity.readOnly` / `category.readOnly`).
   - **Unit type falls back to `string`**: extend `canonicalUnitToTypeNode()` in `scripts/generate-healthkit.ts` to map the canonical unit to a type from `src/types/Units.ts`.
   - **New category value enum is not picked up**: check the value-enum mapping in `generate-healthkit.ts`, then add an assert in `verify-healthkit-sdk.ts`.
5. Optional but recommended:
   - Add the identifier to `apps/example/constants/AllUsedIdentifiersInApp.ts` so the example app requests it.
   - Extend `src/type-tests/generated-typing.ts` if you changed typing rules.
6. Run `bun run check:generated`: generate, verify, then `git diff --exit-code` on the outputs. CI runs this on the newest-Xcode runner, so committed output must match the **newest** SDK. Don't regenerate with an older Xcode; it would drop identifiers.
7. Add a changeset: `minor` for new identifiers, e.g. `'@kingstinct/react-native-healthkit': minor`.

## Things to know

- Identifiers newer than a device's iOS stay in the TS union. At runtime:
  - `requestAuthorization` filters them out with a warning;
  - queries throw;
  - users gate them with `isObjectTypeAvailable`.
- Don't add runtime version tables by hand. Availability comes from the SDK's `availability` attributes.
- `AvailableQuantityTypes<T>` / `QuantityTypesIOS17Plus` in `src/healthkit.ios.ts` are hand-maintained and only cover the iOS 17 split. Don't extend that pattern. Prefer the generated availability maps.
- Deprecated or renamed identifiers (e.g. `AudioExposureEvent` → `EnvironmentalAudioExposureEvent`) need a special case in `packages/core/ios/TypeIdentifiers.swift`.
- To find Apple's page for an identifier, strip the prefix and lowercase the first letter, then append `.md`: `https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd.md`.
- Template commits: `029edee` (RMSSD, pure regeneration) and `4a4238e` (menopause category types, with generator changes).
