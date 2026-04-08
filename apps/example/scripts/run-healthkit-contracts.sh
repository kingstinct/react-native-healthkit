#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
APP_DIR="$ROOT_DIR/apps/example"
SIMULATOR_ID="${SIMULATOR_ID:-${1:-}}"
APP_ID="com.kingstinct.reactnativehealthkitexample"
INITIAL_URL="exp+react-native-healthkit-example://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"
METRO_LOG="${TMPDIR:-/tmp}/healthkit-contract-metro.log"
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

  if [ -n "$SIMULATOR_ID" ]; then
    local screenshot_path
    screenshot_path="$(mktemp -t healthkit-contracts-XXXXXX).png"
    if xcrun simctl io "$SIMULATOR_ID" screenshot "$screenshot_path" >/dev/null 2>&1; then
      echo "Simulator screenshot: $screenshot_path" >&2
    fi
  fi

  if [ -n "$APP_DATA" ]; then
    echo "App data container: $APP_DATA" >&2
  fi

  if [ -n "$REPORT_PATH" ] && [ -f "$REPORT_PATH" ]; then
    echo "Partial contract report:" >&2
    cat "$REPORT_PATH" >&2
  fi

  if [ -f "$METRO_LOG" ]; then
    echo "Metro log tail:" >&2
    tail -n 200 "$METRO_LOG" >&2
  fi
}

cleanup() {
  if [ -n "$METRO_PID" ] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM
trap 'dump_debug_artifacts "Contract runner failed at line $LINENO"' ERR

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
  run_with_timeout 30 xcrun simctl boot "$SIMULATOR_ID"
  run_with_timeout 120 xcrun simctl bootstatus "$SIMULATOR_ID" -b
fi

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
    bun start --clear --non-interactive >"$METRO_LOG" 2>&1
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

run_with_timeout 20 xcrun simctl terminate "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
run_with_timeout 20 xcrun simctl uninstall "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
run_with_timeout 60 xcrun simctl install "$SIMULATOR_ID" "$APP_BUNDLE"

APP_DATA="$(xcrun simctl get_app_container "$SIMULATOR_ID" "$APP_ID" data)"
mkdir -p "$APP_DATA/Documents"
REPORT_PATH="$APP_DATA/Documents/healthkit-contract-report.json"
COMMAND_PATH="$APP_DATA/Documents/healthkit-contract-command.json"
rm -f "$REPORT_PATH"
printf '%s\n' '{"route":"contracts","autorun":"all"}' >"$COMMAND_PATH"

run_with_timeout 20 applesimutils \
  --byId "$SIMULATOR_ID" \
  --bundle "$APP_ID" \
  --setPermissions 'health=YES,motion=YES'

run_with_timeout 30 xcrun simctl launch "$SIMULATOR_ID" "$APP_ID" --initialUrl "$INITIAL_URL" >/dev/null

ATTEMPT=0
until [ -f "$REPORT_PATH" ]; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge 90 ]; then
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
