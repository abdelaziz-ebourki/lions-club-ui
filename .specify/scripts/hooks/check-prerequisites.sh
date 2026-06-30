#!/usr/bin/env bash
# before_plan hook: verifies spec.md exists
set -e

SPECIFY_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FEATURE_JSON="$SPECIFY_ROOT/feature.json"

if [ ! -f "$FEATURE_JSON" ]; then
  echo "No active feature. Run /speckit.specify first."
  exit 1
fi

FEATURE_DIR="$(jq -r '.feature_directory' "$FEATURE_JSON")"
SPEC_FILE="$SPECIFY_ROOT/$FEATURE_DIR/spec.md"

if [ ! -f "$SPEC_FILE" ]; then
  echo "spec.md not found in $FEATURE_DIR. Run /speckit.specify."
  exit 1
fi

echo "✅ Prerequisites met: spec.md found at $FEATURE_DIR/spec.md"
