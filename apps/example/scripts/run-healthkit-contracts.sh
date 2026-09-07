#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
APP_DIR="$ROOT_DIR/apps/example"
SIMULATOR_ID="${SIMULATOR_ID:-${1:-}}"
APP_ID="com.kingstinct.reactnativehealthkitexample"
INITIAL_URL="exp+react-native-healthkit-example://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"
METRO_LOG="${TMPDIR:-/tmp}/healthkit-contract-metro.log"
DIAG_DIR="${CONTRACT_DIAGNOSTICS_DIR:-}"
# Launch command handed to the app; override to run a single scenario.
DEFAULT_CONTRACT_COMMAND='{"route":"contracts","autorun":"all"}'
CONTRACT_COMMAND="${CONTRACT_COMMAND:-$DEFAULT_CONTRACT_COMMAND}"
REPORT_TIMEOUT_SECONDS="${REPORT_TIMEOUT_SECONDS:-300}"
# When set, resident memory of the app process is sampled into this file
# (epoch-ms, footprint-kb per line) while waiting for the report.
MEMORY_SAMPLE_LOG="${MEMORY_SAMPLE_LOG:-}"
SAMPLER_PID=""
APP_DATA=""
REPORT_PATH=""
COMMAND_PATH=""
METRO_PID=""

run_with_timeout() {
  local seconds="$1"
  shift
  python3 - "$seconds" "$@" <<'PY'
import subprocess
import sys

timeout = int(sys.argv[1])
command = sys.argv[2:]

try:
    subprocess.run(command, check=True, timeout=timeout)
except subprocess.TimeoutExpired:
    print(
        f"Timed out after {timeout}s: {' '.join(command)}",
        file=sys.stderr,
    )
    sys.exit(124)
except subprocess.CalledProcessError as error:
    sys.exit(error.returncode)
PY
}

dump_debug_artifacts() {
  local reason="$1"

  echo "$reason" >&2

  if [ -z "$DIAG_DIR" ]; then
    DIAG_DIR="$(mktemp -d -t healthkit-contract-diagnostics)"
  fi
  mkdir -p "$DIAG_DIR"
  echo "$reason" >"$DIAG_DIR/failure-reason.txt"

  if [ -n "$SIMULATOR_ID" ]; then
    if xcrun simctl io "$SIMULATOR_ID" screenshot "$DIAG_DIR/simulator.png" >/dev/null 2>&1; then
      echo "Simulator screenshot: $DIAG_DIR/simulator.png" >&2
    fi

    xcrun simctl spawn "$SIMULATOR_ID" log show \
      --last 10m \
      --style compact \
      --predicate 'process == "RNHealthKit" OR eventMessage CONTAINS "reactnativehealthkitexample"' \
      >"$DIAG_DIR/device-log.txt" 2>&1 || true

    xcrun simctl listapps "$SIMULATOR_ID" >"$DIAG_DIR/installed-apps.txt" 2>&1 || true

    find "$HOME/Library/Logs/DiagnosticReports" \
      \( -name 'RNHealthKit*' -o -name '*reactnativehealthkitexample*' \) \
      -exec cp {} "$DIAG_DIR/" \; 2>/dev/null || true
  fi

  if [ -n "$APP_DATA" ]; then
    echo "App data container: $APP_DATA" >&2
  fi

  if [ -n "$REPORT_PATH" ] && [ -f "$REPORT_PATH" ]; then
    echo "Partial contract report:" >&2
    cat "$REPORT_PATH" >&2
    cp "$REPORT_PATH" "$DIAG_DIR/" 2>/dev/null || true
  fi

  if [ -f "$METRO_LOG" ]; then
    echo "Metro log tail:" >&2
    tail -n 200 "$METRO_LOG" >&2
    cp "$METRO_LOG" "$DIAG_DIR/metro.log" 2>/dev/null || true
  fi

  echo "Diagnostics collected in: $DIAG_DIR" >&2
}

cleanup() {
  if [ -n "$METRO_PID" ] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
  fi
  if [ -n "$SAMPLER_PID" ] && kill -0 "$SAMPLER_PID" 2>/dev/null; then
    kill "$SAMPLER_PID" 2>/dev/null || true
  fi
}

sample_memory() {
  local log="$1"
  : >"$log"
  while true; do
    local pid
    pid="$(pgrep -x RNHealthKit | head -n 1 || true)"
    if [ -n "$pid" ]; then
      # `footprint` reports the physical footprint (what jetsam limits on
      # device); fall back to RSS if it is unavailable.
      local kb
      kb="$(footprint -p "$pid" 2>/dev/null | sed -n 's/.*Footprint: \([0-9.]*\) \([KMG]\)B.*/\1 \2/p' | awk '{ if ($2 == "G") print $1 * 1048576; else if ($2 == "M") print $1 * 1024; else print $1 }' || true)"
      if [ -z "$kb" ]; then
        kb="$(ps -o rss= -p "$pid" 2>/dev/null | tr -d ' ' || true)"
      fi
      if [ -n "$kb" ]; then
        printf '%s %s\n' "$(python3 -c 'import time; print(int(time.time()*1000))')" "$kb" >>"$log"
      fi
    fi
    sleep 0.2
  done
}

trap cleanup EXIT INT TERM
trap 'dump_debug_artifacts "Contract runner failed: $BASH_COMMAND"' ERR

find_booted_simulator() {
  xcrun simctl list devices |
    sed -n 's/.*(\([0-9A-F-][0-9A-F-]*\)) (Booted).*/\1/p' |
    head -n 1
}

find_available_simulator() {
  xcrun simctl list devices available |
    sed -n 's/^[[:space:]]*iPhone[^()]* (\([0-9A-F-][0-9A-F-]*\)) (.*/\1/p' |
    head -n 1
}

if [ -z "$SIMULATOR_ID" ]; then
  SIMULATOR_ID="$(find_booted_simulator)"
fi

if [ -z "$SIMULATOR_ID" ]; then
  SIMULATOR_ID="$(find_available_simulator)"
fi

if [ -z "$SIMULATOR_ID" ]; then
  echo "No usable simulator found. Set SIMULATOR_ID or install an iPhone simulator runtime." >&2
  exit 1
fi

if ! xcrun simctl list devices | grep -q "$SIMULATOR_ID.*Booted"; then
  run_with_timeout 120 xcrun simctl boot "$SIMULATOR_ID"
fi

# Always wait for readiness, even when the device already reports Booted: a
# first boot of a new runtime reports Booted while data migration is still
# running, and every simctl call issued during migration crawls. bootstatus
# returns immediately once the device has actually settled.
run_with_timeout 600 xcrun simctl bootstatus "$SIMULATOR_ID" -b

if ! command -v applesimutils >/dev/null 2>&1; then
  echo "applesimutils is required for HealthKit contract runs." >&2
  exit 1
fi

APP_BUNDLE="${APP_BUNDLE:-}"
if [ -z "$APP_BUNDLE" ]; then
  APP_BUNDLE="$(find "$HOME/Library/Developer/Xcode/DerivedData" -path '*Debug-iphonesimulator/RNHealthKit.app' | sort | tail -n 1)"
fi

if [ ! -d "$APP_BUNDLE" ]; then
  echo "Could not find built RNHealthKit.app. Set APP_BUNDLE or build the example app first." >&2
  exit 1
fi

rm -f "$METRO_LOG"

if ! curl -fsS --max-time 2 "http://127.0.0.1:8081/status" >/dev/null 2>&1; then
  (
    cd "$APP_DIR"
    CI=1 bun start --clear >"$METRO_LOG" 2>&1
  ) &
  METRO_PID="$!"

  ATTEMPT=0
  until curl -fsS --max-time 2 "http://127.0.0.1:8081/status" >/dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ "$ATTEMPT" -ge 60 ]; then
      dump_debug_artifacts "Metro did not start in time."
      exit 1
    fi
    sleep 1
  done
fi

run_with_timeout 60 xcrun simctl terminate "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
run_with_timeout 60 xcrun simctl uninstall "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
run_with_timeout 180 xcrun simctl install "$SIMULATOR_ID" "$APP_BUNDLE"

APP_DATA="$(xcrun simctl get_app_container "$SIMULATOR_ID" "$APP_ID" data)"
mkdir -p "$APP_DATA/Documents"
REPORT_PATH="$APP_DATA/Documents/healthkit-contract-report.json"
COMMAND_PATH="$APP_DATA/Documents/healthkit-contract-command.json"
rm -f "$REPORT_PATH"
printf '%s\n' "$CONTRACT_COMMAND" >"$COMMAND_PATH"

run_with_timeout 120 applesimutils \
  --byId "$SIMULATOR_ID" \
  --bundle "$APP_ID" \
  --setPermissions 'health=YES,motion=YES'

if ! run_with_timeout 180 xcrun simctl launch "$SIMULATOR_ID" "$APP_ID" --initialUrl "$INITIAL_URL" >/dev/null; then
  echo "simctl launch did not return in time; still waiting for the contract report." >&2
fi

# Cold start on a CI runner has to boot the dev client and bundle ~1900 modules
# through Metro before the first contract runs, which has taken over three
# minutes end to end.
if [ -n "$MEMORY_SAMPLE_LOG" ]; then
  sample_memory "$MEMORY_SAMPLE_LOG" &
  SAMPLER_PID="$!"
fi

ATTEMPT=0
until [ -f "$REPORT_PATH" ]; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge "$REPORT_TIMEOUT_SECONDS" ]; then
    dump_debug_artifacts "Contract report was not produced."
    exit 1
  fi
  sleep 1
done

cat "$REPORT_PATH"

REPORT_PATH="$REPORT_PATH" bun -e '
  import { readFileSync } from "node:fs"

  const report = JSON.parse(readFileSync(process.env.REPORT_PATH, "utf8"))
  const results = Array.isArray(report) ? report : [report]
  const failures = results.filter((entry) => entry?.ok !== true)
  if (failures.length > 0) {
    console.error(`Contract failures: ${failures.map((entry) => entry.id).join(", ")}`)
    process.exit(1)
  }
'
