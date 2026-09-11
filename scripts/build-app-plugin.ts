/**
 * Compiles `<package>/app.plugin.ts` into `<package>/app.plugin.js`.
 *
 * Expo only loads `app.plugin.js` from a package root (see `pluginFileName` in
 * @expo/config-plugins), so the `.ts` source is never read by consumers. This
 * script produces the (gitignored) `.js` from the `.ts`. It runs from each
 * package's `build` script (and therefore from `codegen` and `prepublishOnly`,
 * so published tarballs always carry a fresh copy) and from the root
 * `postinstall`, so the example app can resolve the plugin right after
 * `bun install`.
 *
 * Usage:
 *   bun scripts/build-app-plugin.ts [<package dir or app.plugin.ts>...]
 *
 * With no paths it builds the package in the current directory.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const targets = process.argv.slice(2)
const packageDirs = (targets.length > 0 ? targets : [process.cwd()]).map(
  (target) => {
    const absolute = resolve(target)
    return statSync(absolute).isDirectory() ? absolute : dirname(absolute)
  },
)

const HEADER = [
  '// GENERATED FILE - do not edit by hand (gitignored).',
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
}
