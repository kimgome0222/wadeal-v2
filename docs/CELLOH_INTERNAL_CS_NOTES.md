# CELLOH Internal CS Notes

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Internal ops draft — **not customer-facing**

**Related:** [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md), [CELLOH_ADMIN_OPERATION_SCENARIOS.md](./CELLOH_ADMIN_OPERATION_SCENARIOS.md)

---

## Usage

- Admin ticket / Slack / Linear 내부 기록용  
- 고객에게 그대로 보내지 않음  
- `{field}` 채운 뒤 보관

---

## 1. 환불 검토 메모

```markdown
## Refund review

- Ticket / order: {orderId}
- Refund ID: {refundId}
- Customer: {userId} / {emailMasked}
- Reason (customer): 
- Reason (internal): cancel | defect | wrong_item | simple_change
- Order status at request: 
- Payment: {paymentId} / PG status: 
- Coupon/points used: Y/N — clawback rule applied: 
- Seller notified: Y/N @ {date}
- Decision: approve | partial | deny
- Deny reason (if any): 
- PG cancel/refund API: pending | done | failed
- Customer reply sent: Y/N — template: refund_completed | refund_denied
- Reviewer: 
- Date: 
```

---

## 2. 판매자 확인 요청 메모

```markdown
## Seller confirmation request

- Order: {orderId}
- Seller: {sellerId} / {sellerName}
- Topic: shipping_delay | defect | cancel | stock_out | policy
- Question to seller: 
- SLA: respond by {date}
- Seller reply: 
- Customer impact: 
- Next action: 
- Escalation: none | admin | legal
```

---

## 3. 배송지 변경 요청 메모

```markdown
## Address change request

- Order: {orderId}
- Current status: pending | preparing | shipped | delivered
- Old address: {masked}
- New address: {full — internal only}
- Seller shipped: Y/N
- Courier contacted: Y/N
- Outcome: changed | rejected | redirect_fee
- Customer notified: Y/N
- Notes: 
```

---

## 4. 신고 검토 메모

```markdown
## Report review

- Report ID: {reportId}
- Type: review | product | seller | comment
- Target ID: 
- Reporter: {userId}
- Category: abuse | spam | false | privacy | other
- Evidence reviewed: Y/N
- Policy ref: CELLOH_REVIEW_QNA_REPORT_POLICY
- Action: none | hide | delete | warn_seller | suspend
- Customer/reporter reply: sent | skipped (reason)
- Reviewer: 
- Date: 
```

---

## 5. 쿠폰 보상 검토 메모

```markdown
## Coupon compensation review

- Customer: {userId}
- Related order/ticket: 
- Request: goodwill | bug | delay | cs_recovery
- Coupon type: fixed | percent | free_shipping
- Amount / code: 
- Budget approval: Y/N — ref CELLOH_COUPON_COST_CONTROL
- Issued in admin: Y/N — coupon_id: 
- Expiry: 
- Customer reply template: coupon_issued
- Notes: 
```

---

## 6. 친구추천 부정 이용 의심 메모

```markdown
## Referral fraud suspicion

- Inviter: {userId} / code: {referralCode}
- Invitee(s): 
- Signals: same_device | same_payment | same_address | velocity | self_referral
- Orders involved: {orderIds}
- Reward status: pending | paid | revoked
- Decision: pay | hold | deny | ban
- Policy ref: /policies/referral, CELLOH_REFERRAL_COUPON_LEGAL_CHECK
- Legal/compliance flag: Y/N
- Customer message (if any): referral_reward | referral_denied
- Reviewer: 
```

---

## 7. 정산 보류 메모

```markdown
## Settlement hold

- Seller: {sellerId}
- Settlement period: {YYYY-MM}
- Hold reason: refund_spike | dispute | fraud | doc_missing | quality
- Amount held: {amount}
- Related orders/refunds: 
- Seller contacted: Y/N
- Release date (est.): 
- Admin action: /admin/settlements/{id}
- Notes: 
```

---

## Escalation matrix

| Trigger | Escalate to |
|---------|-------------|
| Chargeback | Admin + finance |
| Legal threat | Legal placeholder |
| PII leak suspicion | Admin + security |
| Repeated PG fail | Tech + `/admin/payments` |
| Seller no-response 48h | Admin seller ops |

---

## Admin routes (internal)

| Task | Route |
|------|-------|
| Orders | `/admin/orders` |
| Refunds | `/admin/refunds` |
| Support tickets | `/admin/support` |
| Review reports | `/admin/review-reports` |
| Coupons | `/admin/coupons` |
| Referral / viral | `/admin/viral` |
| Settlements | `/admin/settlements` |

---

## Related

- [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md)
- [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md)
