#!/usr/bin/env bash
# CELLOH route smoke check — run while dev server is up (default :3000)
set -euo pipefail

BASE="${CELLOH_QA_BASE_URL:-http://localhost:3000}"

routes=(
  "/"
  "/search"
  "/category/food"
  "/category/food?sub=fruit"
  "/category/living"
  "/category/beauty"
  "/category/fashion"
  "/category/digital"
  "/category/pet"
  "/product/1"
  "/product/11"
  "/product/wd-wipes-001"
  "/join-cart"
  "/checkout/wd-wipes-001"
  "/mypage"
  "/notifications"
  "/collections/today-special"
  "/collections/recommended"
  "/collections/celloh-coupon"
  "/collections/ending-sale"
  "/collections/popular"
  "/collections/weekend-special"
  "/collections/ranking"
  "/collections/lowest"
  "/collections/only-celloh"
  "/collections/coupon-sale"
  "/collections/repurchase"
  "/collections/seasonal"
  "/collections/new"
  "/collections/popular-sellers"
  "/collections/new-sellers"
  "/collections/live"
  "/membership"
  "/invite"
  "/support"
  "/support/faq"
  "/policies/privacy"
  "/policies/terms"
  "/policies/refund"
  "/policies/shipping"
  "/policies/payment"
  "/policies/referral"
  "/policies/seller"
  "/sellers/moon-fruit"
  "/sellers/living-lab"
  "/sellers/lumi-beauty"
  "/sellers/celloh-fresh"
  "/sellers/celloh"
  "/info/ranking-policy"
  "/reports"
)

# Safe fallback routes — dev notFound() may return HTTP 200; verify no crash
expect_safe_fallback=(
  "/product/unknown-route-audit"
  "/sellers/unknown-route-audit"
  "/collections/unknown-route-audit"
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
