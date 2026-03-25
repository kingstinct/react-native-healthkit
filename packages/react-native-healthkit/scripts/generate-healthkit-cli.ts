import { execFileSync } from 'node:child_process'
import {
  buildHealthkitSchemaFromSources,
  renderGeneratedTypescript,
} from './generate-healthkit'
import {
  formatGeneratedArtifacts,
  GENERATED_SCHEMA_PATH,
  GENERATED_SWIFT_PATH,
  loadHealthkitSdkSources,
  writeGeneratedArtifacts,
} from './healthkit-sdk'

function main() {
  const sources = loadHealthkitSdkSources()
  const schema = buildHealthkitSchemaFromSources(sources)
  writeGeneratedArtifacts(schema, renderGeneratedTypescript(schema))
  execFileSync(
    'swift',
    [
      'run',
      '--package-path',
      './scripts/swift-emitter',
      'HealthkitSwiftEmitter',
      GENERATED_SCHEMA_PATH,
      GENERATED_SWIFT_PATH,
    ],
    {
      stdio: 'inherit',
    },
  )
  formatGeneratedArtifacts()
}

main()
