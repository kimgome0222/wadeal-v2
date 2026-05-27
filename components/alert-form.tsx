"use client";

import { useMemo, useState, useTransition } from "react";
import { submitPriceAlertAction } from "@/app/actions/data";
import { KakaoButton } from "@/components/kakao-button";
import {
  buildAlertOptions,
  mapAlertOptionToInput,
  type AlertOption,
} from "@/lib/data/alert-options";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type AlertFormProps = {
  deal: Deal;
};

export function AlertForm({ deal }: AlertFormProps) {
  const alertOptions = useMemo(() => buildAlertOptions(deal), [deal]);
  const [selected, setSelected] = useState<AlertOption>(alertOptions[0]);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitPriceAlertAction(
        mapAlertOptionToInput(deal.slug, selected, deal),
      );
      if (result.success) {
        setSuccess(true);
      }
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-wadeal-muted">
        현재 공동구매가{" "}
        <span className="font-black text-wadeal-red">
          {currency.format(deal.groupPrice)}원
        </span>
      </p>
      <div className="space-y-2">
        {alertOptions.map((option) => (
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 ${
              selected.key === option.key ?
                "border-wadeal-red bg-red-50"
              : "border-wadeal-line bg-white"
            }`}
            key={option.key}
          >
            <input
              checked={selected.key === option.key}
              className="h-4 w-4 accent-wadeal-red"
              name="alert-option"
              onChange={() => setSelected(option)}
              type="radio"
            />
            <span className="text-sm font-extrabold text-wadeal-ink">{option.label}</span>
          </label>
        ))}
      </div>
      {success ?
        <div className={ui.successBanner} role="status">
          <p>가격 알림이 설정되었어요.</p>
          <p className="mt-1 text-xs font-bold opacity-90">
            최저가에 도달하면 카카오톡으로 알려드릴게요.
          </p>
        </div>
      : null}
      <KakaoButton disabled={success || isPending} onClick={handleSubmit}>
        카카오톡으로 알림받기
      </KakaoButton>
    </div>
  );
}
