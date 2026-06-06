# QA 스크린샷 저장소

캡처 파일은 **커밋하지 않아도 됩니다** (용량·민감정보). 로컬 또는 Notion/Slack 첨부용.

## 폴더 구조

```txt
docs/qa-screenshots/
└── YYYY-MM-DD/          ← 검수 날짜
    ├── 01-home-pc.png
    ├── 02-home-mobile-430.png
    └── ...
```

## 파일명 규칙

```txt
{순번}-{화면}-{viewport}.png

예:
01-home-pc-1440.png
02-home-mobile-430.png
03-product-detail-mobile-430.png
04-seller-celloh-pc-1440.png
05-join-cart-mobile-430.png
06-checkout-mobile-430.png
07-mypage-orders-mobile-430.png
08-search-idle-mobile-430.png
09-search-empty-mobile-430.png
```

**viewport:** `pc-1440` · `mobile-430` (앱 셸) · `mobile-375` (iPhone SE 등)

## 보고서에 붙이기

`docs/FINAL_CAPTURE_QA_REPORT.md` §5 형식으로 Markdown 링크 삽입:

```markdown
![홈 PC](../qa-screenshots/2026-05-29/01-home-pc-1440.png)
```
