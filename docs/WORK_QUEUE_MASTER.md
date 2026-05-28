# WORK QUEUE MASTER (188 requests · 504 backlog)
> 2026-05-29 · `docs/work-queue.json`이 정본
> **추적 가능 합계: 692건** (W001~ + backlog_incomplete)

## 재개

`시작` 입력 → `docs/START.md` 우선순위 (B001–B006 블로커 → 백로그 priority → W001~)

## 백로그 요약

| 항목 | 개수 |
|---|---|
| work_items (W001~) | 188 |
| backlog_incomplete | 504 |
| **합계** | **692** |

세부 ID 접두사: MG, AP, SP, CP, AC, LD, API, NT, RLS, PAY, LP, LN, LA — `docs/BACKLOG_INCOMPLETE.md`

## Commit&Push 실패

- **W007** (L36): `Execute the selected diff-tab push action....`
- **W170** (L1212): `Execute the selected diff-tab commit-and-push action....`
- **W173** (L1281): `Execute the selected diff-tab commit-and-push action....`
- **W175** (L1283): `Execute the selected diff-tab push action....`
- **W176** (L1284): `Execute the selected diff-tab push action....`
- **W177** (L1285): `Execute the selected diff-tab push action....`

## 카테고리별 요청 수

| 카테고리 | 개수 |
|---|---|
| build_error | 58 |
| auth | 37 |
| general | 27 |
| git_deploy | 22 |
| payment | 10 |
| meta | 7 |
| ui_ux | 7 |
| reviews | 5 |
| admin | 4 |
| notifications | 4 |
| database | 2 |
| mypage | 2 |
| seller | 2 |
| production | 1 |

## 전체 요청 인덱스 (W001~)

| ID | Cat | Pri | Status | Preview |
|---|---|---|---|---|
| W001 | general | medium | unknown | .env.local |
| W002 | build_error | critical | unknown | The Supabase setup has become inconsistent. Stop using the existing `schema.sql` |
| W003 | build_error | critical | unknown | Supabase setup is now complete.  I successfully ran `supabase/reset_and_seed.sql |
| W004 | build_error | critical | unknown | The Supabase API key error is resolved. I verified in Supabase SQL Editor that t |
| W005 | general | medium | unknown | cd ~/Documents/wadeal-v2 git status --short |
| W006 | git_deploy | high | unknown | git add . git commit -m "Connect Wadeal catalog to Supabase" |
| W007 | git_deploy | high | push_failed | Execute the selected diff-tab push action. |
| W008 | git_deploy | high | unknown | git add . git commit -m "Connect Wadeal catalog to Supabase" |
| W009 | auth | medium | unknown | 카카오 로그인 버튼을 실제 OAuth 로그인으로 연결하고 /auth/callback 경로를 만들기 |
| W010 | general | medium | unknown | 왜  테트  웹사이트가 안뜨지? |
| W011 | auth | medium | unknown | 로그인창까지 다뜨고 로그인햇는데 아직 설정오류에 있어 이용할수없데 |
| W012 | auth | medium | unknown | 다시 해봐줘. 카톡 로그인 또 안되 |
| W013 | git_deploy | high | unknown | 이메일(account_email) 요청을 뺀 수정사항을 Vercel 운영 사이트에 배포해줘. 배포 후 https://wadeal-v2.verce |
| W014 | git_deploy | high | unknown | 지금 운영 사이트에서 /login 화면의 ‘카카오로 시작하기’ 버튼을 누르면 카카오 OAuth 로그인 화면이 뜨지 않고 바로 /checkout/ |
| W015 | database | high | unknown | npm install @supabase/supabase-js @supabase/ssr |
| W016 | git_deploy | high | unknown | KOE205 / 카카오 설정 오류 해결 방법 제품 설정 → 카카오 로그인 → 동의항목에서 profile_nickname, profile_imag |
| W017 | auth | medium | unknown | 카카오톡 로그인 누르면 로그인으로 연결안되고 바로 홈페이지로 넘어가. |
| W018 | auth | medium | unknown | 카카오톡 로그인 누르면 로그인으로 연결안되고 바로 홈페이지로 넘어가. |
| W019 | git_deploy | high | unknown | Wadeal은 Supabase 기본 Kakao OAuth 대신 profile_nickname + profile_image만 요청하는 전용 로그인 |
| W020 | git_deploy | high | unknown | Wadeal은 Supabase Auth Kakao 제공자가 아닌 전용 Kakao OAuth를 사용합니다. 요청 scope는 profile_nic |
| W021 | general | medium | unknown | 값이 비어있네 |
| W022 | auth | medium | unknown | KAKAO_REST_API_KEY=[REDACTED_SECRET] KAKAO_CLIENT_SECRET=MukAtKyo |
| W023 | git_deploy | high | unknown | 하나씩하자. 일단 모든곳에 이전에 작업했던 pindoudou관련 주소와 자료들은 싹 지워줘. pindoudou / 예전 앱 연동 해제: 카카오  |
| W024 | auth | medium | unknown | 카카오 로그인 관련 커스텀 OAuth 코드와 KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET, SUPABASE_SERVI |
| W025 | git_deploy | high | unknown | 지금 카카오 로그인 설정이 너무 꼬여 있어서 처음부터 다시 정리할게.  아래 작업 진행해줘:  1. Wadeal 코드베이스에서 카카오 로그인 관 |
| W026 | git_deploy | high | unknown | 현재 /login 페이지가 아직 wadeal-test 기준 카카오 설정 안내와 기존 커스텀 OAuth 설정을 사용하고 있어. 새 Kakao 앱  |
| W027 | general | medium | unknown | 새로 만든 카톡 앱이야. 그전꺼는 삭제햇어. 이거로 업데이트해주면되 |
| W028 | general | medium | unknown | 이거도 참고해줘 |
| W029 | git_deploy | high | unknown | 카카오 로그인은 성공하지만 /mypage 에서 세션을 읽지 못하고 "로그인이 필요해요"가 뜹니다.  Supabase auth session 유지 |
| W030 | auth | medium | unknown | 카카오 로그인/마이페이지 세션 문제는 잠시 보류하고, 다음 기능으로 넘어가자.  가격 알림 저장 기능을 구현해줘.  목표: 1. /alert/[ |
| W031 | auth | medium | unknown | 이전 카카오 로그인 정리 작업은 마무리하고, 이제 가격 알림 기능 구현 작업만 진행해줘. |
| W032 | auth | medium | unknown | 가격 알림 저장 기능을 구현해줘.  목표: 1. /alert/[id] 에서 사용자가 원하는 목표 가격을 입력/선택 2. 저장 버튼을 누르면 Su |
| W033 | auth | medium | unknown | 카카오톡으로 알림 받기 눌러도 다음으로 넘어가지 않아. |
| W034 | auth | medium | unknown | /alert/[id] 화면에서 ‘카카오톡으로 알림받기’ 버튼이 눌리지 않습니다. 버튼 클릭 시 목표 가격 저장 로직이 실행되게 연결해주세요.   |
| W035 | auth | medium | unknown | /alert/[id]의 ‘카카오톡으로 알림받기’ 버튼이 여전히 눌리지 않습니다.  확인해서 수정해주세요: 1. button disabled 조건 |
| W036 | auth | medium | unknown | /alert/[id] 가격 알림 설정 버튼이 계속 안 눌립니다. 복잡한 조건 제거하고 버튼 클릭 테스트부터 되게 단순화해주세요.  수정: 1.  |
| W037 | auth | medium | unknown | 현재 가격 알림 기능 방향이 잘못됐습니다.  카카오톡 실제 발송은 아직 구현하지 않습니다. 버튼 이름도 혼란스러우니 일단 “가격 알림 저장하기” |
| W038 | auth | medium | unknown | 현재 가격 알림 기능 방향이 잘못됐습니다.  카카오톡 실제 발송은 아직 구현하지 않습니다. 버튼 이름도 혼란스러우니 일단 “가격 알림 저장하기” |
| W039 | general | medium | unknown | 현재 작업 상태 저장해주세요. 다음 작업에서 /alert/[id] 버튼 클릭 영역 및 price alert 저장 UX부터 다시 점검할 예정입니다 |
| W040 | auth | medium | unknown | /alert/[id] 가격 알림 버튼이 계속 안 눌리는 문제부터 디버깅해주세요.  우선 저장/Supabase/카카오톡 로직은 잠시 빼고, 클릭  |
| W041 | general | medium | unknown | 커서(pointer)는 전체 영역에 정상 적용됐습니다. 이제 버튼 클릭 이벤트만 안 먹습니다.  확인해주세요: 1. onClick 함수가 실제  |
| W042 | auth | medium | unknown | /alert/[id] 가격 알림 버튼 UX를 먼저 완성해주세요.  1. 버튼 문구: “가격 알림 설정하기” 2. 버튼 클릭 시 즉시 브라우저 c |
| W043 | auth | medium | unknown | Wadeal 프로젝트에서 /alert/[id] 가격 알림 설정 화면을 수정해줘.  목표: 1. "카카오톡으로 알림받기" 버튼 또는 알림 설정 버 |
| W044 | auth | medium | unknown | Wadeal 프로젝트에서 가격 알림 설정하기 버튼이 눌리지 않는 문제를 고쳐줘.  대상: - /alert/[id] 페이지 - "가격 알림 설정하 |
| W045 | auth | medium | unknown | /alert/[id] 가격 알림 화면을 수정해줘.  요구사항: 1. 5% 하락, 10% 하락, 목표 가격 직접 입력 카드가 클릭되게 해줘. 2. |
| W046 | auth | medium | unknown | 현재가보다 5프로 하락 10프로하락 목표가격 직접 설정 버튼 옵션 선택하는게 안되,  알림설정하기도 버튼도 안되. 일단 바꿀거는 가격 알림 설정 |
| W047 | general | medium | unknown | 오 됫어. 알림 메세지 받기 버튼 박스 빨간색 박스로 만들어줘 |
| W048 | auth | medium | unknown | 나중에 카카오톡 메세지 알림 받기랑. 알림 메세지 받기랑 연동 시킬거야. |
| W049 | mypage | medium | unknown | 다음 단계는 가격 알림을 “내 알림 목록”에 보이게 만들기야.  지금 목표:  알림 설정 완료 → 확인 누르면 → /mypage/alerts 이 |
| W050 | general | medium | unknown | 아까까지 가격 알림 설정 버튼 누르면 다 됬는데. 이제는 페이지가 안넘어가네 |
| W051 | general | medium | unknown | 내 가격 알림에 여러가지 알람 설정해놓으면 그게 다 떠야하는데 하나만 떠. |
| W052 | auth | medium | unknown | “가짜 데이터” → “실제 저장”으로 바꾸기  즉:  내가 가격 알림 설정하면 실제 Supabase DB에 저장되고 /mypage/alerts  |
| W053 | payment | high | unknown | Wadeal 마이페이지 큰틀을 먼저 정리해줘.  요구사항: 1. /mypage 에 아래 메뉴 카드들을 만들어줘.    - 내 가격 알림    - |
| W054 | payment | high | unknown | *Wadeal에서 /mypage/address 페이지를 만들어줘.  요구사항: 1. 페이지 제목: 배송지 관리 2. 기본 배송지 카드 예시 1개 |
| W055 | auth | medium | unknown | Wadeal /mypage 로그인 상태 표시 문제를 고쳐줘.  현재 문제: - 카카오 로그인은 된 상태인데 /mypage 에서 계속 "로그인이  |
| W056 | payment | high | unknown | Wadeal /mypage 화면을 로그인 상태 기준으로 정리해줘.  요구사항: 1. 로그인한 사용자는 상단에 사용자 정보 카드를 보여줘.     |
| W057 | notifications | high | unknown | Wadeal 전체 네비게이션 연결을 점검하고 정리해줘.  요구사항: 1. 하단 탭이 있다면 아래 경로로 정확히 이동하게 해줘.    - 홈: / |
| W058 | ui_ux | low | unknown | Wadeal에서 /saved 찜한 상품 화면을 정리해줘.  요구사항: 1. 페이지 제목: 찜한 상품 2. 찜한 상품 예시 카드 2개를 보여줘.  |
| W059 | notifications | high | unknown | Wadeal에서 /notifications 알림함 화면을 정리해줘.  요구사항: 1. 페이지 제목: 알림 2. 알림 예시 카드 3개를 보여줘.  |
| W060 | payment | high | unknown | Wadeal 상품 상세 페이지 /product/[id]를 점검하고 정리해줘.  요구사항: 1. 상품 이미지, 상품명, 현재가, 공동구매가가 잘  |
| W061 | payment | high | unknown | Wadeal 상품 상세 페이지 /product/[id]를 점검하고 정리해줘.  요구사항: 1. 상품 이미지, 상품명, 현재가, 공동구매가가 잘  |
| W062 | payment | high | unknown | Wadeal 공동구매 참여 화면 /join/[id]를 정리해줘.  요구사항: 1. 페이지 제목: 공동구매 참여 2. 상품명, 현재 공동구매가,  |
| W063 | payment | high | unknown | Wadeal 체크아웃 화면 /checkout/[id]를 정리해줘.  요구사항: 1. 페이지 제목: 주문 확인 2. 상품 정보 카드 표시    - |
| W064 | payment | high | unknown | Wadeal 참여 완료 화면 /join-complete 를 정리해줘.  요구사항: 1. 페이지 제목: 공동구매 참여 완료 2. 완료 메시지:   |
| W065 | auth | medium | unknown | Wadeal 공유 화면 /share/[id]를 정리해줘.  요구사항: 1. 페이지 제목: 친구 초대하기 2. 안내 문구:    - 친구가 함께  |
| W066 | notifications | high | unknown | Wadeal 전체 MVP 클릭 흐름을 점검해줘.  목표: 아직 실제 DB/결제/카카오 API 연동은 하지 말고, 화면 이동과 버튼 클릭이 끊기지 |
| W067 | ui_ux | low | unknown | Wadeal 홈 화면 / 디자인 퀄리티를 개선해줘.  요구사항: 1. 상품 카드 디자인을 더 깔끔한 한국 쇼핑앱 느낌으로 개선해줘. 2. 화이트 |
| W068 | ui_ux | low | unknown | Wadeal 전체 상품 카드와 상품 상세 페이지에 공동구매 진행률 UI를 강화해줘.  요구사항: 1. 진행률 바(progress bar)를 추가 |
| W069 | ui_ux | low | unknown | Wadeal 상품 상세 페이지와 공동구매 페이지에 "인원이 모일수록 가격 하락" 구조를 더 직관적으로 보여줘.  요구사항: 1. 가격 단계 UI |
| W070 | ui_ux | low | unknown | Wadeal 홈, 상품 상세, 공동구매 참여 화면에 마감 시간 UI를 추가해줘.  요구사항: 1. 상품 카드에 마감 정보 표시    - 예: 오 |
| W071 | general | medium | unknown | 전체적으로 작동안되는 버튼과, 페이지가 있는지 체크해줘 안되는거는 되게 해주고. 오류 없는지. 작동안되는거 없는지 확인해줘 |
| W072 | auth | medium | unknown | 로그인하기 안되고. 카카오톡 로그인 페이지로 넘어가던게 다시안되. 로그인 후  아이디정보가 맨위에 떠있는거도안되. |
| W073 | auth | medium | unknown | Wadeal 카카오 로그인 연결을 복구해줘.  현재 문제: - /login 에서 카카오 로그인 버튼을 눌러도 카카오 로그인 페이지로 이동하지 않 |
| W074 | auth | medium | unknown | Wadeal 로그인 세션 유지 문제를 안정화해줘.  요구사항: 1. 앱 시작 시 Supabase 세션을 읽어서 로그인 상태를 유지해줘. 2. 새 |
| W075 | payment | high | unknown | Wadeal 공동구매 참여 완료 시 Supabase에 실제 주문 데이터를 저장해줘.  목표: - /checkout/[id] 에서 - "공동구매  |
| W076 | ui_ux | low | unknown | create table if not exists orders (   id uuid primary key default gen_random_uui |
| W077 | auth | medium | unknown | 실제 주문 저장 테스트  이제 Wadeal에서 해볼 것:  로그인 상품 상세 공동구매 참여 체크아웃 공동구매 참여 완료하기 클릭  그 다음 Su |
| W078 | auth | medium | unknown | Wadeal 가격 알림 저장을 실제 Supabase alerts 테이블에 연결해줘.  대상: - /alert/[id] - /mypage/aler |
| W079 | database | high | unknown | 홈 상품 데이터도 Supabase 실제 데이터로 통일  지금 일부는 더미 데이터 섞여 있을 가능성이 커. 이제 상품 목록 전체를 DB 기반으로  |
| W080 | ui_ux | low | unknown | Wadeal 상단 헤더 로고 클릭 문제를 고쳐줘.  현재 문제: - 메인페이지 왼쪽 상단 Wadeal 로고/텍스트를 눌러도 홈으로 이동하지 않는 |
| W081 | auth | medium | unknown | 1. 상품 검색 기능 Wadeal 홈 화면에 상품 검색 기능을 추가해줘.  요구사항: 1. 상단 검색창 추가 2. placeholder:     |
| W082 | mypage | medium | unknown | 11. 상품 찜하기 기능 UI Wadeal 상품 찜하기 UI를 추가해줘.  요구사항: 1. 상품 카드와 상품 상세에 하트 아이콘 추가 2. 클릭 |
| W083 | auth | medium | unknown | 상품 상세페이지에 리뷰랑 별점 적는 기능도 있으면 좋겟어. 리뷰랑 별정은  구매한 사람만 쓸수있어.   좋아. 이건 서비스 신뢰도에 좋아. 근데 |
| W084 | auth | medium | unknown | 상품 상세페이지에 리뷰랑 별점 적는 기능도 있으면 좋겟어. 리뷰랑 별정은  구매한 사람만 쓸수있어.   좋아. 이건 서비스 신뢰도에 좋아. 근데 |
| W085 | reviews | medium | unknown | 맞아. 상품 상세 구조는 이렇게 가는 게 더 쇼핑몰 같아.  상품명 옆/아래 상단 정보  별점 ★ 4.8 리뷰수 리뷰 128개 구매수량 누적 1 |
| W086 | auth | medium | unknown | 리뷰 저장 기능을 코드에 연결이야.  Wadeal 리뷰 작성 기능을 Supabase reviews 테이블에 실제 저장되게 연결해줘.  대상: - |
| W087 | auth | medium | unknown | Wadeal 리뷰 기능을 운영용으로 조금 더 정리해줘.  요구사항: 1. /product/[id] 리뷰 섹션에서 최신순으로 리뷰를 보여줘. 2. |
| W088 | reviews | medium | unknown | Wadeal 리뷰 섹션에 신고 기능 UI를 추가해줘.  요구사항: 1. 각 리뷰 카드에 "신고" 버튼을 추가해줘. 2. 신고 버튼 클릭 시 모달 |
| W089 | reviews | medium | unknown | Cursor에 붙여넣어줘:  Wadeal 리뷰 수정/삭제 기능을 실제 Supabase reviews 테이블과 연결해줘.  요구사항: 1. 본인이 |
| W090 | reviews | medium | unknown | 리뷰 좋아요 기능 + 베스트 리뷰  Cursor에 붙여넣어줘:  Wadeal 리뷰 섹션에 좋아요 기능과 베스트 리뷰 UI를 추가해줘.  요구사항 |
| W091 | auth | medium | unknown | Wadeal 리뷰 신고 기능을 Supabase review_reports 테이블에 저장되게 연결해줘.  요구사항: 1. 리뷰 신고 모달에서 신고 |
| W092 | admin | high | unknown | Wadeal 관리자용 신고 리뷰 관리 화면 큰틀을 만들어줘.  대상: - /admin/review-reports  요구사항: 1. 페이지 제목: |
| W093 | admin | high | unknown | Wadeal 관리자 페이지 접근 보호 큰틀을 추가해줘.  대상: - /admin/review-reports  요구사항: 1. 현재 로그인 사용자 |
| W094 | general | medium | unknown | 전체적으로 막히는거 없는지 에러없는지 안먹히는 버튼없는지 오류 있는지 확인하고 문제가 있다면 잘 작동되게 고쳐줘 |
| W095 | general | medium | unknown | 첫 메인화면이 잘 안뜨는데 무슨문제야? |
| W096 | general | medium | unknown | 첫 메인화면이 잘 안뜨는데 무슨문제야? |
| W097 | general | medium | unknown | 전체적으로 오류고 작동안하고 안뜨는거 다시 수정해줘 |
| W098 | general | medium | unknown | 고쳣어 어때? |
| W099 | general | medium | unknown | 주소 뭐로드가서 확인해야해 안뜨는데 |
| W100 | general | medium | unknown | 다음은 뭐해야해 |
| W101 | general | medium | unknown | 다음할수잇는거 해줘 |
| W102 | general | medium | unknown | 둘다 차례대로 |
| W103 | production | high | unknown | 계속 추가할거 추가하고 수정할거 수정해줘. 상용화 버전으로 만들거야 |
| W104 | general | medium | unknown | 일단 되는거 부터 쭉하자 |
| W105 | general | medium | unknown | 일단 되는거 부터 쭉하자 |
| W106 | reviews | medium | unknown | 상품 상세페이지를 상업용 공동구매 플랫폼 수준으로 개선해줘.  요구사항: 1. 상품 이미지/상세컷 영역을 보기 좋게 구성 2. 상품명, 가격,  |
| W107 | build_error | critical | unknown | 관리자 페이지에 상품 등록/수정 기능을 만들어줘.  요구사항: 1. /admin/products 페이지 생성 2. 상품 목록 표시 3. 상품 등 |
| W108 | build_error | critical | unknown | 관리자 주문 관리 페이지를 만들어줘.  요구사항: 1. /admin/orders 페이지 생성 2. 전체 주문 목록 표시 3. 주문 목록 항목:  |
| W109 | build_error | critical | unknown | 관리자 상품 이미지 업로드 기능을 만들어줘.  요구사항: 1. Supabase Storage를 사용해서 상품 이미지를 업로드 2. 버킷 이름은  |
| W110 | admin | high | unknown | Supabase Storage에 product-images 버킷을 만들고, 관리자만 업로드/수정/삭제 가능하고 모든 사용자는 이미지를 볼 수 있 |
| W111 | build_error | critical | unknown | 와딜은 쿠팡/위메프 같은 커머스 앱 형태의 공동구매 플랫폼이다. 단순 랜딩페이지가 아니라 실제 쇼핑몰 앱처럼 만들어야 한다.  핵심 구조: 여러 |
| W112 | build_error | critical | unknown | 와딜은 실제 상용화할 공동구매 커머스 플랫폼이다. 쿠팡/위메프 같은 쇼핑몰 앱 구조에, 여러 명이 같이 살수록 가격이 내려가는 수량 구간별 공동 |
| W113 | admin | high | unknown | 이제부터 진짜 중요한 건 “예쁘게 만들기”보다:  구조 확장성 결제 흐름 주문 상태 정산 구조 운영 편의성 트래픽 대응 모바일 UX DB 설계  |
| W114 | build_error | critical | unknown | 이번 작업 목표: 공동구매 가격 단계 로직을 실제 서비스 핵심 기능으로 반영한다.  중요: - 기존 디자인/레이아웃 최대한 유지 - 불필요한 랜 |
| W115 | build_error | critical | unknown | 와딜은 수량 구간별 공동구매 플랫폼이다. 사용자는 먼저 공동구매에 참여하고, 마감 시 최종 누적 수량에 따라 최종 가격이 확정된다.  이번 작업 |
| W116 | build_error | critical | unknown | 디자인은 건드리지 말고, 공동구매 마감 처리 로직을 상용화 기준으로 구현해줘.  와딜은 여러 명이 같이 구매해서 누적 수량이 많아질수록 가격이  |
| W117 | build_error | critical | unknown | 디자인은 건드리지 말고, 공동구매 마감 처리 로직을 상용화 기준으로 구현해줘.  와딜은 여러 명이 같이 구매해서 누적 수량이 많아질수록 가격이  |
| W118 | build_error | critical | unknown | 디자인은 건드리지 말고, 실제 PG 결제 연동 전에 필요한 결제 준비 구조를 상용화 기준으로 정리해줘.  와딜은 공동구매 마감 후 최종 수량에  |
| W119 | build_error | critical | unknown | 디자인은 건드리지 말고, 배송/송장/구매확정 흐름을 상용화 기준으로 구현해줘.  와딜은 공동구매 마감 후 최종 가격이 확정되고, 결제 완료 후  |
| W120 | build_error | critical | unknown | 디자인은 건드리지 말고, 리뷰/별점 기능을 상용화 기준으로 정리해줘.  와딜은 실제 공동구매 커머스 플랫폼이므로 리뷰는 반드시 실제 구매자 기반 |
| W121 | build_error | critical | unknown | 디자인은 건드리지 말고, 찜/최근 본 상품/장바구니형 참여 흐름을 상용화 기준으로 구현해줘.  와딜은 쿠팡/위메프 같은 커머스 앱 구조에 수량  |
| W122 | build_error | critical | unknown | 디자인은 건드리지 말고, 검색/카테고리/필터 기능을 상용화 기준으로 구현해줘.  와딜은 쿠팡/위메프 같은 커머스 앱 구조에 수량 구간별 공동구매 |
| W123 | build_error | critical | unknown | 디자인은 건드리지 말고, 알림/마감임박/가격단계 달성 알림 기능을 상용화 기준으로 구현해줘.  와딜은 수량이 모일수록 가격이 내려가는 공동구매  |
| W124 | build_error | critical | unknown | 디자인은 건드리지 말고, 친구 공유/초대/바이럴 기능을 상용화 기준으로 구현해줘.  와딜은 여러 명이 함께 살수록 가격이 내려가는 공동구매 플랫 |
| W125 | build_error | critical | unknown | 디자인은 건드리지 말고, 고객센터/문의/환불요청 기능을 상용화 기준으로 구현해줘.  와딜은 실제 운영할 공동구매 커머스 플랫폼이다.  이번 작업 |
| W126 | build_error | critical | unknown | 디자인은 건드리지 말고, 정산/공급사/입점 판매자 구조를 상용화 기준으로 설계하고 구현해줘.  와딜은 실제 운영할 공동구매 커머스 플랫폼이다.  |
| W127 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜 전체 코드의 보안/RLS/서버 검증을 상용화 기준으로 점검하고 보강해줘.  와딜은 실제 운영할 공동구매 커머스 플 |
| W128 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 성능/SEO/모바일 PWA 구조를 상용화 기준으로 개선해줘.  와딜은 실제 운영할 공동구매 커머스 플랫폼이다.  |
| W129 | git_deploy | high | unknown | 디자인은 건드리지 말고, 와딜의 운영 전 최종 QA와 출시 준비 체크리스트를 코드/문서 기준으로 정리해줘.  와딜은 실제 상용화할 공동구매 커머 |
| W130 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 약관/개인정보처리방침/환불정책 페이지를 상용화 준비 기준으로 추가해줘.  와딜은 실제 운영할 공동구매 커머스 플 |
| W131 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 약관/개인정보처리방침/환불정책 페이지를 상용화 준비 기준으로 추가해줘.  와딜은 실제 운영할 공동구매 커머스 플 |
| W132 | build_error | critical | unknown | Cursor 입력용: 판매자 센터 기초 뼈대 구축 프롬프트 "와딜(Wadeal) 플랫폼의 '판매자 센터(/seller)'를 별도로 구축할 거야. |
| W133 | build_error | critical | unknown | 와딜은 실제 상용화할 커머스 플랫폼이다.  서비스에는 2가지 상품 유형이 존재한다.  1. 일반상품 - 쿠팡처럼 즉시결제 - 결제 완료 즉시 주 |
| W134 | build_error | critical | unknown | 디자인은 건드리지 말고, 결제수단 선택 UI와 주문 흐름 분기를 상용화 기준으로 구현해줘.  와딜은 일반상품 즉시결제와 공동구매 참여형 결제를  |
| W135 | build_error | critical | unknown | 디자인은 건드리지 말고, 결제수단 선택 UI와 주문 흐름 분기를 상용화 기준으로 구현해줘.  와딜은 일반상품 즉시결제와 공동구매 참여형 결제를  |
| W136 | build_error | critical | unknown | 디자인은 건드리지 말고, 운영자 대시보드와 매출/주문 통계를 상용화 기준으로 구현해줘.  와딜은 실제 운영할 공동구매 커머스 플랫폼이다.  이번 |
| W137 | build_error | critical | unknown | 디자인은 건드리지 말고, Toss Payments 결제위젯 실제 연결 구조를 상용화 기준으로 구현해줘.  와딜은 일반상품 즉시결제와 공동구매 마 |
| W138 | build_error | critical | unknown | 디자인은 건드리지 말고, Toss Payments webhook과 가상계좌 입금완료 처리 구조를 상용화 기준으로 구현해줘.  와딜은 카드/간편결 |
| W139 | build_error | critical | unknown | 디자인은 건드리지 말고, 자동결제/빌링키 기능을 선택 기능으로 분리해서 상용화 기준으로 준비해줘.  와딜은 일반상품 즉시결제와 공동구매 마감 후 |
| W140 | build_error | critical | unknown | 디자인은 건드리지 말고, 실제 운영용 상품 데이터와 카테고리 시드 구조를 상용화 기준으로 정리해줘.  와딜은 일반상품 즉시결제와 공동구매 상품을 |
| W141 | build_error | critical | unknown | 디자인은 건드리지 말고, 운영자용 상품 등록 검수/승인 플로우를 상용화 기준으로 구현해줘.  와딜은 일반상품과 공동구매상품을 함께 운영하는 커머 |
| W142 | build_error | critical | unknown | 디자인은 건드리지 말고, 재고/품절/구매수량 제한 기능을 상용화 기준으로 구현해줘.  와딜은 일반상품 즉시결제와 공동구매 상품을 함께 운영하는  |
| W143 | build_error | critical | unknown | 디자인은 건드리지 말고, 쿠폰/포인트/할인 정책을 상용화 기준으로 구현해줘.  와딜은 일반상품 즉시결제와 공동구매 상품을 함께 운영하는 커머스  |
| W144 | build_error | critical | unknown | 디자인은 건드리지 말고, 배송비/지역별 배송/제주·도서산간 추가비를 상용화 기준으로 구현해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스 |
| W145 | build_error | critical | unknown | 디자인은 건드리지 말고, 주소록/기본 배송지/배송 메모 기능을 상용화 기준으로 구현해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫 |
| W146 | build_error | critical | unknown | 디자인은 건드리지 말고, 휴대폰 본인인증/주문자 정보 검증 구조를 상용화 기준으로 준비해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스  |
| W147 | build_error | critical | unknown | 디자인은 건드리지 말고, 사업자 정보/통신판매업 신고 정보/푸터 운영정보를 상용화 기준으로 추가해줘.  와딜은 실제 운영할 일반상품 + 공동구매 |
| W148 | build_error | critical | unknown | 디자인은 건드리지 말고, 운영 로그/관리자 활동 기록 기능을 상용화 기준으로 구현해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼 |
| W149 | build_error | critical | unknown | 디자인은 건드리지 말고, 장애 대응/에러 로그/모니터링 구조를 상용화 기준으로 준비해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫 |
| W150 | git_deploy | high | unknown | 디자인은 건드리지 말고, 와딜의 오픈 직전 실제 운영 준비 체크리스트와 관리자 점검 화면을 상용화 기준으로 정리해줘.  와딜은 실제 운영할 일반 |
| W151 | git_deploy | high | unknown | 디자인은 건드리지 말고, 와딜 전체 서비스 구조를 문서화하고 개발 인수인계 문서를 상용화 기준으로 작성해줘.  와딜은 실제 운영할 일반상품 +  |
| W152 | git_deploy | high | unknown | 디자인은 건드리지 말고, 와딜의 남은 TODO를 정리하고 MVP 출시 범위를 확정하는 문서를 만들어줘.  와딜은 실제 운영할 일반상품 + 공동구 |
| W153 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 출시 전 코드 정리와 안정화 작업을 상용화 기준으로 진행해줘.  와딜은 실제 운영할 일반상품 + 공동구매 커머스 |
| W154 | build_error | critical | unknown | 🛒 이커머스 마이페이지 핵심 구성 요소 1. 상단 대시보드 (사용자 요약 정보)  프로필: 사용자 이름(닉네임) 및 현재 회원 등급  혜택 요약 |
| W155 | payment | high | unknown | subagent-ba773159-6bd4-47cc-80a9-82852fdfea2e subagent-c4ced15a-34e6-47e2-924c-9 |
| W156 | build_error | critical | unknown | Cursor 복사/붙여넣기용 프롬프트 "지금까지 구현한 마이페이지 및 계정 관리 로직은 그대로 유지하면서, 실제 상용 쇼핑몰 수준의 디테일을 위 |
| W157 | build_error | critical | unknown | 판매자 센터(Seller Center) 구축 전략 현재 프로젝트 구조 안에서 다음과 같이 라우트를 나누어 구축하는 것이 가장 효율적입니다.  / |
| W158 | build_error | critical | unknown | Cursor 복사/붙여넣기용 프롬프트 "디자인 톤은 깔끔한 관리자/대시보드 스타일(Tailwind 기반)로 유지하면서, 와딜의 입점 판매자 가입 |
| W159 | build_error | critical | unknown | 💡 판매자 센터에 추가로 보충해야 할 4가지 기능 1. 판매자 전용 통계 대시보드 (Seller Analytics)  이유: 판매자가 로그인했을 |
| W160 | build_error | critical | unknown | Cursor 복사/붙여넣기용 '판매자 재무/정보 세부 관리' 프롬프트 "앞서 구축한 판매자 센터(/seller)에 실제 상용 쇼핑몰 수준의 '재 |
| W161 | notifications | high | unknown | 새 파일 생성:  app/admin/notifications/page.tsx  아래 코드 붙여넣기.  import Link from "next/ |
| W162 | seller | high | unknown | CURSOR: 관리자 주문상세 페이지에서 액션 연결  파일 열기:  app/admin/orders/[id]/page.tsx  맨 위 import |
| W163 | build_error | critical | unknown | 1번 방식(자동 차감 정산)을 위한 시스템 보완 포인트 1번 방식을 채택하시려면 DB와 비즈니스 로직에 다음 구조를 추가해야 합니다.  정산 명 |
| W164 | seller | high | unknown | CURSOR: 택배사 상수 파일 생성  파일 생성:  lib/shipping/couriers.ts export const COURIERS = [ |
| W165 | build_error | critical | unknown | 디자인은 건드리지 말고, 판매자센터 리뷰 답글/평점 관리 화면을 상용화 기준으로 구현해줘.  와딜은 고객, 판매자, 관리자 3가지 권한이 있는  |
| W166 | build_error | critical | unknown | 디자인은 건드리지 말고, 판매자센터 리뷰 답글/평점 관리 화면을 상용화 기준으로 구현해줘.  와딜은 고객, 판매자, 관리자 3가지 권한이 있는  |
| W167 | build_error | critical | unknown | 디자인은 건드리지 말고, 판매자센터 공지/운영정책/자료실 기능을 상용화 기준으로 구현해줘.  와딜은 고객, 판매자, 관리자 3가지 권한이 있는  |
| W168 | build_error | critical | unknown | 디자인은 건드리지 말고, 판매자 입점 신청 심사 체크리스트와 관리자 심사 화면을 상용화 기준으로 구현해줘.  와딜은 고객, 판매자, 관리자 3가 |
| W169 | build_error | critical | unknown | 다음은 **금지 상품 / 카테고리별 검수 기준**이야. 판매자 입점까지 붙이면 이건 꼭 필요해.  Cursor/Codex에 그대로 보내:  `` |
| W170 | git_deploy | high | push_failed | Execute the selected diff-tab commit-and-push action. |
| W171 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 고객/판매자/관리자 알림 구조를 상용화 기준으로 통합해줘.  와딜은 고객, 판매자, 관리자 3가지 권한이 있는  |
| W172 | build_error | critical | unknown | 디자인은 건드리지 말고, 와딜의 고객/판매자/관리자 알림 구조를 상용화 기준으로 통합해줘.  와딜은 고객, 판매자, 관리자 3가지 권한이 있는  |
| W173 | git_deploy | high | push_failed | Execute the selected diff-tab commit-and-push action. |
| W174 | git_deploy | high | build_error_reported | 파일 열기:  app/actions/admin-seller-settlements.ts  여기 부분 찾기:  import {   notifySel |
| W175 | git_deploy | high | push_failed | Execute the selected diff-tab push action. |
| W176 | git_deploy | high | push_failed | Execute the selected diff-tab push action. |
| W177 | git_deploy | high | push_failed | Execute the selected diff-tab push action. |
| W178 | general | medium | unknown | 일단 지금거 까지 다 저장해줘. 요청 사항, 완료안된것들, 오류난것들 전부 다. 너무 느려져서 컴퓨터 재부팅하고 미완료된거 처리안된거 오류난것들 |
| W179 | general | medium | unknown | 재부팅하고 올게. 미완료된작업, 오류난작업, 미전송된 작업요청들, 예약해놓은 작업 . '시작' 이라고 명령어 치면 모든  작업 다시 시작하는거야 |
| W180 | general | medium | unknown | 커밋&푸쉬 누른 항목들 있는데 저거 다 미완료 항목들이라서 저 모든 작업들도 다 저장해놔줘 |
| W181 | meta | high | pending | 작업 요청한것들 미완료된것들 새로운 작업들만해도 가각 100개가 넘는데 그거도 다 저장햇어? |
| W182 | meta | high | done | 응 |
| W183 | meta | high | done | 응 |
| W184 | meta | high | done | 응 |
| W185 | general | medium | unknown | 미완료, 요청햇던 작업들, 에러난 작업들 100개도 넘을거야. 아마. 이것들 작업 요청 내용들 다 저장해놔줘. 시작치면 전부다 하나씩 재게줘.  |
| W186 | meta | low | unknown | 됫어 |
| W187 | meta | low | unknown | 만들엇어 |
| W188 | meta | critical | pending | 채팅내용 내가 요구한 작업 내용 그대로 다 저장해야해/ 빠짐없이 . |

## 알려진 에러

| ID | 제목 | 수정 |
|---|---|---|
| E001 | npm run build 미통과 | createAdminProduct group_buy_deals.insert에 current_quantity: 0 |
| E002 | admin-products ProductRow insert 필드 | staged diff 확인 후 커밋 |
| E003 | git push 실패 | gh auth login 또는 SSH remote |
| E004 | npx vercel --prod 보류 | Q-BUILD 후 실행 |
| E005 | notifySellerSettlementPaid 중복 (사용자 보고) | seller-events만 사용, seller-finance export 제거 확인 |
| E006 | Supabase migration 원격 미적용 | SQL Editor 순차 적용 |
| E007 | admin-products.ts MM 상태 | git diff / --cached 정리 |

## 전체 resume_command

각 항목 전문은 `docs/work-queue.json` → `work_items[].resume_command` 및 `docs/work-queue-prompts/part-*.md`
