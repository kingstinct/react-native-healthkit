---
"@kingstinct/react-native-healthkit": major
"@react-native-healthkit/core": major
"@react-native-healthkit/health-records": major
---

chore: release the three packages on a single, shared version from now on

`@kingstinct/react-native-healthkit`, `@react-native-healthkit/core` and
`@react-native-healthkit/health-records` compile into one another's binary
through the `ReactNativeHealthkitCore` pod, and nothing in CocoaPods or npm
could previously detect a mismatched combination: the packages declared the
core pod without a version and the core package with an open-ended range, so an
incompatible pair failed as a Swift compile error deep inside `Pods`.

They are now a changesets `fixed` group: every release publishes all three at
the same version, and the lock is enforced at both levels.

On npm, `@react-native-healthkit/core` moved from a peer dependency with an
open-ended range to a **regular dependency pinned to an exact version**. Your
package manager now installs the one matching core for you, there is no version
for you to keep in sync, and an incompatible combination cannot be resolved in
the first place. Expo autolinks it through that dependency, so most apps no
longer need to mention core at all; a bare React Native app still lists it,
because the React Native CLI only autolinks packages named in the app's own
`package.json`.

In CocoaPods, each dependent podspec requires a core pod of exactly its own
version, so anything that slips past npm, such as a mixed-version family with
the main package at 16.0.0 beside health records at 16.1.0, fails at `pod
install` with a version conflict naming both pods rather than as a Swift
compile error or a runtime surprise.

An exact *peer* range was the obvious alternative and is the one thing that does
not work here: changesets treats a peer dependency leaving its range as breaking
for its dependents, and the fixed group then lifts everyone to that type, so any
minor anywhere in the family would come out as a major. A regular dependency has
no such feedback loop.

Because the group adopts the highest version in it, this release moves
`@react-native-healthkit/core` and `@react-native-healthkit/health-records` up
to the main package's number. The jump is a renumbering, not a redesign: apart
from the changes described in the other entries of this release, the two
packages are what they were at 0.0.1 and 0.1.0. Upgrade the packages you use
together; mixing majors across the family is no longer supported.
