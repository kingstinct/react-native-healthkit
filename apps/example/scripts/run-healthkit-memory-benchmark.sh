#!/usr/bin/env bash
#
# Runs one of the memory benchmark scenarios from contracts/memoryBenchmark.ts
# in the simulator, samples the app's physical footprint while it runs, and
# prints a per-phase summary. Usage:
#
#   bun run benchmark:memory <scenario-id> [iterations]
#
# Reports and memory logs are written to $BENCHMARK_OUT_DIR (default:
# $TMPDIR/healthkit-memory-benchmark).
#
# Scenarios: memory-seed (run once), memory-fetch, memory-fetch-dispose,
# memory-routes, memory-routes-dispose.

set -Eeuo pipefail

SCENARIO="${1:-}"
if [ -z "$SCENARIO" ]; then
  echo "Usage: $0 <scenario-id> [iterations]" >&2
  exit 1
fi
ITERATIONS="${2:-}"
case "$ITERATIONS" in
  ''|*[!0-9]*)
    if [ -n "$ITERATIONS" ]; then
      echo "iterations must be a whole number, got '$ITERATIONS'." >&2
      exit 1
    fi
    ;;
esac

OUT_DIR="${BENCHMARK_OUT_DIR:-${TMPDIR:-/tmp}/healthkit-memory-benchmark}"
mkdir -p "$OUT_DIR"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
MEMORY_LOG="$OUT_DIR/$SCENARIO-$STAMP.memory.log"
REPORT_COPY="$OUT_DIR/$SCENARIO-$STAMP.report.json"

# Build the launch command as real JSON so scenario ids cannot break quoting.
CONTRACT_COMMAND="$(SCENARIO="$SCENARIO" ITERATIONS="$ITERATIONS" bun -e '
  const iterations = process.env.ITERATIONS ? Number(process.env.ITERATIONS) : undefined
  console.log(JSON.stringify({ route: "contracts", scenario: process.env.SCENARIO, iterations }))
')"
export CONTRACT_COMMAND
export CONTRACT_REPORT_COPY="$REPORT_COPY"
export REPORT_TIMEOUT_SECONDS="${REPORT_TIMEOUT_SECONDS:-1800}"
export MEMORY_SAMPLE_LOG="$MEMORY_LOG"

# A failed scenario makes the contract runner exit non-zero; still summarize
# whatever phases were recorded before reporting the failure.
STATUS=0
bash "$SCRIPT_DIR/run-healthkit-contracts.sh" >/dev/null || STATUS=$?

if [ ! -f "$REPORT_COPY" ]; then
  echo "No benchmark report was produced (contract runner exit code $STATUS)." >&2
  exit "${STATUS:-1}"
fi

bun "$SCRIPT_DIR/summarize-memory-benchmark.ts" "$REPORT_COPY" "$MEMORY_LOG"
exit "$STATUS"
