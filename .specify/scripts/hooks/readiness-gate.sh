#!/usr/bin/env bash
# before_implement hook: loads skills and verifies all artifacts exist
set -e

SPECIFY_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FEATURE_JSON="$SPECIFY_ROOT/feature.json"

if [ ! -f "$FEATURE_JSON" ]; then
  echo "No active feature. Run /speckit.specify first."
  exit 1
fi

FEATURE_DIR="$(jq -r '.feature_directory' "$FEATURE_JSON")"
MISSING=""

for artifact in spec.md plan.md tasks.md; do
  if [ ! -f "$SPECIFY_ROOT/$FEATURE_DIR/$artifact" ]; then
    MISSING="$MISSING $artifact"
  fi
done

if [ -n "$MISSING" ]; then
  echo "Blocked: missing artifacts —$MISSING"
  echo "Run the appropriate /speckit.* commands first."
  exit 1
fi

echo "✅ All artifacts present: spec.md, plan.md, tasks.md"
echo "---"
echo "Loading required agent skills for implementation..."
echo "  - tdd (mandatory per Constitution Principle I)"
echo "  - shadcn (for UI components)"
echo "  - vercel-react-best-practices (for React patterns)"
echo "  - playwright-best-practices (for E2E acceptance tests)"
echo "---"
echo "Skills loaded. Ready for /speckit.implement."
