import {
  buildHealthkitSchemaFromSources,
  renderGeneratedContracts,
  renderGeneratedSwift,
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
  writeGeneratedArtifacts(
    schema,
    renderGeneratedTypescript(schema),
    renderGeneratedContracts(schema),
    renderGeneratedSwift(schema),
  )
  formatGeneratedArtifacts()
}

main()
