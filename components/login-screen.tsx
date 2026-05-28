"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { KakaoSetupHelp } from "@/components/kakao-setup-help";
import { signInWithKakao } from "@/lib/auth/kakao-login";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { DEFAULT_CHECKOUT_RETURN } from "@/lib/mock-storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(
    searchParams.get("redirect") ?? DEFAULT_CHECKOUT_RETURN,
  );
  const authError = searchParams.get("error") === "auth";
  const authReason = searchParams.get("reason");
  const kakaoOAuthEnabled = isSupabaseConfigured();
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [kakaoError, setKakaoError] = useState<string | null>(null);

  function handleMockLogin() {
    router.push(redirect);
  }

  async function handleKakaoLogin() {
    setKakaoError(null);

    if (!kakaoOAuthEnabled) {
      handleMockLogin();
      return;
    }

    setKakaoLoading(true);

    try {
      const started = await signInWithKakao(redirect);
      if (!started) {
        handleMockLogin();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[kakao-login]", error);
      }
      setKakaoError(
        "카카오 로그인을 시작하지 못했어요. 아래 설정 확인 후 다시 시도해 주세요.",
      );
      setKakaoLoading(false);
    }
  }

  function handleSocialClick(provider: (typeof socialButtons)[number]["id"]) {
    if (provider === "kakao") {
      void handleKakaoLogin();
      return;
    }

    handleMockLogin();
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

      <p className="mt-6 rounded-xl bg-gray-100 px-4 py-3 text-center text-xs font-bold leading-relaxed text-wadeal-muted">
        {kakaoOAuthEnabled ?
          "카카오 로그인은 Supabase OAuth입니다. KOE205가 뜨면 아래 설정을 확인하세요."
        : "현재는 화면 체험용 로그인입니다."}
      </p>

      {kakaoOAuthEnabled ?
        <KakaoSetupHelp />
      : null}

      {authError ?
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          로그인에 실패했어요.
          {authReason ?
            ` (${authReason})`
          : " 다시 시도해 주세요."}
        </p>
      : null}

      {kakaoError ?
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {kakaoError}
        </p>
      : null}

      <div className="mt-6 space-y-2">
        {socialButtons.map((button) => (
          <button
            className={button.className}
            disabled={button.id === "kakao" && kakaoLoading}
            key={button.id}
            onClick={() => handleSocialClick(button.id)}
            type="button"
          >
            {button.id === "kakao" && kakaoLoading ?
              "카카오 로그인 연결 중..."
            : button.label}
          </button>
        ))}
      </div>

      <button
        className="mt-5 w-full text-center text-sm font-bold text-wadeal-muted underline underline-offset-2"
        onClick={handleMockLogin}
        type="button"
      >
        이메일로 가입하기
      </button>

      <p className="mt-auto pt-8 text-center text-[11px] font-bold leading-relaxed text-gray-400">
        로그인 시 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </div>
  );
}
