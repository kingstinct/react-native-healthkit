---
"@kingstinct/react-native-healthkit": major
---

Fix unbounded memory growth when querying large numbers of samples or statistics (#274), and improve memory management for workout proxies (#370).

### Breaking changes

`source` values embedded in returned data are now plain `{ name, bundleIdentifier }` objects instead of `SourceProxy` HybridObjects:

- `sample.sourceRevision.source` on every sample type (quantity, category, workout, correlation, ECG, heartbeat series, medication, state of mind)
- `QueryStatisticsResponse.sources` and `QueryStatisticsResponseFromSingleSource.source`

Reading `.name` and `.bundleIdentifier` works as before. What no longer works on these values: `toJSON()` (they already are plain JSON), `equals()`, `dispose()`, and passing them into `filter.sources`. To filter by a sample's source, look the source up through `querySources()` by `bundleIdentifier`:

```ts
const sources = await querySources('HKQuantityTypeIdentifierHeartRate')
const source = sources.find(
  (candidate) => candidate.bundleIdentifier === sample.sourceRevision.source.bundleIdentifier,
)
await queryQuantitySamples('HKQuantityTypeIdentifierHeartRate', {
  filter: { sources: source ? [source] : [] },
})
```

`querySources()`, `currentAppSource()` and `filter.sources` keep using `SourceProxy`.

### Memory improvements

- Every serialized sample and every statistics bucket used to allocate a native HybridObject just to carry the source's two strings. react-native-nitro-modules keeps a small bookkeeping record per HybridObject for the lifetime of the JS runtime, so memory grew with every query and never came back. Measured on the #274 access pattern (200 workouts + 10,000 heart-rate samples per fetch, 120 fetches): growth dropped from about 147 MB to about 19 MB.
- `WorkoutProxy` and `SourceProxy` now report an estimated native memory size to the JS engine, so the garbage collector accounts for the `HKWorkout` / `HKSource` graphs they keep alive and collects stale proxies sooner.
- Errors while reading workout route locations are now propagated to the returned promise instead of crashing the app via `try!`.
- New README section on memory considerations, including when to call `dispose()`.
