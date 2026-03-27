#!/bin/sh

set -eu

ROOT_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
APP_DIR="$ROOT_DIR/apps/example"
SIMULATOR_ID="${SIMULATOR_ID:-${1:-}}"
if [ -z "$SIMULATOR_ID" ]; then
  SIMULATOR_ID="$(
    xcrun simctl list devices |
      sed -n 's/.*(\([0-9A-F-][0-9A-F-]*\)) (Booted).*/\1/p' |
      head -n 1
  )"
fi

if [ -z "$SIMULATOR_ID" ]; then
  echo "No booted simulator found. Set SIMULATOR_ID or boot a simulator first." >&2
  exit 1
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

METRO_PID=""
cleanup() {
  if [ -n "$METRO_PID" ] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if ! curl -fsS "http://127.0.0.1:8081/status" >/dev/null 2>&1; then
  (
    cd "$APP_DIR"
    bun start --clear --non-interactive >/tmp/healthkit-contract-metro.log 2>&1
  ) &
  METRO_PID="$!"

  ATTEMPT=0
  until curl -fsS "http://127.0.0.1:8081/status" >/dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ "$ATTEMPT" -ge 60 ]; then
      echo "Metro did not start in time." >&2
      exit 1
    fi
    sleep 1
  done
fi

APP_ID="com.kingstinct.reactnativehealthkitexample"
INITIAL_URL="exp+react-native-healthkit-example://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"

xcrun simctl terminate "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
xcrun simctl uninstall "$SIMULATOR_ID" "$APP_ID" >/dev/null 2>&1 || true
xcrun simctl install "$SIMULATOR_ID" "$APP_BUNDLE"

APP_DATA="$(xcrun simctl get_app_container "$SIMULATOR_ID" "$APP_ID" data)"
mkdir -p "$APP_DATA/Documents"
REPORT_PATH="$APP_DATA/Documents/healthkit-contract-report.json"
COMMAND_PATH="$APP_DATA/Documents/healthkit-contract-command.json"
rm -f "$REPORT_PATH"
printf '%s\n' '{"route":"contracts","autorun":"all"}' >"$COMMAND_PATH"

applesimutils --byId "$SIMULATOR_ID" --bundle "$APP_ID" --setPermissions 'health=YES,motion=YES' >/dev/null
xcrun simctl launch "$SIMULATOR_ID" "$APP_ID" --initialUrl "$INITIAL_URL" >/dev/null

ATTEMPT=0
until [ -f "$REPORT_PATH" ]; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge 90 ]; then
    echo "Contract report was not produced." >&2
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
