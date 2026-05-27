"use client";

import { useMemo, useState } from "react";
import { KakaoButton } from "@/components/kakao-button";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type AlertFormProps = {
  deal: Deal;
};

function buildAlertOptions(deal: Deal) {
  const midAlert = Math.round((deal.groupPrice + deal.lowestPrice) / 2);
  return [
    `${currency.format(midAlert)}원 이하 알림`,
    `${currency.format(deal.lowestPrice)}원 이하 알림`,
    "최저가 달성 시 알림",
    "마감 1시간 전 알림",
  ];
}

export function AlertForm({ deal }: AlertFormProps) {
  const alertOptions = useMemo(() => buildAlertOptions(deal), [deal]);
  const [selected, setSelected] = useState(alertOptions[0]);
  const [success, setSuccess] = useState(false);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {alertOptions.map((option) => (
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 ${
              selected === option ?
                "border-wadeal-red bg-red-50"
              : "border-wadeal-line bg-white"
            }`}
            key={option}
          >
            <input
              checked={selected === option}
              className="h-4 w-4 accent-wadeal-red"
              name="alert-option"
              onChange={() => setSelected(option)}
              type="radio"
            />
            <span className="text-sm font-extrabold text-wadeal-ink">{option}</span>
          </label>
        ))}
      </div>
      {success ?
        <div className={ui.successBanner} role="status">
          <p>가격 알림이 설정되었어요.</p>
          <p className="mt-1 text-xs font-bold opacity-90">
            선택한 조건에 맞춰 카카오톡으로 알려드릴게요.
          </p>
        </div>
      : null}
      <KakaoButton onClick={() => setSuccess(true)}>카카오톡으로 알림받기</KakaoButton>
    </div>
  );
}
