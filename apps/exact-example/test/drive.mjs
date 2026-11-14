// The example's flows once Health access is allowed, driven on an iOS
// simulator under Exact's agent over @kingstinct/exact-healthkit's fixture.
// app.test.contract covers what shows before; a test file cannot answer the
// permission ticket, so these are agent drives.
//
// usage: bun test/drive.mjs [--sim <udid>]   (from apps/exact-example)
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const app = resolve(import.meta.dir, '..')
const args = process.argv.slice(2)
const sim = args.includes('--sim')
  ? ['--sim', args[args.indexOf('--sim') + 1]]
  : []

let failed = 0
const check = (what, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${ok ? '' : `: ${detail}`}`)
  if (!ok) failed++
}

/** One launch at `epoch` in UTC: each tree's texts by testId, and each visible text in order. */
function drive(epoch, ops) {
  const r = spawnSync(
    'bun',
    [
      'exact.mjs',
      'agent',
      'ios',
      '--json',
      ...sim,
      '--storage',
      `drive-${Date.now()}`,
      '--reset-storage',
      '--epoch',
      epoch,
      '--time-zone',
      'UTC',
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
    const shown = tree.nodes
      .filter((n) => typeof n.props?.text === 'string' && !n.hidden)
      .map((n) => n.props.text)
    return {
      ids: Object.fromEntries(
        tree.nodes
          .filter((n) => n.props?.testId)
          .map((n) => [n.props.testId, text(n)]),
      ),
      shown,
    }
  })
}

const allow = [
  'clock settle',
  'tap allow-today',
  'clock +100',
  'tap @permission allow',
  'clock +300',
  'clock settle',
]

{
  const [today, workouts, workout] = drive('2026-10-13T20:00:00Z', [
    ...allow,
    'tree',
    'tap tab-workouts',
    'clock settle',
    'tree',
    'tap workout-00000000-0000-4000-8004-000000000001',
    'clock settle',
    'tree',
  ])
  const t = today?.ids ?? {}
  check(
    'Today: no steps on the 13th yet, the 12th in the week',
    t.steps === '0' && t['day-2026-10-12']?.endsWith('8,402'),
    JSON.stringify(t),
  )
  check(
    'Today: the week runs back to the 7th',
    t['day-2026-10-07']?.endsWith('9,480') && !('day-2026-10-06' in t),
    JSON.stringify(t),
  )
  check(
    'Workouts: newest first',
    JSON.stringify(
      workouts?.shown.filter((s) => ['Cycling', 'Running'].includes(s)),
    ) === '["Cycling","Running"]',
    JSON.stringify(workouts?.shown),
  )
  const w = workout?.ids ?? {}
  check(
    'a workout: duration, energy and distance',
    w['workout-minutes'] === '45 min' &&
      w['workout-energy'] === '412 kcal' &&
      w['workout-distance'] === '7.2 km',
    JSON.stringify(w),
  )
}

{
  const [today, log] = drive('2026-10-12T20:00:00Z', [
    ...allow,
    'tree',
    'tap tab-log',
    'clock settle',
    'type weight-input 71.9',
    'tap save-weight',
    'clock data',
    'clock +300',
    'clock settle',
    'clock data',
    'tree',
  ])
  const t = today?.ids ?? {}
  check(
    "Today: the 12th's activity",
    t.steps === '8,402' &&
      t.energy === '577 kcal' &&
      t.distance === '9.6 km' &&
      t['heart-rate'] === '61 bpm',
    JSON.stringify(t),
  )
  const shown = log?.shown ?? []
  check(
    'Log: a saved weight is read back first',
    shown.indexOf('71.9 kg') >= 0 &&
      shown.indexOf('71.9 kg') < shown.indexOf('72.4 kg'),
    JSON.stringify(shown),
  )
  check(
    'Log: the field clears after a save',
    log?.ids['weight-input'] === '',
    JSON.stringify(log?.ids),
  )
}

console.log(failed ? `${failed} failed` : 'all passed')
process.exit(failed ? 1 : 0)
