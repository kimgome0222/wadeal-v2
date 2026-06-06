# 돌아오셨을 때 확인 가이드 (Wadeal)

> 갱신: 2026-05-30 · 코드/문서만으로 진행 가능한 작업은 계속 반영 중입니다.  
> **외부 승인·연결·SQL**은 아래 표만 보고 진행하시면 됩니다.

---

## 1. 지금 앱에서 바로 확인할 것

| 화면 | 확인 |
|------|------|
| **앱 첫 진입** | 흰 배경 + 가운데 **Wadeal** 워드마크 0.8초 노출 후 사라짐 (탭 세션당 1회) |
| **홈** | 상단: 로고 · **알림 · 장바구니 · 마이** / 아래: 둥근 **검색창** / **5열 카테고리 아이콘** |
| **마이** | 카카오 로그인 후 **닉네임** 표시 (UUID 아님) · 탭 시 **개인정보** |
| **검색** | `/search` · 카테고리 칩 · 하위 카테고리 · 필터 |
| **카테고리** | `/category/[slug]` · 하위 탭 · 정렬/가격 필터 |

로컬 실행:

```bash
cd wadeal-v2
npm run dev
# 또는 빌드 확인
NODE_OPTIONS='--max-old-space-size=6144' npm run build
```

---

## 2. Supabase SQL Editor (직접 실행)

Dashboard → **SQL Editor** → 아래 파일 순서대로 (미적용분만).

| 순서 | 파일 | 내용 |
|------|------|------|
| 1 | `supabase/migrations/030_business_settings.sql` | 사업자/고객센터 정보 |
| 2 | `038_notifications_unified.sql` | 알림 통합 |
| 3 | `039` ~ `045` | 판매자·정산·환불 등 |
| 선택 | `046_categories_subcategories.sql` | DB 카테고리 (앱은 정적 catalog fallback 있음) |

적용 확인: `/admin/settings/migrations` 또는 `node scripts/probe-migrations.mjs`

---

## 3. 외부 승인·연결 (코드 밖)

| ID | 작업 | 방법 |
|----|------|------|
| **B003** | Git push | `gh auth login` 또는 SSH remote → `git push origin main` |
| **B004** | Vercel 배포 | push 후 `npx vercel --prod` |
| **AUTH-001** | 카카오 OAuth 운영 | [kakao-auth-reconnect.md](./kakao-auth-reconnect.md) · Supabase Redirect URL |
| **PAY-001** | Toss 결제/환불 live | Vercel env + Toss 가맹점 |
| **KAKAO-CS** | 카카오 채널 CS | `.env.local` → `NEXT_PUBLIC_KAKAO_CHANNEL_URL` |

상세 ID 목록: [EXTERNAL_AUTH_DEFERRED.md](./EXTERNAL_AUTH_DEFERRED.md)  
미해결 이슈: [DEFERRED_ISSUES.md](./DEFERRED_ISSUES.md)

---

## 4. 환경변수 (Vercel Production)

필수는 [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) 참고.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (배포 도메인)
- (선택) `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`, `NEXT_PUBLIC_KAKAO_CHANNEL_URL`

---

## 5. 백업·복구

```bash
git tag -l 'backup-*'
git checkout backup-2026-05-30   # 최신 태그 확인 후
```

로컬 tarball: `backups/wadeal-v2-*.tar.gz` (프로젝트 밖 경로일 수 있음 — `docs/BACKUP_SNAPSHOT_2026-05-30.md`)

---

## 6. Wadeal 컨셉 유지 (변경 금지)

- **색감**: 화이트 · 블랙 텍스트 · **레드** 포인트 (`wadeal-red`)
- **핵심**: **공동구매** · 인원/수량별 **할인 단계** · 마감 후 최종가
- **레퍼런스**: 쿠팡/오늘의집 UX **패턴만** · 전체 리디자인 아님

---

## 7. 다음 자동 개선 예정 (코드)

- 상품 상세·체크아웃 쿠팡형 정보 밀도
- 장바구니(`/join-cart`) 뱃지 카운트
- 홈 섹션 스켈레ton·이미지 lazy (속도)
- PWA 스플래시 (manifest) — 네이티브 앱 전환 시

별도 지시 없으면 위 항목 순으로 계속 반영합니다.
