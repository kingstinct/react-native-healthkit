// Writes apple/Tables.swift from react-native-healthkit's HealthKit schema
// (packages/react-native-healthkit/src/generated/healthkit-schema.json), so
// both packages agree on which types are read-only, each quantity type's
// canonical unit and the metadata keys whose values are flags or numbers,
// and compiles in the agent store's default fixture.
// Run with `bun scripts/tables.mjs` (`--check` fails when it is stale).
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const here = import.meta.dir
const schema = JSON.parse(
  readFileSync(
    join(
      here,
      '../../react-native-healthkit/src/generated/healthkit-schema.json',
    ),
    'utf8',
  ),
)

const quote = (s) => JSON.stringify(s)
const readOnly = [
  ...schema.quantityIdentifiers.filter((q) => !q.writeable).map((q) => q.name),
  ...schema.categoryIdentifiers.filter((c) => !c.writeable).map((c) => c.name),
].sort()
const units = schema.quantityIdentifiers
  .filter((q) => q.canonicalUnit)
  .map((q) => [q.name, q.canonicalUnit])
  .sort(([a], [b]) => a.localeCompare(b))
const keysOf = (kinds) =>
  schema.metadataKeys
    .filter((m) => kinds.includes(m.valueKind))
    .map((m) => m.rawKey)
    .sort()

const lines = [
  "// Written by scripts/tables.mjs from react-native-healthkit's HealthKit",
  '// schema; never edited by hand.',
  '#if os(iOS)',
  'enum Tables {',
  '    /// Types HealthKit lets no app write: asking to share one raises.',
  '    static let readOnly: Set<String> = [',
  ...readOnly.map((id) => `        ${quote(id)},`),
  '    ]',
  '',
  "    /// Each quantity type's canonical unit, as HealthKit's documentation names it.",
  '    static let canonicalUnits: [String: String] = [',
  ...units.map(([id, unit]) => `        ${quote(id)}: ${quote(unit)},`),
  '    ]',
  '',
  '    /// Metadata keys whose NSNumber is a flag.',
  '    static let booleanMetadataKeys: Set<String> = [',
  ...keysOf(['boolean']).map((k) => `        ${quote(k)},`),
  '    ]',
  '',
  "    /// Metadata keys whose NSNumber is a number or an enum's raw value.",
  '    static let numericMetadataKeys: Set<String> = [',
  ...keysOf(['number', 'enum']).map((k) => `        ${quote(k)},`),
  '    ]',
  '}',
  '#endif',
  '',
]

// The default agent fixture, compiled in: a simulator app may not read the
// package's files (an external volume, a sandbox), so it never has to.
const fixture = JSON.stringify(
  JSON.parse(readFileSync(join(here, '..', 'fixture', 'health.json'), 'utf8')),
)
lines.splice(
  lines.length - 3,
  0,
  '',
  "    /// fixture/health.json, the agent store's default.",
  `    static let defaultFixture = ${JSON.stringify(fixture)}`,
)

const out = lines.join('\n')
const path = join(here, '..', 'apple', 'Tables.swift')
if (process.argv.includes('--check')) {
  if (readFileSync(path, 'utf8') !== out) {
    console.error('apple/Tables.swift is stale: run `bun scripts/tables.mjs`')
    process.exit(1)
  }
} else {
  writeFileSync(path, out)
  console.log(
    `wrote ${path}: ${readOnly.length} read-only types, ${units.length} units`,
  )
}
