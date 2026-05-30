#!/usr/bin/env bash
# CELLOH smoke content check — run while dev server is up (default :3000)
# No Playwright required — curl + grep only
set -euo pipefail

BASE="${CELLOH_QA_BASE_URL:-http://localhost:3000}"

fail=0

check_page() {
  local path="$1"
  local pattern="$2"
  local label="${3:-$pattern}"
  local body
  local code

  code=$(curl -s -o /tmp/celloh-smoke-body.html -w "%{http_code}" --max-time 30 "${BASE}${path}")
  body=$(cat /tmp/celloh-smoke-body.html)

  if [[ "$code" != "200" ]]; then
    echo "FAIL HTTP $code $path"
    fail=1
    return
  fi

  if echo "$body" | grep -q "$pattern"; then
    echo "OK   $path ($label)"
  else
    echo "FAIL $path (missing: $label)"
    fail=1
  fi
}

echo "CELLOH smoke content — $BASE"
echo "---"

check_page "/" "celloh" "brand text"
check_page "/" "누가 만들었는지" "tagline"
check_page "/category/food" "식품" "category title"
check_page "/product/1" "상품" "product page"
check_page "/join-cart" "장바구니" "cart page"
check_page "/collections/ranking" "랭킹" "ranking collection"
check_page "/invite" "친구" "invite page"
check_page "/membership" "멤버십" "membership page"

rm -f /tmp/celloh-smoke-body.html

if [[ "$fail" -ne 0 ]]; then
  echo "Smoke content check failed."
  exit 1
fi

echo "Smoke content check passed."
