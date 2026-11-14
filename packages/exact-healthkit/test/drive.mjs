// The package's conformance drives on an iOS simulator, under Exact's agent
// over fixture/health.json: an app `exact new` makes outside this repo, its
// files replaced by test/fixture's, with this package copied in as a
// registry would install it.
//
// usage: EXACT_DIR=<exact checkout> bun test/drive.mjs [--sim <udid>] [--dir <path>] [--keep]
//   EXACT_DIR names a checkout that has run `bun scripts/exact.mjs setup`.
//   --dir puts the app (and its few GB of build) there instead of the temp dir.
//   --keep leaves the app (its path printed) for another run or a look.
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const pkg = resolve(import.meta.dir, '..')
const exact = process.env.EXACT_DIR
if (!exact) {
  console.error(
    'EXACT_DIR names an Exact checkout (github.com/expo/exact) that ran `bun scripts/exact.mjs setup`',
  )
  process.exit(2)
}
const args = process.argv.slice(2)
const sim = args.includes('--sim') ? args[args.indexOf('--sim') + 1] : undefined
const keep = args.includes('--keep')
const parent = args.includes('--dir')
  ? resolve(args[args.indexOf('--dir') + 1])
  : tmpdir()

const run = (cmd, argv, cwd, env = process.env) => {
  const r = spawnSync(cmd, argv, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 1 << 26,
  })
  if (r.status !== 0)
    throw new Error(
      `${cmd} ${argv.join(' ')}: ${r.stdout?.slice(-3000)}\n${r.stderr?.slice(-3000)}`,
    )
  return r.stdout
}

// The app, with the package installed as a real directory: a drive refuses
// linked static files.
mkdirSync(parent, { recursive: true })
const dir = mkdtempSync(join(parent, 'exact-healthkit-'))
const app = join(dir, 'hkfixture')
run(
  'bun',
  [
    resolve(exact, 'scripts/exact.mjs'),
    'new',
    app,
    '--name',
    'HK Conformance',
    '--bundle-id',
    'com.kingstinct.exacthkconformance',
  ],
  exact,
)
cpSync(join(pkg, 'test/fixture'), app, { recursive: true })
rmSync(join(app, 'app.test.contract'), { force: true })
const manifest = JSON.parse(readFileSync(join(app, 'app.json'), 'utf8'))
manifest.privacy_policy = 'https://example.com/privacy'
writeFileSync(join(app, 'app.json'), JSON.stringify(manifest, null, 2))
writeFileSync(
  join(app, 'app.ts'),
  readFileSync(join(app, 'app.ts'), 'utf8').replace(
    '__APP_ID__',
    manifest.app.id,
  ),
)
const installed = join(app, 'node_modules/@kingstinct/exact-healthkit')
mkdirSync(installed, { recursive: true })
for (const f of ['package.json', 'exact.json', 'apple', 'fixture'])
  cpSync(join(pkg, f), join(installed, f), { recursive: true })
const deps = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'))
deps.dependencies = {
  ...deps.dependencies,
  '@kingstinct/exact-healthkit': `file:${pkg}`,
}
writeFileSync(join(app, 'package.json'), JSON.stringify(deps, null, 2))
console.log(`app: ${app}`)
run(
  'bun',
  ['exact.mjs', 'ios', '--no-install', ...(sim ? ['--sim', sim] : [])],
  app,
)

let failed = 0
const check = (what, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${ok ? '' : `: ${detail}`}`)
  if (!ok) failed++
}

/** One launch on 14 October 2026: the texts of the last tree, by testId, per tree op. */
function drive(storage, ops) {
  const r = spawnSync(
    'bun',
    [
      'exact.mjs',
      'agent',
      'ios',
      '--json',
      ...(sim ? ['--sim', sim] : []),
      '--storage',
      storage,
      '--reset-storage',
      '--epoch',
      '2026-10-14T12:00:00Z',
      ...ops,
    ],
    { cwd: app, encoding: 'utf8', maxBuffer: 1 << 26 },
  )
  const trees = (r.stdout ?? '')
    .split('\n')
    .filter((l) => l.startsWith('{'))
    .map((l) => JSON.parse(l))
    .filter((t) => t?.nodes)
  if (!trees.length) console.log(r.stdout?.slice(-3000), r.stderr?.slice(-3000))
  return trees.map((tree) => {
    const byId = new Map(tree.nodes.map((n) => [n.id, n]))
    const text = (n) =>
      n
        ? (n.props?.text ??
          (n.children ?? []).map((c) => text(byId.get(c))).join(''))
        : ''
    return Object.fromEntries(
      tree.nodes
        .filter((n) => n.props?.testId)
        .map((n) => [n.props.testId, text(n)]),
    )
  })
}

const ask = ['clock settle', 'tree', 'tap ask', 'clock +100']
const save = ['tap save', 'clock +300', 'clock settle', 'tree']

// Allowed: every read answers the fixture, and a save is read back.
{
  const [before, allowed, saved] = drive(`allow-${Date.now()}`, [
    ...ask,
    'tap @permission allow',
    'clock +300',
    'clock settle',
    'tree',
    ...save,
  ])
  check(
    'before asking, a read fails naming the request',
    before?.['steps-error'] === 'NotAllowedError',
    JSON.stringify(before),
  )
  check(
    "the fixture's steps: 24 samples, 55,449",
    allowed?.['step-samples'] === '24' && allowed?.['step-sum'] === '55449',
    JSON.stringify(allowed),
  )
  check(
    'statistics sum the same',
    allowed?.total === '55449 count',
    allowed?.total,
  )
  check(
    'a date filter with noneOf',
    allowed?.filtered === '640,420,200,90,40,22',
    allowed?.filtered,
  )
  check(
    'heart rate in count/min and a daily maximum',
    allowed?.heart === '58,74,142,61 max 142',
    allowed?.heart,
  )
  check(
    'sleep, workouts and a characteristic',
    allowed?.sleep === '3' &&
      allowed?.workouts === '37,13' &&
      allowed?.sex === '2',
    JSON.stringify(allowed),
  )
  check(
    'a save is read back, by samples and statistics',
    saved?.['step-samples'] === '25' && saved?.total === '56449 count',
    JSON.stringify(saved),
  )
}

// Denied: as HealthKit answers, reads succeed with only what the app wrote.
{
  const [, denied, saved] = drive(`deny-${Date.now()}`, [
    ...ask,
    'tap @permission deny',
    'clock +300',
    'clock settle',
    'tree',
    ...save,
  ])
  check(
    'denied reads answer nothing, and no error says so',
    denied?.['step-samples'] === '0' &&
      denied?.['steps-error'] === '' &&
      denied?.sex === '0',
    JSON.stringify(denied),
  )
  check(
    "the app's own save is still read",
    saved?.['step-samples'] === '1' && saved?.total === '1000 count',
    JSON.stringify(saved),
  )
}

if (!keep) rmSync(dir, { recursive: true, force: true })
console.log(failed ? `${failed} failed` : 'all passed')
process.exit(failed ? 1 : 0)
