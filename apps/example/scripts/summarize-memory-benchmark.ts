import { readFileSync } from 'node:fs'
import type {
  BenchmarkPayload,
  MemoryBenchmarkId,
} from '../contracts/memoryBenchmark'
import type { ContractScenarioResult } from '../contracts/scenarios'

/**
 * Correlates a memory benchmark report (phases with wall-clock timestamps)
 * with the footprint samples the contract runner recorded, and prints one row
 * per phase. Invoked by run-healthkit-memory-benchmark.sh.
 */

const [reportPath, memoryLogPath] = process.argv.slice(2)
if (!reportPath || !memoryLogPath) {
  console.error(
    'Usage: bun summarize-memory-benchmark.ts <report.json> <memory.log>',
  )
  process.exit(1)
}

interface Sample {
  readonly at: number
  readonly mb: number
}

const report = JSON.parse(
  readFileSync(reportPath, 'utf8'),
) as ContractScenarioResult<MemoryBenchmarkId>
const payload = report.payload as BenchmarkPayload | undefined

const samples: Sample[] = readFileSync(memoryLogPath, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [at, kb] = line.split(' ').map(Number)
    return { at: at ?? Number.NaN, mb: (kb ?? Number.NaN) / 1024 }
  })

const rows = (payload?.phases ?? []).map((phase) => {
  const inPhase = samples.filter(
    (sample) => sample.at >= phase.startedAt && sample.at <= phase.endedAt,
  )
  const end = inPhase.at(-1)?.mb
  const peak = inPhase.reduce((max, sample) => Math.max(max, sample.mb), 0)
  return {
    phase: phase.name,
    seconds: ((phase.endedAt - phase.startedAt) / 1000).toFixed(1),
    peakMB: inPhase.length > 0 ? peak.toFixed(0) : '',
    endMB: end === undefined ? '' : end.toFixed(0),
    ...(phase.details ?? {}),
  }
})

console.log(`\nScenario: ${report.id} (${report.ok ? 'ok' : 'FAILED'})`)
if (!report.ok) {
  console.log(report.details.join('\n'))
}
if (payload) {
  console.log(`Config: ${JSON.stringify(payload.config)}`)
}
console.table(rows)
console.log(`Memory log: ${memoryLogPath}`)
console.log(`Report: ${reportPath}`)
