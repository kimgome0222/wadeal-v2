# CELLOH Operation Risks (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Risk register — mitigation mostly process + future features

---

## Risk register

### 개인정보 리스크

| | |
|-|-|
| **발생** | Log leak, over-collection, breach |
| **고객 영향** | Identity theft anxiety, churn |
| **대응** | Redact logs (`error-log.ts`), policy update, breach notice |
| **Admin** | `/admin/error-logs`, secret scan |
| **추후 기능** | DLP audit, consent versioning |

### 결제 실패

| | |
|-|-|
| **발생** | PG timeout, webhook miss |
| **고객 영향** | Order stuck unpaid |
| **대응** | Retry UX, support ticket, manual reconcile |
| **Admin** | `/admin/payments` |
| **추후** | Webhook replay, alerting |

### 배송 지연

| | |
|-|-|
| **발생** | Seller late ship, courier delay |
| **고객 영향** | Complaints, cancel requests |
| **대응** | Proactive notice, refund policy |
| **Admin** | Orders by shipping status |
| **추후** | SLA tracking |

### 판매자 미응답

| | |
|-|-|
| **발생** | Inquiry > 48h |
| **고객 영향** | Trust loss |
| **대응** | Escalate to admin support |
| **Admin** | `/admin/support`, seller metrics |
| **추후** | Auto-escalation |

### 허위 상품

| | |
|-|-|
| **발생** | Misleading title/image |
| **고객 영향** | Refund, legal |
| **대응** | Delist, seller warning |
| **Admin** | `/admin/product-requests`, reports |
| **추후** | ML moderation |

### 리뷰 조작

| | |
|-|-|
| **발생** | Fake purchases/reviews |
| **고객 영향** | Wrong purchase decisions |
| **대응** | Hide review, ban |
| **Admin** | `/admin/review-reports` |
| **추후** | Verified purchase only enforcement |

### 쿠폰 남용

| | |
|-|-|
| **발생** | Multi-account, refund loop |
| **고객 영향** | Budget drain |
| **대응** | Hold issuance, clawback |
| **Admin** | `/admin/coupons`, promotions |
| **추후** | Fraud rules engine |

### 친구추천 부정 이용

| | |
|-|-|
| **발생** | Self-referral, device farm |
| **고객 영향** | Unfair rewards |
| **대응** | `reward_pending` review |
| **Admin** | Referral queue (future) |
| **추후** | Device/payment fingerprint |

### 정산 분쟁

| | |
|-|-|
| **발생** | Fee/coupon split disagreement |
| **고객 영향** | Seller churn |
| **대응** | Settlement statement, ticket |
| **Admin** | `/admin/settlements` |
| **추후** | Itemized fee breakdown export |

### 환불 분쟁

| | |
|-|-|
| **발생** | Partial vs full dispute |
| **고객 영향** | Chargeback |
| **대응** | Policy-aligned decision |
| **Admin** | `/admin/refunds` |
| **추후** | Dispute workflow |

### 품절/재고 오류

| | |
|-|-|
| **발생** | Oversell |
| **고객 영향** | Cancel after pay |
| **대응** | Apologize + coupon (mock policy) |
| **Admin** | Product status |
| **추후** | Real-time inventory |

### 가격 오류

| | |
|-|-|
| **발생** | Wrong tier/typo |
| **고객 영향** | Cancel or honor (legal) |
| **대응** | Ops decision matrix |
| **Admin** | Product edit audit |
| **추후** | Price change approval |

### 이미지 저작권

| | |
|-|-|
| **발생** | Stolen photos |
| **고객 영향** | Platform liability |
| **대응** | Takedown, seller contract |
| **Admin** | Reports |
| **추후** | Upload attestation |

### 과장 광고

| | |
|-|-|
| **발생** | “최저가” without basis |
| **고객 영향** | FTC/consumer law |
| **대응** | Copy fix, display rules |
| **Admin** | Promotion review |
| **추후** | Copy compliance checklist |

### 미성년자 구매

| | |
|-|-|
| **발생** | Restricted goods |
| **고객 영향** | Legal |
| **대응** | Age gate (future), cancel |
| **Admin** | Category rules |
| **추후** | Age verification |

### CS 과부하

| | |
|-|-|
| **발생** | Incident spike |
| **고객 영향** | Slow response |
| **대응** | Template notices, FAQ update |
| **Admin** | Support queue depth |
| **추후** | Chatbot tier-1 |

---

## Related

- `docs/CELLOH_OPERATIONS_RUNBOOK.md`
- `docs/CELLOH_ERROR_LOGGING_PLAN.md`
- `docs/CELLOH_COUPON_COST_CONTROL.md`
