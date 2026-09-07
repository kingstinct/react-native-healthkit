---
"@kingstinct/react-native-healthkit": minor
---

`sourceRevision.source` on samples is now a plain `{ name, bundleIdentifier }` object instead of a `SourceProxy` HybridObject. Every serialized sample used to allocate a native HybridObject just to carry two strings, which is what made memory grow without bound when querying large numbers of samples (#274). Reading `source.name` and `source.bundleIdentifier` works as before; `source.toJSON()` is no longer available (the object already is plain JSON). `getSources()`, `currentAppSource()` and statistics-per-source results still return `SourceProxy` instances.
