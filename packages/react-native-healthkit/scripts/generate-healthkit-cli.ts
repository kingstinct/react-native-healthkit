import {
  buildHealthkitSchemaFromSources,
  renderGeneratedTypescript,
} from './generate-healthkit'
import {
  formatGeneratedArtifacts,
  loadHealthkitSdkSources,
  writeGeneratedArtifacts,
} from './healthkit-sdk'

function main() {
  const sources = loadHealthkitSdkSources()
  const schema = buildHealthkitSchemaFromSources(sources)
  writeGeneratedArtifacts(schema, renderGeneratedTypescript(schema))
  formatGeneratedArtifacts()
}

main()
