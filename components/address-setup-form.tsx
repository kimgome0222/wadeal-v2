"use client";

import { useState } from "react";

const fields = [
  { id: "name", label: "받는 분", placeholder: "이름을 입력하세요" },
  { id: "phone", label: "휴대폰 번호", placeholder: "010-0000-0000" },
  { id: "address", label: "주소 검색", placeholder: "도로명 주소 검색" },
  { id: "detail", label: "상세 주소", placeholder: "동, 호수 등 상세 주소" },
] as const;

export function AddressSetupForm() {
  const [defaultAddress, setDefaultAddress] = useState(true);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <p
        className="rounded-xl bg-green-50 px-4 py-4 text-center text-sm font-extrabold text-green-700"
        role="status"
      >
        배송지가 저장되었어요.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label className="mb-1.5 block text-xs font-black text-wadeal-muted" htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className="h-11 w-full rounded-lg border border-wadeal-line px-3 text-sm font-bold text-wadeal-ink outline-none placeholder:font-bold placeholder:text-gray-300 focus:border-wadeal-red"
            id={field.id}
            placeholder={field.placeholder}
            type="text"
          />
        </div>
      ))}

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          checked={defaultAddress}
          className="h-4 w-4 accent-wadeal-red"
          onChange={(event) => setDefaultAddress(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold text-wadeal-ink">기본 배송지로 설정</span>
      </label>

      <button className="btn-primary" type="submit">
        저장하기
      </button>
    </form>
  );
}
