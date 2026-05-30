#!/usr/bin/env bash
# CELLOH route smoke check — run while dev server is up (default :3000)
set -euo pipefail

BASE="${CELLOH_QA_BASE_URL:-http://localhost:3000}"

routes=(
  "/"
  "/category/food"
  "/category/food?sub=fruit"
  "/category/food?sub=meat"
  "/category/food?sub=seafood"
  "/category/living"
  "/category/beauty"
  "/category/fashion"
  "/category/digital"
  "/category/pet"
  "/product/1"
  "/product/11"
  "/product/wd-wipes-001"
  "/join-cart"
  "/collections/today-special"
  "/collections/recommended"
  "/collections/celloh-coupon"
  "/collections/ranking"
  "/collections/popular-sellers"
  "/collections/new-sellers"
  "/collections/repurchase"
  "/collections/new"
  "/membership"
  "/invite"
  "/sellers/moon-fruit"
  "/sellers/living-lab"
  "/sellers/lumi-beauty"
  "/sellers/celloh-fresh"
  "/collections/nonexistent-slug-test"
)

# Safe fallback routes — dev notFound() may return HTTP 200; verify no crash
expect_safe_fallback=(
  "/product/unknown-test"
  "/sellers/unknown-test"
)

fail=0

check() {
  local path="$1"
  local expect="${2:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "${BASE}${path}")
  if [[ "$code" != "$expect" ]]; then
    echo "FAIL $code (expected $expect) $path"
    fail=1
  else
    echo "OK   $code $path"
  fi
}

echo "CELLOH route QA — $BASE"
echo "--- expect 200 ---"
for path in "${routes[@]}"; do
  check "$path" 200
done

echo "--- expect 200 (safe notFound / unavailable — no crash) ---"
for path in "${expect_safe_fallback[@]}"; do
  check "$path" 200
done

if [[ "$fail" -ne 0 ]]; then
  echo "Route QA failed."
  exit 1
fi

echo "Route QA passed."
