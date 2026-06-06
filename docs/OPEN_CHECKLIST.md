# Wadeal Open Checklist

## Current production URL

- https://wadeal-v2-879rzws66-kimgome0222-2396s-projects.vercel.app

## Must fix before public opening

- [ ] Production URL must return 200 for `/` without Vercel authentication.
- [ ] Confirm Vercel Deployment Protection / password protection settings.
- [ ] Verify Vercel production environment variables.
- [ ] Verify Supabase schema, migrations, RLS, and storage bucket policies.
- [ ] Replace mock auth/session guards with real `auth.uid()` based access control.
- [ ] Run buyer real-user QA from public URL.
- [ ] Run seller real-user QA from public URL.
- [ ] Run admin real-user QA from public URL.
- [ ] Run iPhone/mobile visual QA from public URL.
- [ ] Run Toss payment confirm/cancel/webhook E2E in test mode.
- [ ] Configure Kakao production OAuth if login is in opening scope.

## Can open only after

- [ ] Home/search/category/product detail pages publicly load.
- [ ] Cart/checkout/order-complete flow is verified.
- [ ] Mypage profile/address/coupon/point pages are verified.
- [ ] Seller order/inquiry/review/settlement flows are verified.
- [ ] Admin product/seller/refund/category/banner/event/coupon flows are verified.
- [ ] External payment/auth/storage risks are closed or explicitly disabled for launch.

## Later improvements

- Persist all fallback data into Supabase.
- Add full audit logs for seller/admin mutations.
- Add image uploads for product, banner, review, and seller documents.
- Add analytics and conversion tracking.
