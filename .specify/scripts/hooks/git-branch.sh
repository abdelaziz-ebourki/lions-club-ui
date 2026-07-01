#!/usr/bin/env bash
# before_implement hook: creates or switches to a feature branch
set -e

SPECIFY_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FEATURE_JSON="$SPECIFY_ROOT/feature.json"

if [ ! -f "$FEATURE_JSON" ]; then
  echo "No active feature. Run /speckit.specify first."
  exit 1
fi

FEATURE_DIR="$(jq -r '.feature_directory' "$FEATURE_JSON")"
BRANCH_NAME="$(basename "$FEATURE_DIR")"

if [ -z "$BRANCH_NAME" ] || [ "$BRANCH_NAME" = "." ]; then
  echo "Invalid feature directory in feature.json."
  exit 1
fi

echo "---"
echo "Git branch management for feature: $BRANCH_NAME"
echo ""

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"

if [ "$CURRENT_BRANCH" = "$BRANCH_NAME" ]; then
  echo "Already on branch '$BRANCH_NAME'. No action needed."
  echo "{\"BRANCH_NAME\":\"$BRANCH_NAME\",\"FEATURE_NUM\":\"${BRANCH_NAME%%-*}\"}"
  exit 0
fi

STASHED=false
if ! git diff --quiet --exit-code 2>/dev/null || ! git diff --cached --quiet --exit-code 2>/dev/null; then
  echo "Uncommitted changes detected. Stashing..."
  git stash push -m "auto-stash for branch switch to $BRANCH_NAME" --quiet
  STASHED=true
  echo "Changes stashed."
fi

if git rev-parse --verify "$BRANCH_NAME" 2>/dev/null; then
  echo "Branch '$BRANCH_NAME' already exists. Switching..."
  git checkout "$BRANCH_NAME" --quiet
  echo "Switched to existing branch '$BRANCH_NAME'."
else
  echo "Creating new branch '$BRANCH_NAME'..."
  git checkout -b "$BRANCH_NAME" --quiet
  echo "Created and switched to branch '$BRANCH_NAME'."
fi

if [ "$STASHED" = true ]; then
  echo "Restoring stashed changes..."
  git stash pop --quiet 2>/dev/null || echo "Nothing to pop (stash already applied or empty)."
fi

echo ""
echo "{\"BRANCH_NAME\":\"$BRANCH_NAME\",\"FEATURE_NUM\":\"${BRANCH_NAME%%-*}\"}"
