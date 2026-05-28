"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { saveUserConsentsAction } from "@/app/actions/consents";
import { setPrototypeSessionAction } from "@/app/actions/auth";
import {
  isConsentFormComplete,
  UserConsentForm,
} from "@/components/user-consent-form";
import { SiteFooterContent } from "@/components/site-footer-content";
import type { ConsentFormValues } from "@/lib/consents/types";
import { EMPTY_CONSENT_FORM } from "@/lib/consents/types";
import { signInWithKakaoOAuth } from "@/lib/auth/supabase-oauth";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const socialButtons = [
  { id: "kakao", label: "카카오로 시작하기", className: "btn-kakao cursor-pointer" },
  {
    id: "naver",
    label: "네이버로 시작하기",
    className:
      "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#03c75a] text-[15px] font-black text-white active:opacity-90",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    className:
      "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-[15px] font-black text-wadeal-ink active:bg-gray-50",
  },
  {
    id: "apple",
    label: "Apple로 시작하기",
    className:
      "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900 text-[15px] font-black text-white active:opacity-90",
  },
  {
    id: "samsung",
    label: "Samsung 계정으로 시작하기",
    className:
      "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#1428a0] text-[15px] font-black text-white active:opacity-90",
  },
] as const;

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(
    searchParams.get("redirect") ?? searchParams.get("next") ?? "/mypage",
  );
  const authError = searchParams.get("error") === "auth";
  const authReason = searchParams.get("reason");
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [kakaoError, setKakaoError] = useState<string | null>(null);
  const [consentValues, setConsentValues] = useState<ConsentFormValues>(EMPTY_CONSENT_FORM);
  const [consentComplete, setConsentComplete] = useState(false);
  const supabaseReady = isSupabaseConfigured();
  const prototypeEnabled = isPrototypeAuthEnabled();

  async function persistConsentsAfterLogin() {
    if (!isConsentFormComplete(consentValues)) {
      return;
    }

    await saveUserConsentsAction({
      terms: consentValues.terms,
      privacy: consentValues.privacy,
      groupbuy: consentValues.groupbuy,
      marketing: consentValues.marketing,
    });
  }

  async function handleMockLogin() {
    if (!consentComplete) {
      return;
    }

    await setPrototypeSessionAction();
    await persistConsentsAfterLogin();
    router.push(redirect);
    router.refresh();
  }

  async function handleKakaoLogin() {
    if (!consentComplete) {
      return;
    }

    setKakaoError(null);
    setKakaoLoading(true);

    try {
      await signInWithKakaoOAuth(redirect);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[login] kakao oauth:", error);
      }
      setKakaoError(
        supabaseReady ?
          "카카오 로그인을 시작하지 못했어요. 다시 시도해 주세요."
        : "Supabase 설정이 필요해요. 환경 변수를 확인해 주세요.",
      );
      setKakaoLoading(false);
    }
  }

  function handleSocialClick(provider: (typeof socialButtons)[number]["id"]) {
    if (!consentComplete) {
      return;
    }

    if (provider === "kakao") {
      void handleKakaoLogin();
      return;
    }

    if (prototypeEnabled) {
      void handleMockLogin();
    }
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

      {authError ?
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
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

      <div className="mt-6">
        <UserConsentForm
          onValuesChange={(values, allRequiredChecked) => {
            setConsentValues(values);
            setConsentComplete(allRequiredChecked);
          }}
          variant="compact"
        />
      </div>

      <div className="mt-4 space-y-2">
        {socialButtons.map((button) => {
          const isDisabled =
            !consentComplete ||
            (button.id === "kakao" && (kakaoLoading || !supabaseReady)) ||
            (button.id !== "kakao" && !prototypeEnabled);

          return (
          <button
            className={`${button.className} disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isDisabled}
            key={button.id}
            onClick={() => handleSocialClick(button.id)}
            type="button"
          >
            {button.id === "kakao" && kakaoLoading ?
              "카카오 로그인 연결 중..."
            : button.id !== "kakao" && !prototypeEnabled ?
              `${button.label} (준비 중)`
            : button.label}
          </button>
        )})}
      </div>

      {prototypeEnabled ?
        <button
          className="mt-5 w-full cursor-pointer text-center text-sm font-bold text-wadeal-muted underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!consentComplete}
          onClick={() => void handleMockLogin()}
          type="button"
        >
          데모 로그인 (프로토타입)
        </button>
      : null}

      <SiteFooterContent className="mt-8" />
    </div>
  );
}
