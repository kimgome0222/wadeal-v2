"use client";

import { useState } from "react";
import { KakaoButton } from "@/components/kakao-button";

const alertOptions = [
  "39,000원 이하 알림",
  "35,000원 이하 알림",
  "최저가 달성 시 알림",
  "마감 1시간 전 알림",
];

export function AlertForm() {
  const [selected, setSelected] = useState(alertOptions[0]);
  const [success, setSuccess] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {alertOptions.map((option) => (
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
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
        <p
          className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-extrabold text-green-700"
          role="status"
        >
          가격 알림이 설정되었어요.
        </p>
      : null}
      <KakaoButton onClick={() => setSuccess(true)}>카카오톡으로 알림받기</KakaoButton>
    </div>
  );
}
