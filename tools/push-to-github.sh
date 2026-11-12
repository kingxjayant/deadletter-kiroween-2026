#!/usr/bin/env bash
# Push DEAD LETTER to a public GitHub repo and enable GitHub Pages (Actions build).
#
# SECURITY: the token is read ONLY from the GITHUB_TOKEN environment variable.
# It is NEVER written to a file, NEVER embedded in a git remote URL, NEVER
# committed and NEVER printed. Auth is injected per-command via git's
# http.extraHeader and curl -H, so even .git/config stays clean.
# REVOKE THE TOKEN IMMEDIATELY after this script reports success.
#
# Usage:
#   export GITHUB_TOKEN='ghp_...'      # classic PAT: repo + workflow scopes
#   export GITHUB_USERNAME='your-login'
#   export REPO_NAME='deadletter-kiroween-2026'   # optional
#   bash tools/push-to-github.sh
#
# See docs/GITHUB_SETUP.md for the safer fine-grained-token alternative.

set -euo pipefail

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN to a short-lived token}"
: "${GITHUB_USERNAME:?Set GITHUB_USERNAME to your GitHub login}"
REPO_NAME="${REPO_NAME:-deadletter-kiroween-2026}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Classic PATs (ghp_) use the `token` scheme; fine-grained (github_pat_) use Bearer.
case "$GITHUB_TOKEN" in
  ghp_*)  AUTH_HEADER="Authorization: token ${GITHUB_TOKEN}" ;;
  *)      AUTH_HEADER="Authorization: Bearer ${GITHUB_TOKEN}" ;;
esac

api() {
  curl -sS -X "$1" \
    -H "$AUTH_HEADER" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "${@:2}"
}

echo "==> Checking GitHub authentication (no token or response is printed)"
STATUS="$(curl -sS -o /dev/null -w '%{http_code}' \
  -H "$AUTH_HEADER" -H "Accept: application/vnd.github+json" \
  https://api.github.com/user)"
if [[ "$STATUS" != "200" ]]; then
  echo "Authentication failed (HTTP $STATUS). Check the token." >&2
  exit 1
fi

echo "==> Checking whether ${GITHUB_USERNAME}/${REPO_NAME} already exists"
EXISTS="$(curl -sS -o /dev/null -w '%{http_code}' \
  -H "$AUTH_HEADER" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}")"
if [[ "$EXISTS" == "200" ]]; then
  echo "    Repo already exists — will push into it (no files will be created remotely)."
elif [[ "$EXISTS" == "404" ]]; then
  echo "==> Creating an EMPTY public repo (no README/licence/.gitignore)"
  # IMPORTANT: do not set auto_init or license_template — either one creates an
  # initial commit and the push below would be rejected as non-fast-forward.
  CREATE_CODE="$(api POST https://api.github.com/user/repos \
    -d "{\"name\":\"${REPO_NAME}\",\"description\":\"DEAD LETTER — a tear-tolerant paper telegram. Kiroween 2026, Resurrection.\",\"private\":false,\"homepage\":\"https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/\"}" \
    -o /dev/null -w '%{http_code}')"
  if [[ "$CREATE_CODE" != "201" ]]; then
    echo "Repo creation returned HTTP $CREATE_CODE. Create the empty public repo in the GitHub web UI and rerun." >&2
    exit 1
  fi
else
  echo "Unexpected response HTTP $EXISTS when checking the repo." >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  git init -b main
fi
git add -A
git -c user.name="Jayant Kumar" -c user.email="jayant.explains.ai@gmail.com" \
  commit -m "Prepare DEAD LETTER for public GitHub deployment" || echo "(nothing new to commit)"

# Clean remote: NO credential in .git/config. Auth is passed only to this one push.
CLEAN_REMOTE="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$CLEAN_REMOTE"
else
  git remote add origin "$CLEAN_REMOTE"
fi
echo "==> Pushing main (credential injected in-memory for this command only)"
git -c "http.extraHeader=${AUTH_HEADER}" push -u origin main

echo "==> Enabling GitHub Pages with the Actions build type"
PAGES_CODE="$(api POST "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/pages" \
  -d '{"build_type":"workflow"}' -o /dev/null -w '%{http_code}')"
if [[ "$PAGES_CODE" != "201" && "$PAGES_CODE" != "204" ]]; then
  PAGES_CODE="$(api PUT "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/pages" \
    -d '{"build_type":"workflow"}' -o /dev/null -w '%{http_code}')"
fi
if [[ "$PAGES_CODE" == "201" || "$PAGES_CODE" == "204" ]]; then
  echo "    Pages enabled (workflow build)."
else
  echo "    Pages API returned HTTP $PAGES_CODE — set Settings > Pages > Source = GitHub Actions manually."
fi

echo "==> Verifying no credential leaked into git config"
if git config --get remote.origin.url | grep -q '@'; then
  echo "WARNING: credential found in remote URL" >&2
else
  echo "    remote.origin.url is clean: $(git config --get remote.origin.url)"
fi

echo "==> Done. Live URL: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo "==> REVOKE THE TOKEN NOW: https://github.com/settings/tokens"
