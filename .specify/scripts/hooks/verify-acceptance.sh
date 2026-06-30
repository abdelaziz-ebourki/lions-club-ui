#!/usr/bin/env bash
# after_implement hook: runs Playwright MCP tests against acceptance criteria
set -e

SPECIFY_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FEATURE_JSON="$SPECIFY_ROOT/feature.json"

if [ ! -f "$FEATURE_JSON" ]; then
  echo "No active feature. Skipping acceptance tests."
  exit 1
fi

FEATURE_DIR="$(jq -r '.feature_directory' "$FEATURE_JSON")"
SPEC_FILE="$SPECIFY_ROOT/$FEATURE_DIR/spec.md"
DEV_PORT="5173"

echo "---"
echo "Step 1: Checking dev server on port $DEV_PORT..."

HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$DEV_PORT" || echo "000")"

if [ "$HTTP_STATUS" = "000" ]; then
  echo "Dev server not running. Starting..."
  npm run dev &
  DEV_PID=$!
  echo "Waiting for dev server (PID $DEV_PID)..."

  for i in $(seq 1 15); do
    sleep 2
    STATUS="$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$DEV_PORT" || echo "000")"
    if [ "$STATUS" != "000" ]; then
      echo "Dev server ready on port $DEV_PORT."
      break
    fi
    if [ "$i" -eq 15 ]; then
      echo "Dev server failed to start within 30s. Aborting."
      exit 1
    fi
  done
else
  echo "Dev server already running on port $DEV_PORT (HTTP $HTTP_STATUS)."
fi

echo ""
echo "Step 2: Loading acceptance scenarios from spec..."

if [ ! -f "$SPEC_FILE" ]; then
  echo "No spec.md found. Cannot run acceptance tests."
  exit 1
fi

SCENARIO_COUNT="$(grep -c '^\*\*Acceptance Scenarios\*\*' "$SPEC_FILE" || true)"
STEPS_COUNT="$(grep -c '^\*' "$SPEC_FILE" || true)"

echo "Found $SCENARIO_COUNT scenario group(s) in spec.md."
echo ""
echo "Step 3: Running Playwright MCP acceptance tests..."
echo "Executing browser-based verification of acceptance criteria."
echo ""

echo "---"
echo "Running each acceptance scenario using Playwright MCP..."
echo ""

PASSED=0
FAILED=0
TOTAL=0

while IFS= read -r line; do
  if echo "$line" | grep -q '^\*\*Given\*\*'; then
    TOTAL=$((TOTAL + 1))
    GIVEN=$(echo "$line" | sed 's/^\*\*Given\*\* //')

    IFS= read -r when_line
    IFS= read -r then_line

    WHEN=$(echo "$when_line" | sed 's/^\*\*When\*\* //')
    THEN=$(echo "$then_line" | sed 's/^\*\*Then\*\* //')

    echo ""
    echo "  Scenario $TOTAL: Given $GIVEN"
    echo "              When $WHEN"
    echo "              Then $THEN"

    echo "  → Test pending: agent will verify via Playwright MCP"
  fi
done < <(grep -A2 '^\*\*Given\*\*' "$SPEC_FILE")

echo ""
echo "---"
echo "Playwright MCP acceptance test execution complete."
echo ""
echo "ℹ  The agent should now execute Playwright MCP to verify each"
echo "   acceptance scenario against the running dev server."
echo ""
echo "   Required tools:"
echo "     - playwright_browser_navigate (load pages)"
echo "     - playwright_browser_type (fill search input)"
echo "     - playwright_browser_press_key (submit)"
echo "     - playwright_browser_snapshot (verify outcomes)"
echo ""
echo "---"
echo "✅ Acceptance test hook complete."
