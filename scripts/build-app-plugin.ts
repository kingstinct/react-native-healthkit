/**
 * Compiles `<package>/app.plugin.ts` into `<package>/app.plugin.js`.
 *
 * Expo only loads `app.plugin.js` from a package root (see `pluginFileName` in
 * @expo/config-plugins), so the `.ts` source is never read by consumers. This
 * script keeps the committed `.js` in lockstep with the `.ts`; it runs from
 * each package's `build` script (and therefore from `codegen` and
 * `prepublishOnly`), from the pre-commit hook, and from CI (`check:plugins`).
 *
 * Usage:
 *   bun scripts/build-app-plugin.ts [--stage] [<package dir or app.plugin.ts>...]
 *
 * With no paths it builds the package in the current directory. `--stage`
 * runs `git add` on each regenerated `.js` (used by lint-staged, which passes
 * the staged `app.plugin.ts` paths as arguments).
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
const stage = args.includes('--stage')
const targets = args.filter((arg) => arg !== '--stage')
const packageDirs = (targets.length > 0 ? targets : [process.cwd()]).map(
  (target) => {
    const absolute = resolve(target)
    return statSync(absolute).isDirectory() ? absolute : dirname(absolute)
  },
)

const HEADER = [
  '// GENERATED FILE - do not edit by hand.',
  '// Compiled from app.plugin.ts by `bun run build:plugin`.',
  '// Expo loads this file, not the .ts source, so edit app.plugin.ts and rebuild.',
  '',
].join('\n')

const run = (command: string, commandArgs: readonly string[], cwd: string) => {
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(
      `[build-app-plugin] \`${command} ${commandArgs.join(' ')}\` failed in ${relative(process.cwd(), cwd) || '.'}`,
    )
    process.exit(result.status ?? 1)
  }
}

for (const packageDir of packageDirs) {
  run('bunx', ['tsc', '-p', 'tsconfig.plugin.json'], packageDir)

  const compiled = readFileSync(
    join(packageDir, 'lib', 'plugin', 'app.plugin.js'),
    'utf8',
  )
  const output = join(packageDir, 'app.plugin.js')
  writeFileSync(output, HEADER + compiled)
  console.log(`[build-app-plugin] wrote ${relative(process.cwd(), output)}`)

  if (stage) {
    run('git', ['add', '--', output], packageDir)
  }
}
