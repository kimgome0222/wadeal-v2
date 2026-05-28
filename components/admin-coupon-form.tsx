"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createAdminCouponAction,
  updateAdminCouponAction,
} from "@/app/actions/admin-coupons";
import type { AdminCouponDetail } from "@/lib/data/admin-coupons";
import type { CouponDiscountType } from "@/lib/discounts/types";
import { ui } from "@/lib/ui";

type AdminCouponFormProps = {
  mode: "create" | "edit";
  coupon?: AdminCouponDetail;
  cancelHref: string;
};

const discountTypeOptions: { value: CouponDiscountType; label: string }[] = [
  { value: "fixed_amount", label: "정액 할인" },
  { value: "percentage", label: "정률 할인 (%)" },
  { value: "free_shipping", label: "무료배송" },
];

function toLocalDatetime(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AdminCouponForm({ mode, coupon, cancelHref }: AdminCouponFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [code, setCode] = useState(coupon?.code ?? "");
  const [name, setName] = useState(coupon?.name ?? "");
  const [description, setDescription] = useState(coupon?.description ?? "");
  const [discountType, setDiscountType] = useState<CouponDiscountType>(
    coupon?.discountType ?? "fixed_amount",
  );
  const [discountValue, setDiscountValue] = useState(String(coupon?.discountValue ?? "1000"));
  const [minOrderAmount, setMinOrderAmount] = useState(String(coupon?.minOrderAmount ?? "0"));
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    coupon?.maxDiscountAmount != null ? String(coupon.maxDiscountAmount) : "",
  );
  const [startsAt, setStartsAt] = useState(toLocalDatetime(coupon?.startsAt) || toLocalDatetime(new Date().toISOString()));
  const [endsAt, setEndsAt] = useState(toLocalDatetime(coupon?.endsAt));
  const [usageLimit, setUsageLimit] = useState(
    coupon?.usageLimit != null ? String(coupon.usageLimit) : "",
  );
  const [perUserLimit, setPerUserLimit] = useState(String(coupon?.perUserLimit ?? 1));
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      code,
      name,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startsAt,
      endsAt,
      usageLimit,
      perUserLimit,
      isActive,
    };

    startTransition(async () => {
      const result =
        mode === "create" ?
          await createAdminCouponAction(payload)
        : await updateAdminCouponAction(coupon!.id, payload);

      if (!result.success) {
        setFeedback({ type: "error", message: "저장에 실패했어요." });
        return;
      }

      setFeedback({ type: "success", message: "저장했어요." });
      router.push("/admin/coupons");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {feedback ?
        <p
          className={`rounded-xl px-4 py-3 text-xs font-bold ${
            feedback.type === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <label className="block space-y-1">
        <span className="text-xs font-bold text-wadeal-muted">쿠폰 코드</span>
        <input
          className={ui.input}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          required
          value={code}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-bold text-wadeal-muted">쿠폰명</span>
        <input className={ui.input} onChange={(event) => setName(event.target.value)} required value={name} />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-bold text-wadeal-muted">설명</span>
        <textarea
          className={`${ui.input} min-h-20`}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-bold text-wadeal-muted">할인 유형</span>
        <select
          className={ui.input}
          onChange={(event) => setDiscountType(event.target.value as CouponDiscountType)}
          value={discountType}
        >
          {discountTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {discountType !== "free_shipping" ?
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">
            {discountType === "percentage" ? "할인율 (%)" : "할인 금액 (원)"}
          </span>
          <input
            className={ui.input}
            inputMode="numeric"
            onChange={(event) => setDiscountValue(event.target.value.replace(/[^\d]/g, ""))}
            required
            value={discountValue}
          />
        </label>
      : null}

      {discountType === "percentage" ?
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">최대 할인 금액 (원, 선택)</span>
          <input
            className={ui.input}
            inputMode="numeric"
            onChange={(event) => setMaxDiscountAmount(event.target.value.replace(/[^\d]/g, ""))}
            value={maxDiscountAmount}
          />
        </label>
      : null}

      <label className="block space-y-1">
        <span className="text-xs font-bold text-wadeal-muted">최소 주문 금액 (원)</span>
        <input
          className={ui.input}
          inputMode="numeric"
          onChange={(event) => setMinOrderAmount(event.target.value.replace(/[^\d]/g, ""))}
          value={minOrderAmount}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">시작일</span>
          <input
            className={ui.input}
            onChange={(event) => setStartsAt(event.target.value)}
            required
            type="datetime-local"
            value={startsAt}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">종료일 (선택)</span>
          <input
            className={ui.input}
            onChange={(event) => setEndsAt(event.target.value)}
            type="datetime-local"
            value={endsAt}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">전체 사용 한도 (선택)</span>
          <input
            className={ui.input}
            inputMode="numeric"
            onChange={(event) => setUsageLimit(event.target.value.replace(/[^\d]/g, ""))}
            value={usageLimit}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-wadeal-muted">1인 사용 한도</span>
          <input
            className={ui.input}
            inputMode="numeric"
            onChange={(event) => setPerUserLimit(event.target.value.replace(/[^\d]/g, ""))}
            required
            value={perUserLimit}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-wadeal-ink">
        <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" />
        활성 쿠폰
      </label>

      <div className="flex gap-2">
        <Link className={`${ui.btnOutline} h-11 flex-1`} href={cancelHref}>
          취소
        </Link>
        <button className={`${ui.btnPrimary} h-11 flex-1`} disabled={isPending} type="submit">
          {isPending ? "저장 중..." : mode === "create" ? "등록" : "저장"}
        </button>
      </div>
    </form>
  );
}
