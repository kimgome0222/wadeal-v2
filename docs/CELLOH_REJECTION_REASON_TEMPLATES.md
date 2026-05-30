# CELLOH Rejection Reason Templates

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Admin → seller communication draft — **no auto-send**

**Related:** [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md), [CELLOH_PRODUCT_REVIEW_CHECKLIST.md](./CELLOH_PRODUCT_REVIEW_CHECKLIST.md), [CELLOH_SELLER_REVIEW_CHECKLIST.md](./CELLOH_SELLER_REVIEW_CHECKLIST.md)

**Tone:** polite, specific fix list, no blame — align with CS reply guide.

---

## How to use

1. Pick template by reason code  
2. Fill `{placeholders}`  
3. Paste into admin reject note / seller notification (future)  
4. Set status: product `rejected` / seller `rejected` or modification request

---

# Product rejection templates

## P-01 이미지 품질 부족

| Field | Content |
|-------|---------|
| **제목** | 상품 등록 검수 — 이미지 보완 요청 |
| **판매자 문구** | 안녕하세요, celloh입니다. `{productName}` 등록 검수 중 **대표/상세 이미지 품질** 보완이 필요합니다. · 흐릿하거나 상품 식별이 어려운 이미지 · 워터마크·타 쇼핑몰 캡처 · 상품과 무관한 이미지 위 항목을 수정한 뒤 **재검수 요청**해 주세요. |
| **수정 요청** | 대표 1장 이상 HD 교체, 상세 이미지 실물 촬영 |
| **재제출** | 판매자센터 > 상품 수정 후 검수 요청 |

---

## P-02 상품 설명 부족

| **제목** | 상품 등록 검수 — 상세 설명 보완 |
| **판매자 문구** | `{productName}`의 **상품 설명**에 규격·구성·재질·용량·사용 방법 등 필수 정보가 부족합니다. 구매자가 오해 없이 확인할 수 있도록 설명을 보완해 주세요. |
| **수정 요청** | 상세 설명 필드, 고시 정보 |
| **재제출** | 수정 후 재검수 요청 |

---

## P-03 필수 정보 누락

| **제목** | 상품 등록 검수 — 필수 정보 누락 |
| **판매자 문구** | `{productName}` ({categoryName}) 카테고리 기준 **필수 표시 정보**가 누락되었습니다: `{missingFields}`. 카테고리별 필수 항목을 확인해 주세요. |
| **수정 요청** | 원산지, 인증, 유통기한 등 카테고리 필수 |
| **재제출** | 보완 후 재검수 |

---

## P-04 가격 정보 불명확

| **제목** | 상품 등록 검수 — 가격 정보 확인 |
| **판매자 문구** | `{productName}`의 **판매가·정가·할인율** 표시가 일치하지 않거나 확인이 어렵습니다. 정가/할인가 관계와 최종 판매가를 명확히 설정해 주세요. |
| **수정 요청** | price, originalPrice, discount consistency |
| **재제출** | 수정 후 재검수 |

---

## P-05 과장광고 표현

| **제목** | 상품 등록 검수 — 광고 표현 수정 |
| **판매자 문구** | `{productName}` 상품명/설명에 **과장·허위 가능 표현**(`{phrases}`)이 포함되어 있습니다. celloh 광고 정책에 따라 수정이 필요합니다. [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) 참고 |
| **수정 요청** | Remove absolute claims |
| **재제출** | 수정 후 재검수 — 반복 시 반려 |

---

## P-06 카테고리 부적합

| **제목** | 상품 등록 검수 — 카테고리 변경 필요 |
| **판매자 문구** | `{productName}`이 선택한 카테고리 `{categoryName}`와 맞지 않습니다. 적절한 카테고리로 변경하거나 상품 정보를 수정해 주세요. |
| **수정 요청** | category slug |
| **재제출** | 재검수 요청 |

---

## P-07 금지상품 가능성

| **제목** | 상품 등록 검수 — 등록 불가 |
| **판매자 문구** | `{productName}`은 celloh **금지·제한 상품 정책**에 해당할 수 있어 **등록이 어렵습니다**. 문의: 판매자 고객센터. |
| **수정 요청** | — (non-resubmit) |
| **재제출** | 해당 없음 — appeal via CS |

---

## P-08 배송/환불 정책 누락

| **제목** | 상품 등록 검수 — 배송·반품 정보 |
| **판매자 문구** | `{productName}`의 **배송비·무료배송 기준·교환/반품 가능 여부**가 누락되었거나 플랫폼 정책과 상충합니다. `/policies/refund`, `/policies/shipping`을 참고해 설정해 주세요. |
| **수정 요청** | shipping fee, return policy fields |
| **재제출** | 수정 후 재검수 |

---

# Seller rejection templates

## S-01 사업자 정보 누락

| **제목** | 입점 검수 — 사업자 정보 보완 |
| **판매자 문구** | 입점 신청 검토 중 **사업자등록번호·상호·대표자명** 확인이 필요합니다. 판매자센터 > 설정에서 정보를 입력하고 **사업자등록증**을 첨부해 주세요. |
| **수정 요청** | businessNumber, companyName, document upload |
| **재제출** | `/seller/apply` 또는 설정에서 재신청 |

---

## S-02 연락처 확인 불가

| **제목** | 입점 검수 — 연락처 확인 |
| **판매자 문구** | 담당자 **이메일/연락처**로 확인 연락이 되지 않았습니다. 정확한 연락처를 업데이트해 주세요. |
| **수정 요청** | phone, email |
| **재제출** | 정보 수정 후 알림 |

---

## S-03 판매 카테고리 부적합

| **제목** | 입점 검수 — 판매 카테고리 |
| **판매자 문구** | 신청하신 **판매 카테고리**가 celloh 입점 정책과 맞지 않습니다. 가능 카테고리 안내를 드리니 수정 또는 문의해 주세요. |
| **수정 요청** | category selection |
| **재제출** | 재신청 |

---

## S-04 필수 서류 누락

| **제목** | 입점 검수 — 서류 제출 |
| **판매자 문구** | **사업자등록증** (및 필요 시 **통신판매업 신고** 관련 서류) 제출이 필요합니다. |
| **수정 요청** | businessRegistrationUrl, mail order number |
| **재제출** | 서류 업로드 후 재검토 |

---

## S-05 외부 거래 유도 위험

| **제목** | 입점 검수 — 정책 위반 |
| **판매자 문구** | 소개글·상품 정보에서 **플랫폼 외 직거래·별도 결제 유도**가 확인되어 입점이 **어렵습니다**. celloh 내 거래·결제 정책을 준수해 주세요. |
| **수정 요청** | Remove external contact/payment |
| **재제출** | appeal via CS only |

---

## S-06 정책 위반 가능성

| **제목** | 입점 검수 — 보류/반려 |
| **판매자 문구** | 입점 검토 중 **정책 위반 가능성**(`{reasonSummary}`)이 확인되었습니다. 자세한 사항은 `{contactChannel}`로 안내드리겠습니다. |
| **수정 요청** | per internal review |
| **재제출** | CS 안내 후 |

---

## Status after rejection

| Entity | Status code | Seller action |
|--------|-------------|---------------|
| Product | `rejected` | Edit → `review_requested` |
| Seller | `rejected` | Reapply → `applied` |

See [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md)

---

## Related

- [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md)
