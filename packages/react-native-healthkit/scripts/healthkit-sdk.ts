import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import type {
  HealthkitSchema,
  IdentifierOverrides,
  SymbolGraphDocument,
} from './generate-healthkit'

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
export const GENERATED_TS_PATH = join(
  ROOT,
  'src/generated/healthkit.generated.ts',
)
export const GENERATED_SCHEMA_PATH = join(
  ROOT,
  'src/generated/healthkit-schema.json',
)
const IDENTIFIER_OVERRIDES_PATH = join(
  ROOT,
  'scripts/healthkit-schema/identifier-overrides.json',
)

export interface HealthkitSdkSources {
  readonly sdkPath: string
  readonly symbolGraph: SymbolGraphDocument
  readonly identifierOverrides: IdentifierOverrides
  readonly typeIdentifiersHeader: string
  readonly categoryValuesHeader: string
  readonly metadataHeader: string
  readonly metadataEnumsHeader: string
  readonly workoutHeader: string
}

export function getSdkPath(): string {
  if (process.env.HEALTHKIT_SDK_PATH) {
    return process.env.HEALTHKIT_SDK_PATH
  }

  return execFileSync(
    'xcrun',
    ['--sdk', 'iphonesimulator', '--show-sdk-path'],
    {
      encoding: 'utf8',
    },
  ).trim()
}

export function readIdentifierOverrides(): IdentifierOverrides {
  return JSON.parse(
    readFileSync(IDENTIFIER_OVERRIDES_PATH, 'utf8'),
  ) as IdentifierOverrides
}

function readHealthkitHeader(relativePath: string, sdkPath: string): string {
  return readFileSync(
    join(
      sdkPath,
      'System/Library/Frameworks/HealthKit.framework',
      relativePath,
    ),
    'utf8',
  )
}

function readHealthkitSymbolGraph(sdkPath: string): SymbolGraphDocument {
  const outputDir = mkdtempSync(join(tmpdir(), 'healthkit-symbolgraph-'))

  try {
    execFileSync(
      'swift',
      [
        'symbolgraph-extract',
        '-module-name',
        'HealthKit',
        '-target',
        'arm64-apple-ios17.0-simulator',
        '-sdk',
        sdkPath,
        '-output-dir',
        outputDir,
      ],
      {
        cwd: ROOT,
      },
    )

    return JSON.parse(
      readFileSync(join(outputDir, 'HealthKit.symbols.json'), 'utf8'),
    ) as SymbolGraphDocument
  } finally {
    rmSync(outputDir, { recursive: true, force: true })
  }
}

export function loadHealthkitSdkSources(
  sdkPath = getSdkPath(),
): HealthkitSdkSources {
  return {
    sdkPath,
    symbolGraph: readHealthkitSymbolGraph(sdkPath),
    identifierOverrides: readIdentifierOverrides(),
    typeIdentifiersHeader: readHealthkitHeader(
      'Headers/HKTypeIdentifiers.h',
      sdkPath,
    ),
    categoryValuesHeader: readHealthkitHeader(
      'Headers/HKCategoryValues.h',
      sdkPath,
    ),
    metadataHeader: readHealthkitHeader('Headers/HKMetadata.h', sdkPath),
    metadataEnumsHeader: readHealthkitHeader(
      'Headers/HKMetadataEnums.h',
      sdkPath,
    ),
    workoutHeader: readHealthkitHeader('Headers/HKWorkout.h', sdkPath),
  }
}

export function writeGeneratedArtifacts(
  schema: HealthkitSchema,
  renderedTypescript: string,
) {
  mkdirSync(dirname(GENERATED_TS_PATH), { recursive: true })

  writeFileSync(
    GENERATED_SCHEMA_PATH,
    `${JSON.stringify(schema, null, 2)}\n`,
    'utf8',
  )
  writeFileSync(GENERATED_TS_PATH, renderedTypescript, 'utf8')
}

export function formatGeneratedArtifacts() {
  execFileSync(
    'bunx',
    [
      '@biomejs/biome',
      'check',
      '--write',
      GENERATED_TS_PATH,
      GENERATED_SCHEMA_PATH,
    ],
    {
      stdio: 'inherit',
      cwd: ROOT,
    },
  )
  execFileSync(
    'bunx',
    [
      '@biomejs/biome',
      'format',
      '--write',
      GENERATED_TS_PATH,
      GENERATED_SCHEMA_PATH,
    ],
    {
      stdio: 'inherit',
      cwd: ROOT,
    },
  )
}
