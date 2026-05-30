# CELLOH Launch Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Domain placeholder:** [https://www.celloh.co.kr](https://www.celloh.co.kr)  
**Note:** This document is planning only — **no deploy in this task**

---

## Legal & business

- [ ] 사업자등록번호 / 통신판매업 신고번호 footer 노출
- [ ] 대표자명, 사업장 주소, 고객센터 연락처
- [ ] `/policies/privacy` — 개인정보처리방침 최종 검수
- [ ] `/policies/terms` — 이용약관 최종 검수
- [ ] `/policies/refund` — 환불/교환 정책
- [ ] `/policies/shipping` — 배송 정책
- [ ] `/policies/payment` — 결제 정책
- [ ] `/policies/referral` — 친구추천 정책
- [ ] `/policies/review` — 리뷰 정책
- [ ] `/commerce-policy` — 전자상거래 안내

---

## Payments & PG

- [ ] Toss Payments 심사 완료 (테스트 → 라이브 키 전환)
- [ ] `TOSS_*` env — **Vercel production only, not in repo**
- [ ] Webhook URL 등록 (`/api/payments/toss/webhook`)
- [ ] Billing / 자동결제 약관 (`/finance-terms`)
- [ ] 환불 API (`/api/payments/toss/refund`) 운영 테스트

---

## Infrastructure

- [ ] Supabase production project + RLS policies
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.celloh.co.kr`
- [ ] Vercel production env vars (no secrets in git)
- [ ] OAuth redirect URLs (Google/Kakao) → production domain
- [ ] Storage bucket policy (product images, review photos)
- [ ] Error logging (admin `/admin/error-logs`, Sentry placeholder)
- [ ] Backup / rollback plan (DB snapshot, Vercel instant rollback)

---

## Security

- [ ] GitHub secret scanning alerts resolved
- [ ] `.env.local` never committed
- [ ] Admin routes gated (`/admin/*`)
- [ ] Seller routes gated by approval status
- [ ] Rate limiting on auth/payment endpoints (post-launch)

---

## SEO & discoverability

- [ ] `metadataBase` → production origin via `NEXT_PUBLIC_SITE_URL`
- [ ] `/sitemap.xml` — home, categories, collections, policies, products
- [ ] `/robots.txt` — disallow admin/mypage/checkout
- [ ] `manifest.webmanifest` — celloh, `#2E5E4E` theme
- [ ] OpenGraph / Twitter cards on home, product, category, collection, seller
- [ ] Brand slogans in metadata:
  - "누가 만들었는지 알고 사세요."
  - "좋은 상품은 좋은 판매자에게서 시작됩니다."

---

## Operations

- [ ] 고객센터 `/support`, `/support/faq`, `/support/contact`
- [ ] 판매자 입점 `/seller/apply` → admin review flow
- [ ] 관리자 권한 role matrix (`docs/CELLOH_AUTH_ROLE_CHECKLIST.md`)
- [ ] 정산 `/admin/settlements`, seller finance
- [ ] 알림 템플릿 (`docs/CELLOH_NOTIFICATION_TEMPLATES.md`)

---

## Final QA routes

Run with dev server:

```bash
npm run qa:routes
bash scripts/smoke-content.sh
```

Key paths: `/`, `/category/food`, `/product/1`, `/join-cart`, `/collections/ranking`, `/invite`, `/membership`, `/policies/privacy`, `/support`

---

## Final build

```bash
rm -rf .next
npm run lint
npm run build
```

- [ ] lint PASS
- [ ] build PASS
- [ ] No TypeScript errors
- [ ] Manual mobile QA (`docs/CELLOH_MOBILE_UI_AUDIT.md`)

---

## Deploy approval

- [ ] Stakeholder sign-off on policies
- [ ] PG live keys loaded in Vercel (not committed)
- [ ] DNS `www.celloh.co.kr` → Vercel
- [ ] SSL certificate active
- [ ] Post-deploy smoke on production URL
- [ ] Rollback owner assigned

**Deploy status:** ⏳ Not executed in this task

---

## Related docs

| Doc | Purpose |
|-----|---------|
| `CELLOH_SMOKE_TEST_PLAN.md` | Route + content smoke |
| `CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md` | Perf/a11y |
| `CELLOH_ORDER_STATE_MACHINE.md` | Order ops |
| `CELLOH_SECRET_ENV_AUDIT.md` | Env inventory |
| `CELLOH_GO_LIVE_READINESS` | Admin screen `/admin/go-live-readiness` |
