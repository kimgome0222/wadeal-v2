# 와딜 재개 명령 (`시작`)

> 생성: 2026-05-27 · 총 **188**개 사용자 요청 저장됨

## 한 줄 재개

채팅에 아래만 입력:

```
시작
```

또는:

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel은 빌드 통과 후.
```

## 우선순위 (재부팅 직후)

1. **Q-BUILD** — `npm run build` 통과 (E001~E002, **B001**)
2. **Q-BLOCKERS** — **B001–B006** 백로그 블로커 (build, git, push, vercel, migration, duplicate export)
3. **Q-COMMIT** — checkpoint docs + build fix 커밋 (**B002**)
4. **Q-PUSH** — `git push origin main` (**B003**, E003)
5. **Q-VERCEL** — `npx vercel --prod` (**B004**, E004)
6. **Q-BACKLOG** — `backlog_incomplete[]` 나머지: **priority high → medium → low**, 동순위는 ID 순 (MG/AP/SP/CP/AC/LD/API/NT/RLS/PAY/LP/LN/LA)
7. **W001~W188** — 저장된 채팅 요청 순차 실행

## 세분화 백로그 ID 접두사

| 접두사 | 범위 |
|---|---|
| MG | `supabase/migrations/*.sql` 원격 적용·스키마 검증 |
| AP | `app/admin/**/page.tsx` |
| SP | `app/seller/**/page.tsx` |
| CP | 고객·마이페이지·결제 등 `app/**/page.tsx` (admin/seller 제외) |
| AC | `app/actions/*.ts` |
| LD | `lib/data/*.ts` |
| API | `app/api/**/route.ts` |
| NT | `lib/notifications/types.ts` 알림 타입별 E2E |
| RLS | 테이블·Storage RLS 검증 버킷 |
| PAY | Toss webhook·confirm·billing·환불 등 결제 단계 |
| LP / LN / LA | `lib/payments`, `lib/notifications`, `lib/auth` 모듈 |

레거시 백로그: **B**, **N**, **S**, **A**, **P**, **M**, **D**, **V**, **G**, **PF**, **E**

## 파일

| 파일 | 용도 |
|------|------|
| `docs/work-queue.json` | W001~ + `backlog_incomplete[]` + resume_command |
| `docs/BACKLOG_INCOMPLETE.md` | 백로그 접두사별 목록 |
| `docs/WORK_QUEUE_MASTER.md` | 인덱스·카테고리·에러·push 실패 |
| `docs/REBOOT_CHECKPOINT.md` | Git/빌드/완료·미완료 요약 |
| `docs/COMMIT_PUSH_QUEUE.md` | Commit&Push 탭 실패 항목 |

## Git (저장 시점)

```
## main...origin/main [ahead 12]
MM lib/data/admin-products.ts
 M lib/data/payments.ts
 M lib/data/seller-billings.ts
 M lib/data/seller-settlement-records.ts
 M lib/database/types.ts
 M lib/discounts/points.ts
 M lib/monitoring/sentry.ts
 M lib/payments/toss/apply-confirm-result.ts
?? docs/COMMIT_PUSH_QUEUE.md
?? docs/REBOOT_CHECKPOINT.md
?? docs/START.md
?? docs/WORK_QUEUE_MASTER.md
?? docs/work-queue.json
?? tsconfig.tsbuildinfo
```

미 push 커밋 12개 — `git log origin/main..HEAD`

## 추가 저장 (2차)

- **채팅 요청 W001~W188**: `work_items[]`
- **기능/미완료 백로그 504건**: `backlog_incomplete[]`
- **합계 692건** 추적 가능
- **세분화 백로그 ID**: MG, AP, SP, CP, AC, LD, API, NT, RLS, PAY, LP, LN, LA
- **감사 리포트**: `docs/CHAT_REQUEST_AUDIT.md` (2026-05-29)
- 상세: `docs/BACKLOG_INCOMPLETE.md`
- 생성 스크립트: `scripts/expand_backlog.py`
