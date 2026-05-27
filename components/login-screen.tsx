"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const socialButtons = [
  { id: "kakao", label: "카카오로 시작하기", className: "btn-kakao" },
  {
    id: "naver",
    label: "네이버로 시작하기",
    className:
      "flex h-12 w-full items-center justify-center rounded-lg bg-[#03c75a] text-[15px] font-black text-white active:opacity-90",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    className:
      "flex h-12 w-full items-center justify-center rounded-lg border border-wadeal-line bg-white text-[15px] font-black text-wadeal-ink active:bg-gray-50",
  },
  {
    id: "apple",
    label: "Apple로 시작하기",
    className:
      "flex h-12 w-full items-center justify-center rounded-lg bg-gray-900 text-[15px] font-black text-white active:opacity-90",
  },
  {
    id: "samsung",
    label: "Samsung 계정으로 시작하기",
    className:
      "flex h-12 w-full items-center justify-center rounded-lg bg-[#1428a0] text-[15px] font-black text-white active:opacity-90",
  },
] as const;

export function LoginScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function handleSocial(id: (typeof socialButtons)[number]["id"]) {
    if (id === "kakao") {
      router.push("/mypage");
      return;
    }
    setMessage("로그인 기능은 다음 단계에서 연결됩니다.");
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
      <div className="text-center">
        <p className="text-2xl font-black tracking-[-0.03em] text-wadeal-red">
          Wadeal
        </p>
        <p className="mt-5 text-base font-black text-wadeal-ink">
          같이 사면 더 싸지는 쇼핑
        </p>
      </div>

      <div className="mt-8 space-y-2">
        {socialButtons.map((button) => (
          <button
            className={button.className}
            key={button.id}
            onClick={() => handleSocial(button.id)}
            type="button"
          >
            {button.label}
          </button>
        ))}
      </div>

      {message ?
        <p
          className="mt-3 rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-extrabold text-wadeal-ink"
          role="status"
        >
          {message}
        </p>
      : null}

      <Link
        className="mt-5 text-center text-sm font-bold text-wadeal-muted"
        href="/mypage"
      >
        이메일로 가입하기
      </Link>

      <p className="mt-auto pt-8 text-center text-[11px] font-bold leading-relaxed text-gray-400">
        로그인 시 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </div>
  );
}
