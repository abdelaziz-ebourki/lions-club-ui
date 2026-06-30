#!/usr/bin/env bash
# after_specify hook: validates spec quality checklist
set -e

SPECIFY_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FEATURE_JSON="$SPECIFY_ROOT/feature.json"

if [ ! -f "$FEATURE_JSON" ]; then
  echo "No active feature. Run /speckit.specify first."
  exit 1
fi

FEATURE_DIR="$(jq -r '.feature_directory' "$FEATURE_JSON")"
CHECKLIST="$SPECIFY_ROOT/$FEATURE_DIR/checklists/requirements.md"

if [ ! -f "$CHECKLIST" ]; then
  echo "No quality checklist found. Skipping validation."
  exit 0
fi

UNCHECKED="$(grep -c '\- \[ \]' "$CHECKLIST" || true)"

if [ "$UNCHECKED" -gt 0 ]; then
  echo "⚠  $UNCHECKED quality checklist item(s) still unchecked in $CHECKLIST"
  echo "Run /speckit.clarify or update the spec before /speckit.plan."
  exit 1
fi

echo "✅ All quality checklist items pass."
