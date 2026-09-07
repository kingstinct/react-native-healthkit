#!/usr/bin/env bash
#
# Runs one of the memory benchmark scenarios from contracts/memoryBenchmark.ts
# in the simulator, samples the app's resident memory while it runs, and prints
# a per-phase summary. Usage:
#
#   bun run benchmark:memory memory-fetch [output-dir]
#
# Scenarios: memory-seed (run once), memory-fetch, memory-fetch-dispose,
# memory-routes, memory-routes-dispose.

set -Eeuo pipefail

SCENARIO="${1:-}"
if [ -z "$SCENARIO" ]; then
  echo "Usage: $0 <scenario-id> [output-dir]" >&2
  exit 1
fi

OUT_DIR="${2:-${TMPDIR:-/tmp}/healthkit-memory-benchmark}"
mkdir -p "$OUT_DIR"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
MEMORY_LOG="$OUT_DIR/$SCENARIO-$STAMP.memory.log"
REPORT_COPY="$OUT_DIR/$SCENARIO-$STAMP.report.json"

export CONTRACT_COMMAND="{\"route\":\"contracts\",\"scenario\":\"$SCENARIO\"}"
export REPORT_TIMEOUT_SECONDS="${REPORT_TIMEOUT_SECONDS:-1800}"
export MEMORY_SAMPLE_LOG="$MEMORY_LOG"

REPORT_OUTPUT="$(bash "$SCRIPT_DIR/run-healthkit-contracts.sh" | sed -n '/^[\[{]/,$p')"
printf '%s\n' "$REPORT_OUTPUT" >"$REPORT_COPY"

REPORT_PATH="$REPORT_COPY" MEMORY_LOG="$MEMORY_LOG" bun -e '
  import { readFileSync } from "node:fs"

  const report = JSON.parse(readFileSync(process.env.REPORT_PATH, "utf8"))
  const samples = readFileSync(process.env.MEMORY_LOG, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" ").map(Number))
    .map(([at, rssKb]) => ({ at, mb: rssKb / 1024 }))

  const phases = report?.payload?.phases ?? []
  const rows = phases.map((phase) => {
    const inPhase = samples.filter((s) => s.at >= phase.startedAt && s.at <= phase.endedAt)
    const last = inPhase.at(-1)?.mb ?? Number.NaN
    const peak = inPhase.reduce((max, s) => Math.max(max, s.mb), 0)
    return {
      phase: phase.name,
      seconds: ((phase.endedAt - phase.startedAt) / 1000).toFixed(1),
      peakMB: peak.toFixed(0),
      endMB: last.toFixed(0),
      ...(phase.details ?? {}),
    }
  })
  console.log(`\nScenario: ${report.id} (${report.ok ? "ok" : "FAILED"})`)
  console.table(rows)
  console.log(`Memory log: ${process.env.MEMORY_LOG}`)
  console.log(`Report: ${process.env.REPORT_PATH}`)
  if (!report.ok) process.exit(1)
'
