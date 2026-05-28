# 와딜 재개 명령 (`시작`)

> 생성: 2026-05-27 · 갱신: 2026-05-29 · 총 **188**개 사용자 요청 저장됨

## 한 줄 재개

채팅에 아래만 입력:

```
시작
```

또는:

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

## 우선순위 (재부팅 직후)

1. **Q-BUILD** — `npm run build` 통과 (**B001**, **E001**, **E002**, **B006**)
2. **Q-DOABLE-BACKLOG** — `backlog_incomplete[]` 중 `external_auth_deferred`에 **없는** 항목만 · **priority high → medium → low**, 동순위는 ID 순
3. **W001~W188** — `external_auth_deferred.work_item_ids`에 **없는** 채팅 요청 순차 실행
4. **Q-EXTERNAL-AUTH-LAST** — git push, Vercel, 원격 Supabase migration, Toss/PG, OAuth/Kakao 등 · 상세: [`docs/EXTERNAL_AUTH_DEFERRED.md`](./EXTERNAL_AUTH_DEFERRED.md)

> **B002** (로컬 커밋)는 외부 인증 불필요하지만 사용자가 커밋을 요청할 때만 실행.

## 세분화 백로그 ID 접두사

| 접두사 | 범위 |
|---|---|
| MG | `supabase/migrations/*.sql` 원격 적용·스키마 검증 → **Q-EXTERNAL-AUTH-LAST** |
| AP | `app/admin/**/page.tsx` |
| SP | `app/seller/**/page.tsx` |
| CP | 고객·마이페이지·결제 등 `app/**/page.tsx` (admin/seller 제외) |
| AC | `app/actions/*.ts` |
| LD | `lib/data/*.ts` |
| API | `app/api/**/route.ts` |
| NT | `lib/notifications/types.ts` 알림 타입별 E2E |
| RLS | 테이블·Storage RLS 검증 버킷 |
| PAY | Toss webhook·confirm·billing·환불 → **Q-EXTERNAL-AUTH-LAST** |
| LP / LN / LA | `lib/payments`, `lib/notifications`, `lib/auth` |

레거시 백로그: **B**, **N**, **S**, **A**, **P**, **M**, **D**, **V**, **G**, **PF**, **E**

## 파일

| 파일 | 용도 |
|------|------|
| `docs/work-queue.json` | W001~ + `backlog_incomplete[]` + `external_auth_deferred` + `resume_order` |
| `docs/EXTERNAL_AUTH_DEFERRED.md` | 외부 인증/원격 작업 분류·카운트 |
| `docs/BACKLOG_INCOMPLETE.md` | 백로그 접두사별 목록 |
| `docs/WORK_QUEUE_MASTER.md` | 인덱스·카테고리·에러·push 실패 |
| `docs/REBOOT_CHECKPOINT.md` | Git/빌드/완료·미완료 요약 |
| `docs/COMMIT_PUSH_QUEUE.md` | Commit&Push 탭 실패 항목 |

## Git (저장 시점 — 갱신 필요 시 `git status` 실행)

- `main` ahead of `origin/main` (unpushed commits)
- 입점 심사·금지상품 검수 등 로컬 미커밋 작업 있을 수 있음 — `git status`로 확인

## 추가 저장 (2차)

- **채팅 요청 W001~W188**: `work_items[]`
- **기능/미완료 백로그 504건**: `backlog_incomplete[]`
- **외부 인증 지연 172 backlog + 58 W**: `external_auth_deferred`
- **합계 692건** 추적 가능
- 상세: `docs/BACKLOG_INCOMPLETE.md`, `docs/EXTERNAL_AUTH_DEFERRED.md`
