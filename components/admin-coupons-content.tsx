"use client";

import Link from "next/link";
import { useTransition } from "react";

import { toggleAdminCouponActiveAction } from "@/app/actions/admin-coupons";
import type { AdminCouponListItem } from "@/lib/data/admin-coupons";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type AdminCouponsContentProps = {
  coupons: AdminCouponListItem[];
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

export function AdminCouponsContent({ coupons }: AdminCouponsContentProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, nextActive: boolean) {
    startTransition(async () => {
      await toggleAdminCouponActiveAction(id, nextActive);
    });
  }

  if (coupons.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-wadeal-line px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
        등록된 쿠폰이 없어요.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {coupons.map((coupon) => (
        <li
          className="rounded-xl border border-wadeal-line bg-white p-4"
          key={coupon.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{coupon.name}</p>
              <p className="mt-1 text-xs font-bold text-wadeal-muted">
                코드 <span className="font-black text-wadeal-ink">{coupon.code}</span>
              </p>
              <p className="mt-1 text-xs font-bold text-wadeal-red">
                {formatDiscount(coupon)}
                {coupon.minOrderAmount > 0 ?
                  ` · ${currency.format(coupon.minOrderAmount)}원 이상`
                : null}
              </p>
              <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
                사용 {coupon.usageCount}
                {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}건
              </p>
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
          </div>
        </li>
      ))}
    </ul>
  );
}
