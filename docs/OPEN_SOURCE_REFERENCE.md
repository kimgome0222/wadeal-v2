# CELLOH Open Source Reference

CELLOH 운영 시 참고·적용한 오픈소스를 추적하기 위한 문서입니다.

- **Referenced**: UI/UX·아키텍처 참고만 (설치·런타임 미사용)
- **Integrated**: `package.json`에 등록되어 빌드·런타임에 사용

> 페이지 표시: [`/open-source`](/open-source)  
> 데이터 소스: `lib/open-source/` (UI 참고 목록 + `package.json` 자동 수집)

---

## 갱신 방법

새 라이브러리를 참고하거나 도입할 때 **아래 두 곳을 함께** 업데이트합니다.

| 대상 | 파일 |
|------|------|
| UI/UX 참고 항목 | `lib/open-source/ui-references.ts` + 본 문서 **UI/UX 참고** |
| npm 사용 패키지 메타 | `lib/open-source/npm-packages.ts` + 본 문서 **프로젝트 사용 패키지** |
| 실제 설치 | `package.json` (`npm install` — 본 작업 범위 외) |

`package.json`의 dependencies / devDependencies는 `getIntegratedPackagesFromPackageJson()`으로 **자동 수집**됩니다.  
표시 이름·GitHub URL·적용 화면은 `npm-packages.ts` 레지스트리에서 보강합니다.

---

## UI/UX 참고

마켓컬리 [오픈소스](https://github.com/marketkurly) 공개 페이지의 **정보 구조·가독성**을 참고합니다.  
아래 iOS 라이브러리는 CELLOH 웹앱에 **설치하지 않습니다**.

| 이름 | GitHub | 참고 목적 | status | 적용 화면 |
|------|--------|-----------|--------|-----------|
| Kingfisher | https://github.com/onevcat/Kingfisher | 상품·카드 이미지 lazy load, placeholder, 캐시 UX | referenced | 홈, 카테고리, 상품 상세, 찜, 검색 |
| Moya | https://github.com/Moya/Moya | API 레이어 분리, 에러·로딩 상태 일관성 | referenced | 로그인, 마이셀로, 장바구니, 알림 |
| Alamofire | https://github.com/Alamofire/Alamofire | 네트워크 요청 패턴, 재시도·타임아웃 UX | referenced | 로그인, 회원가입, 결제 |
| Lottie | https://github.com/airbnb/lottie-ios | 로딩·빈 상태·온보딩 모션 톤 | referenced | 로그인, 스플래시, 장바구니 빈 상태 |
| Firebase | https://github.com/firebase/firebase-ios-sdk | 푸시·분석·원격 설정 정보 구조 참고 | referenced | 알림, 마이셀로 |
| RxSwift | https://github.com/ReactiveX/RxSwift | 상태 흐름·이벤트 기반 UI 업데이트 | referenced | 검색, 카테고리 필터, 장바구니 |
| RxGesture | https://github.com/RxSwiftCommunity/RxGesture | 스와이프·탭 피드백, 카드 인터랙션 | referenced | 상품 상세, 찜, 홈 캐러셀 |
| RxKeyboard | https://github.com/RxSwiftCommunity/RxKeyboard | 로그인·검색 입력 시 레이아웃 대응 | referenced | 로그인, 회원가입, 검색 |
| ReactorKit | https://github.com/ReactorKit/ReactorKit | 화면 상태·액션 분리 | referenced | 마이셀로, 설정, 정책/약관 |
| Then | https://github.com/devxoul/Then | 컴포넌트 초기 스타일·레이아웃 가독성 | referenced | 정보성 페이지 전반 |
| URLNavigator | https://github.com/devxoul/URLNavigator | 카테고리·검색 query 라우팅 | referenced | 카테고리, 검색, 상품 상세 |
| SwiftyJSON | https://github.com/SwiftyJSON/SwiftyJSON | API 응답 필드 표시·에러 메시지 | referenced | 마이셀로, 알림, 판매자 소개 |
| TLPhotoPicker | https://github.com/tilltue/TLPhotoPicker | 리뷰·프로필 이미지 선택 UX | referenced | 마이셀로, 상품 상세 리뷰 |
| ReusableKit | https://github.com/devxoul/ReusableKit | 리스트·메뉴 행 컴포넌트 재사용 | referenced | 마이셀로, 설정, 오픈소스, 정책/약관 |
| KeychainAccess | https://github.com/kishikawakatsumi/KeychainAccess | 토큰·자격 증명 저장 UX | referenced | 로그인, 마이셀로 보안 |
| SwiftDate | https://github.com/malcommac/SwiftDate | 주문·알림·이벤트 날짜 표기 | referenced | 알림, 마이셀로, 장바구니 |
| NotificationBanner | https://github.com/Daltron/NotificationBanner | 토스트·배너 피드백 톤 | referenced | 로그인, 장바구니, 찜 |
| MarqueeLabel | https://github.com/cbpowell/MarqueeLabel | 긴 상품명·공지 텍스트 처리 | referenced | 홈, 상품 상세 |
| FloatingPanel | https://github.com/scenee/FloatingPanel | 필터·옵션·정렬 패널 UX | referenced | 검색, 카테고리, 상품 상세 |

### UI/UX 참고 철학 (CELLOH 정보 페이지 공통)

마켓컬리 오픈소스 페이지처럼 아래 영역에 동일한 정보 전달 UX를 적용합니다.

- 넓은 여백 (`InfoPageBody`, `py-7` 리스트 행)
- 읽기 쉬운 타이포 (`leading-[1.65]`, h1/h2/h3 계층)
- 과도한 카드 없이 **구분선 리스트**
- 상태 배지 (Referenced / Integrated)
- GitHub·공식 문서 링크

적용 대상: 로그인, 회원가입, 마이셀로, 장바구니, 찜, 알림, 검색, 카테고리, 정책/약관, **오픈소스**, 판매자 소개, 상품 상세

---

## 프로젝트 사용 패키지 (Integrated)

`package.json` 기준 **자동 수집**. 아래는 현재 등록 메타입니다.

### Runtime (dependencies)

| npm package | 표시명 | GitHub / 문서 | 참고 목적 | status | 적용 화면 |
|-------------|--------|---------------|-----------|--------|-----------|
| next | Next.js | https://github.com/vercel/next.js | App Router, SSR, 라우팅 | integrated | 앱 전반 |
| react | React | https://github.com/facebook/react | 컴포넌트 UI | integrated | 앱 전반 |
| react-dom | React DOM | https://github.com/facebook/react | 클라이언트 렌더링 | integrated | 앱 전반 |
| @supabase/ssr | Supabase SSR | https://github.com/supabase/ssr | 세션·쿠키 auth | integrated | 로그인, 회원가입, 마이셀로 |
| @supabase/supabase-js | Supabase JS | https://github.com/supabase/supabase-js | 인증·DB API | integrated | 로그인, 마이셀로, 알림 |
| @tosspayments/tosspayments-sdk | Toss Payments SDK | https://docs.tosspayments.com/ | 결제 연동 | integrated | 결제, 장바구니 |

### Dev (devDependencies)

| npm package | 표시명 | GitHub | status |
|-------------|--------|--------|--------|
| tailwindcss | Tailwind CSS | https://github.com/tailwindlabs/tailwindcss | integrated |
| typescript | TypeScript | https://github.com/microsoft/TypeScript | integrated |
| autoprefixer | Autoprefixer | https://github.com/postcss/autoprefixer | integrated |
| postcss | PostCSS | https://github.com/postcss/postcss | integrated |
| @types/node | @types/node | https://github.com/DefinitelyTyped/DefinitelyTyped | integrated |
| @types/react | @types/react | https://github.com/DefinitelyTyped/DefinitelyTyped | integrated |
| @types/react-dom | @types/react-dom | https://github.com/DefinitelyTyped/DefinitelyTyped | integrated |

---

## 항목 추가 템플릿

### UI/UX 참고 (referenced)

```markdown
| {이름} | {GitHub URL} | {참고 목적} | referenced | {적용 화면} |
```

`lib/open-source/ui-references.ts`에 동일 객체 추가.

### Integrated (package.json)

1. `npm install {package}` (운영 시)
2. `lib/open-source/npm-packages.ts` → `NPM_PACKAGE_REGISTRY` 항목 추가
3. 본 문서 **프로젝트 사용 패키지** 테이블 행 추가
4. `/open-source` 페이지는 자동 반영

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `docs/OPEN_SOURCE_REFERENCE.md` | 운영·감사용 추적 문서 (본 파일) |
| `lib/open-source/ui-references.ts` | UI/UX referenced 목록 |
| `lib/open-source/npm-packages.ts` | npm 패키지 표시 메타 |
| `lib/open-source/index.ts` | page data 조합 |
| `components/info-page-layout.tsx` | 정보 페이지 공통 레이아웃 |
| `components/open-source-page-content.tsx` | 오픈소스 페이지 UI |
| `app/open-source/page.tsx` | 라우트 |

---

*마지막 갱신: 코드 기준 package.json 자동 수집 · UI 참고 19건*
