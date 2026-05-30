"use client";

import Link from "next/link";
import { useTransition } from "react";

import { toggleAdminCouponActiveAction } from "@/app/actions/admin-coupons";
import type { AdminCouponListItem } from "@/lib/data/admin-coupons";
import { currency } from "@/lib/deals";
import type { MockCouponCatalogItem } from "@/lib/promotions/mock-coupon-catalog";
import { ui } from "@/lib/ui";

type AdminCouponsContentProps = {
  coupons: AdminCouponListItem[];
  mockCoupons?: MockCouponCatalogItem[];
  showMockOnly?: boolean;
};

function formatDiscount(coupon: AdminCouponListItem): string {
  switch (coupon.discountType) {
    case "fixed_amount":
      return `${currency.format(coupon.discountValue)}원`;
    case "percentage":
      return `${coupon.discountValue}%`;
    case "free_shipping":
      return "무료배송";
    default:
      return "-";
  }
}

function formatPeriod(startsAt: string, endsAt: string | null): string {
  const start = startsAt.slice(0, 10);
  const end = endsAt ? endsAt.slice(0, 10) : "무기한";
  return `${start} ~ ${end}`;
}

export function AdminCouponsContent({
  coupons,
  mockCoupons = [],
  showMockOnly = false,
}: AdminCouponsContentProps) {
  const [isPending, startTransition] = useTransition();
  const displayCoupons = showMockOnly ? mockCoupons : coupons.length > 0 ? coupons : mockCoupons;
  const isMockList = showMockOnly || coupons.length === 0;

  function handleToggle(id: string, nextActive: boolean) {
    startTransition(async () => {
      await toggleAdminCouponActiveAction(id, nextActive);
    });
  }

  if (displayCoupons.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-wadeal-line px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
        등록된 쿠폰이 없어요.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {displayCoupons.map((coupon) => {
        const mockCoupon = "kindLabel" in coupon ? (coupon as MockCouponCatalogItem) : null;

        return (
          <li
            className="rounded-xl border border-wadeal-line bg-white p-4"
            key={coupon.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-wadeal-ink">{coupon.name}</p>
                {mockCoupon ?
                  <p className="mt-1 text-[11px] font-bold text-wadeal-muted">{mockCoupon.kindLabel}</p>
                : null}
                <p className="mt-1 text-xs font-bold text-wadeal-muted">
                  코드 <span className="font-black text-wadeal-ink">{coupon.code}</span>
                </p>
                <p className="mt-1 text-xs font-bold text-wadeal-red">
                  {formatDiscount(coupon)}
                  {coupon.minOrderAmount > 0 ?
                    ` · ${currency.format(coupon.minOrderAmount)}원 이상`
                  : null}
                  {mockCoupon?.maxDiscountAmount ?
                    ` · 최대 ${currency.format(mockCoupon.maxDiscountAmount)}원`
                  : null}
                </p>
                <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
                  사용 {coupon.usageCount}
                  {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}건
                  {mockCoupon?.issuanceLimit != null ?
                    ` · 발급 ${mockCoupon.issuanceLimit.toLocaleString("ko-KR")}장`
                  : null}
                </p>
                {mockCoupon ?
                  <>
                    <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                      {formatPeriod(coupon.startsAt, coupon.endsAt)}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                      대상: {mockCoupon.targetCategories.join(", ")} · {mockCoupon.targetProducts}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                      중복 {mockCoupon.stackable ? "가능" : "불가"} · 상태 {mockCoupon.status}
                    </p>
                  </>
                : null}
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  coupon.isActive ?
                    "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
                }`}
              >
                {coupon.isActive ? "활성" : "비활성"}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {isMockList ?
                <button
                  className={`${ui.btnOutline} h-9 flex-1 text-xs opacity-60`}
                  disabled
                  type="button"
                >
                  수정 (mock)
                </button>
              : <>
                  <Link
                    className={`${ui.btnOutline} h-9 flex-1 text-xs`}
                    href={`/admin/coupons/${coupon.id}/edit`}
                  >
                    수정
                  </Link>
                  <button
                    className={`${ui.btnOutline} h-9 flex-1 text-xs`}
                    disabled={isPending}
                    onClick={() => handleToggle(coupon.id, !coupon.isActive)}
                    type="button"
                  >
                    {coupon.isActive ? "비활성화" : "활성화"}
                  </button>
                </>
              }
            </div>
          </li>
        );
      })}
    </ul>
  );
}
