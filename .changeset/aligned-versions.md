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
the same version, the two dependent packages require
`@react-native-healthkit/core` within the same major, and their podspecs
require a core pod of the same major. A mismatched install now fails at `pod
install` with a message naming both pods.

Because the group adopts the highest version in it, this release moves
`@react-native-healthkit/core` and `@react-native-healthkit/health-records` up
to the main package's number. The jump is a renumbering, not a redesign: apart
from the changes described in the other entries of this release, the two
packages are what they were at 0.0.1 and 0.1.0. Upgrade the packages you use
together; mixing majors across the family is no longer supported.
