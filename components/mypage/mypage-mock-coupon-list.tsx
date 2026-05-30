import type { MockUserCoupon } from "@/lib/promotions/mock-coupon-catalog";
import { CELLOH_EMPTY } from "@/lib/copy/ux-writing";

type MypageMockCouponListProps = {
  coupons: MockUserCoupon[];
};

function statusLabel(status: MockUserCoupon["status"]): string {
  if (status === "available") {
    return "사용 가능";
  }
  if (status === "used") {
    return "사용 완료";
  }
  return "기간 만료";
}

/** 마이페이지 mock 쿠폰함 — DB 지급 없음 */
export function MypageMockCouponList({ coupons }: MypageMockCouponListProps) {
  if (coupons.length === 0) {
    return (
      <p className="mt-3 rounded-lg border border-dashed border-wadeal-line px-4 py-6 text-center text-xs font-bold leading-relaxed text-wadeal-muted">
        {CELLOH_EMPTY.coupon.title}
        <br />
        {CELLOH_EMPTY.coupon.description}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-2">
      {coupons.map((coupon) => (
        <li
          className="rounded-lg border border-wadeal-line bg-wadeal-surface px-3 py-3"
          key={coupon.id}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-black text-wadeal-ink">{coupon.name}</p>
              <p className="mt-1 text-xs font-bold text-wadeal-red">{coupon.discountLabel}</p>
              <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                {coupon.code} · {coupon.minOrderLabel} · ~{coupon.expiresAt}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                coupon.status === "available" ?
                  "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
              }`}
            >
              {statusLabel(coupon.status)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
