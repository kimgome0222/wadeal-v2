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

check_auth_gate() {
  local path="$1"
  local pattern="$2"
  local label="${3:-$pattern}"
  local body
  local code

  code=$(curl -s -L -o /tmp/celloh-smoke-body.html -w "%{http_code}" --max-time 30 "${BASE}${path}")
  body=$(cat /tmp/celloh-smoke-body.html)

  if [[ "$code" != "200" ]]; then
    echo "FAIL HTTP $code $path (auth gate)"
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
echo "--- buyer routes ---"

check_page "/" "celloh" "brand text"
check_page "/" "누가 만들었는지" "tagline"
check_page "/category/food" "식품" "category food"
check_page "/category/living" "생활" "category living"
check_page "/product/1" "상품" "product page"
check_page "/join-cart" "장바구니" "cart page"
check_page "/collections/today-special" "특가" "today special"
check_page "/collections/ranking" "랭킹" "ranking"
check_page "/collections/popular-sellers" "판매자" "popular sellers"
check_page "/invite" "친구" "invite page"
check_page "/membership" "멤버십" "membership page"
check_page "/support" "고객" "support home"
check_page "/policies/privacy" "개인정보" "privacy policy"

echo "--- auth-gated (follow redirect) ---"
check_auth_gate "/seller/dashboard" "로그인" "seller login gate"
check_auth_gate "/admin/dashboard" "로그인" "admin login gate"

rm -f /tmp/celloh-smoke-body.html

if [[ "$fail" -ne 0 ]]; then
  echo "Smoke content check failed."
  exit 1
fi

echo "Smoke content check passed."
