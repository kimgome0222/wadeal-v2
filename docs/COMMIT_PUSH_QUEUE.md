# Commit & Push 미완료 큐

> 2026-05-29 · 6 push/commit-push 실패 + unstaged 변경

## push 실패 요청

### W007 (transcript L36)

```
Execute the selected diff-tab push action.
```

### W170 (transcript L1212)

```
Execute the selected diff-tab commit-and-push action.
```

### W173 (transcript L1281)

```
Execute the selected diff-tab commit-and-push action.
```

### W175 (transcript L1283)

```
Execute the selected diff-tab push action.
```

### W176 (transcript L1284)

```
Execute the selected diff-tab push action.
```

### W177 (transcript L1285)

```
Execute the selected diff-tab push action.
```

## unstaged/staged (미 push)

- `lib/data/admin-products.ts`
- `lib/data/payments.ts`
- `lib/data/seller-billings.ts`
- `lib/data/seller-settlement-records.ts`
- `lib/database/types.ts`
- `lib/discounts/points.ts`
- `lib/monitoring/sentry.ts`
- `lib/payments/toss/apply-confirm-result.ts`

## 복구 명령

```bash
cd ~/Documents/wadeal-v2
npm run build
git add docs/ lib/data/
git commit -m "fix: build types and save work queue docs"
git push origin main
npx vercel --prod
```
