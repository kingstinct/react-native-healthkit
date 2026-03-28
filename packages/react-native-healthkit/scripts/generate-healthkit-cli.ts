import {
  buildHealthkitSchemaFromSources,
  renderGeneratedContracts,
  renderGeneratedSwift,
  renderGeneratedTypescript,
} from './generate-healthkit'
import {
  formatGeneratedArtifacts,
  getGeneratedArtifactPaths,
  loadHealthkitSdkSources,
  writeGeneratedArtifacts,
} from './healthkit-sdk'

function main() {
  const generatedArtifactPaths = getGeneratedArtifactPaths()
  const sources = loadHealthkitSdkSources()
  const schema = buildHealthkitSchemaFromSources(sources)
  writeGeneratedArtifacts(
    schema,
    renderGeneratedTypescript(schema),
    renderGeneratedContracts(schema),
    renderGeneratedSwift(schema),
    generatedArtifactPaths,
  )
  formatGeneratedArtifacts(generatedArtifactPaths)
}

main()
