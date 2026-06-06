"use client";

import Link from "next/link";

import { MypageMockCouponList } from "@/components/mypage/mypage-mock-coupon-list";
import type { PointTransaction } from "@/lib/discounts/points";
import type { UserCouponUsage } from "@/lib/profile/types";
import { getMockUserCoupons } from "@/lib/promotions/mock-coupon-catalog";
import { ui } from "@/lib/ui";

type MypageBenefitsContentProps = {
  pointsBalance: number;
  transactions: PointTransaction[];
  couponUsages: UserCouponUsage[];
};

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function transactionLabel(type: PointTransaction["type"]) {
  if (type === "earn") {
    return "적립";
  }
  if (type === "use") {
    return "사용";
  }
  if (type === "refund") {
    return "환불";
  }
  if (type === "expire") {
    return "소멸";
  }
  return "조정";
}

export function MypageBenefitsContent({
  pointsBalance,
  transactions,
  couponUsages,
}: MypageBenefitsContentProps) {
  const mockCoupons = getMockUserCoupons();

  return (
    <div className="space-y-3">
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <p className="text-xs font-bold text-wadeal-muted">보유 포인트</p>
        <p className="mt-1 text-2xl font-black text-wadeal-red">
          {pointsBalance.toLocaleString("ko-KR")}P
        </p>
      </article>

      <section className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className="text-sm font-black text-wadeal-ink">쿠폰</h2>
        <p className="mt-2 text-xs font-bold leading-relaxed text-wadeal-muted">
          보유 쿠폰함 mock입니다. 결제 시 쿠폰 코드 입력·tier 자동 적용 안내는 장바구니에서
          확인할 수 있어요.
        </p>
        <MypageMockCouponList coupons={mockCoupons.filter((c) => c.status === "available")} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="text-[12px] font-semibold text-[#2E5E4E]" href="/mypage/coupons">
            내 쿠폰함
          </Link>
          <Link className="text-[12px] font-semibold text-[#2E5E4E]" href="/join-cart">
            장바구니 쿠폰 안내
          </Link>
          <Link className="text-[12px] font-semibold text-[#2E5E4E]" href="/support/coupons">
            쿠폰 FAQ
          </Link>
          <Link className="text-[12px] font-semibold text-[#2E5E4E]" href="/policies/payment">
            결제·쿠폰 정책
          </Link>
        </div>
        {couponUsages.length > 0 ?
          <ul className="mt-3 space-y-2">
            {couponUsages.map((usage) => (
              <li
                className="rounded-lg border border-wadeal-line bg-wadeal-surface px-3 py-3"
                key={usage.id}
              >
                <p className="text-sm font-black text-wadeal-ink">{usage.couponName}</p>
                <p className="mt-1 text-xs font-bold text-wadeal-muted">
                  {usage.couponCode} · {formatDate(usage.usedAt)} 사용 ·{" "}
                  {usage.discountAmount.toLocaleString("ko-KR")}원 할인
                </p>
              </li>
            ))}
          </ul>
        : null}
      </section>

      <section className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className="text-sm font-black text-wadeal-ink">포인트 내역</h2>
        {transactions.length === 0 ?
          <p className="mt-2 text-xs font-bold text-wadeal-muted">포인트 내역이 없어요.</p>
        : <ul className="mt-3 space-y-2">
            {transactions.map((tx) => (
              <li
                className="flex items-center justify-between gap-3 rounded-lg border border-wadeal-line px-3 py-3"
                key={tx.id}
              >
                <div>
                  <p className="text-xs font-black text-wadeal-ink">
                    {transactionLabel(tx.type)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-wadeal-muted">
                    {formatDate(tx.createdAt)}
                    {tx.reason ? ` · ${tx.reason}` : ""}
                  </p>
                </div>
                <p
                  className={`text-sm font-black ${
                    tx.type === "use" || tx.type === "expire" ?
                      "text-wadeal-muted"
                    : "text-wadeal-red"
                  }`}
                >
                  {tx.type === "use" || tx.type === "expire" ? "-" : "+"}
                  {tx.amount.toLocaleString("ko-KR")}P
                </p>
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
}
