"use client";

import Link from "next/link";
import { useState } from "react";
import { WADEAL_ADDRESS_SAVED } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

const fields = [
  { id: "name", label: "받는 분", placeholder: "이름" },
  { id: "phone", label: "휴대폰 번호", placeholder: "010-0000-0000" },
  { id: "address", label: "주소 검색", placeholder: "도로명 주소" },
  { id: "detail", label: "상세 주소", placeholder: "동·호수" },
] as const;

type AddressSetupFormProps = {
  returnPath: string;
};

export function AddressSetupForm({ returnPath }: AddressSetupFormProps) {
  const [defaultAddress, setDefaultAddress] = useState(true);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="space-y-4">
        <p className={ui.successBanner} role="status">
          배송지가 저장되었어요.
        </p>
        <Link className="btn-primary" href={returnPath}>
          공동구매 참여로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        sessionStorage.setItem(WADEAL_ADDRESS_SAVED, "1");
        setSaved(true);
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label className={ui.label} htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className={ui.input}
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
        배송지 저장
      </button>
    </form>
  );
}
