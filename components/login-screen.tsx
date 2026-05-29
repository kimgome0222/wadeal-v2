"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { saveUserConsentsAction } from "@/app/actions/consents";
import { setPrototypeSessionAction } from "@/app/actions/auth";
import { signInWithUsernameAction } from "@/app/actions/auth/signup";
import {
  isConsentFormComplete,
  UserConsentForm,
} from "@/components/user-consent-form";
import { LoginTrustCards } from "@/components/login-trust-cards";
import { SiteFooterContent } from "@/components/site-footer-content";
import { WadealLogo } from "@/components/wadeal-logo";
import type { ConsentFormValues } from "@/lib/consents/types";
import { EMPTY_CONSENT_FORM } from "@/lib/consents/types";
import { signInWithGoogleOAuth, signInWithKakaoOAuth } from "@/lib/auth/supabase-oauth";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ui } from "@/lib/ui";

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
      "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-[15px] font-black text-wadeal-ink active:bg-wadeal-surface",
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

export type LoginVariant = "buyer" | "seller" | "admin";

const variantConfig = {
  buyer: {
    defaultRedirect: "/mypage",
    tagline: "누가 만들었는지 알고 사세요.",
    title: null as string | null,
    shellClass: "bg-white",
    accentClass: "text-wadeal-ink",
  },
  seller: {
    defaultRedirect: "/seller/dashboard",
    tagline: "판매자와 함께 성장하는 celloh",
    title: "셀러 로그인",
    shellClass: "bg-white",
    accentClass: "text-slate-800",
  },
  admin: {
    defaultRedirect: "/admin/dashboard",
    tagline: "운영·정산·고객 지원 관리",
    title: "관리자 로그인",
    shellClass: "bg-gradient-to-b from-gray-900 to-gray-800",
    accentClass: "text-white",
  },
} as const;

type LoginScreenProps = {
  variant?: LoginVariant;
};

export function LoginScreen({ variant = "buyer" }: LoginScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = variantConfig[variant];
  const redirect = safeRedirectPath(
    searchParams.get("redirect") ??
      searchParams.get("next") ??
      config.defaultRedirect,
  );
  const authError = searchParams.get("error") === "auth";
  const authReason = searchParams.get("reason");
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [kakaoError, setKakaoError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameLoginError, setUsernameLoginError] = useState<string | null>(null);
  const [usernameLoginLoading, setUsernameLoginLoading] = useState(false);
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

  async function handleGoogleLogin() {
    if (!consentComplete) {
      return;
    }

    setKakaoError(null);
    setGoogleLoading(true);

    try {
      await signInWithGoogleOAuth(redirect);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[login] google oauth:", error);
      }
      setKakaoError(
        supabaseReady ?
          "Google 로그인을 시작하지 못했어요. Supabase Google Provider 설정을 확인해 주세요."
        : "Supabase 설정이 필요해요. 환경 변수를 확인해 주세요.",
      );
      setGoogleLoading(false);
    }
  }

  async function handleUsernameLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consentComplete) {
      return;
    }

    setUsernameLoginError(null);
    setUsernameLoginLoading(true);

    try {
      const result = await signInWithUsernameAction({ username, password });
      if (!result.success) {
        setUsernameLoginError("아이디 또는 비밀번호가 올바르지 않아요.");
        return;
      }

      await persistConsentsAfterLogin();
      router.push(redirect);
      router.refresh();
    } finally {
      setUsernameLoginLoading(false);
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

    if (provider === "google") {
      void handleGoogleLogin();
      return;
    }

    if (prototypeEnabled) {
      void handleMockLogin();
    }
  }

  const isDark = variant === "admin";

  return (
    <div
      className={`flex min-h-screen flex-col px-5 pb-8 pt-8 ${config.shellClass}`}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-wadeal-line bg-white px-5 py-6 shadow-card">
          <div className="text-center">
            <div className="flex justify-center">
              <WadealLogo
                href={variant === "buyer" ? "/" : variant === "seller" ? "/seller" : "/admin"}
                size="md"
                variant={isDark ? "light" : "brand"}
              />
            </div>
            {config.title ?
              <h1 className={`mt-5 text-xl font-black ${config.accentClass}`}>
                {config.title}
              </h1>
            : null}
            <p
              className={`${config.title ? "mt-2" : "mt-4"} text-base font-black leading-snug tracking-[-0.02em] sm:text-lg ${config.accentClass}`}
            >
              {config.tagline}
            </p>
            {variant === "buyer" ?
              <>
                <p className="mt-2 text-sm font-bold leading-relaxed text-wadeal-muted">
                  좋은 상품은 좋은 판매자에게서 시작됩니다.
                </p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-wadeal-muted/90">
                  판매자를 알면, 상품이 보입니다.
                </p>
                <LoginTrustCards />
              </>
            : null}
          </div>
        </div>

      {authError ?
        <p
          className={`mt-6 rounded-xl px-4 py-3 text-center text-xs font-bold ${
            isDark ?
              "bg-[#2E5E4E]/40 text-[#DDE8E2]"
            : "bg-[#F5F8F4] text-[#2E5E4E]"
          }`}
        >
          로그인에 실패했어요.
          {authReason ?
            ` (${authReason})`
          : " 다시 시도해 주세요."}
        </p>
      : null}

      {kakaoError ?
        <p className="mt-3 rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-bold text-[#2E5E4E]">
          {kakaoError}
        </p>
      : null}

      <div className="mt-4 rounded-2xl border border-wadeal-line bg-white p-4 shadow-card">
        <UserConsentForm
          onValuesChange={(values, allRequiredChecked) => {
            setConsentValues(values);
            setConsentComplete(allRequiredChecked);
          }}
          variant="compact"
        />
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-wadeal-line bg-white p-4 shadow-card">
        {socialButtons.map((button) => {
          const isDisabled =
            !consentComplete ||
            (button.id === "kakao" && (kakaoLoading || !supabaseReady)) ||
            (button.id === "google" && (googleLoading || !supabaseReady)) ||
            (button.id !== "kakao" && button.id !== "google" && !prototypeEnabled);

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
            : button.id === "google" && googleLoading ?
              "Google 로그인 연결 중..."
            : button.id === "google" && !supabaseReady ?
              `${button.label} (설정 필요)`
            : button.id !== "kakao" && button.id !== "google" && !prototypeEnabled ?
              `${button.label} (준비 중)`
            : button.label}
          </button>
        )})}
      </div>

      {variant === "buyer" ?
        <form className="mt-4 space-y-3 rounded-2xl border border-wadeal-line bg-white p-4 shadow-card" onSubmit={handleUsernameLogin}>
          <p className="text-center text-xs font-bold text-wadeal-muted">아이디 로그인</p>
          <input
            autoComplete="username"
            className={ui.input}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="아이디"
            value={username}
          />
          <input
            autoComplete="current-password"
            className={ui.input}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            type="password"
            value={password}
          />
          {usernameLoginError ?
            <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-center text-xs font-bold text-[#2E5E4E]">
              {usernameLoginError}
            </p>
          : null}
          <button
            className={`${ui.btnPrimary} w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!consentComplete || usernameLoginLoading || !supabaseReady}
            type="submit"
          >
            {usernameLoginLoading ? "로그인 중..." : "아이디로 로그인"}
          </button>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-bold text-wadeal-muted">
            <Link className="underline underline-offset-2" href="/signup">
              회원가입
            </Link>
            <Link className="underline underline-offset-2" href="/forgot-username">
              아이디 찾기
            </Link>
            <Link className="underline underline-offset-2" href="/forgot-password">
              비밀번호 찾기
            </Link>
          </div>
        </form>
      : null}

      {prototypeEnabled ?
        <button
          className={`mt-5 w-full cursor-pointer text-center text-sm font-bold underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isDark ? "text-gray-300" : "text-wadeal-muted"
          }`}
          disabled={!consentComplete}
          onClick={() => void handleMockLogin()}
          type="button"
        >
          데모 로그인 (프로토타입)
        </button>
      : null}

      {variant !== "buyer" ?
        <p className={`mt-6 text-center text-xs ${isDark ? "text-gray-400" : "text-wadeal-muted"}`}>
          <Link
            className="font-bold underline underline-offset-2"
            href="/login"
          >
            일반 회원 로그인
          </Link>
          {" · "}
          <Link
            className="font-bold underline underline-offset-2"
            href="/"
          >
            쇼핑몰 홈
          </Link>
        </p>
      : null}

      <SiteFooterContent className={`mt-8 ${isDark ? "text-gray-500" : ""}`} />
      </div>
    </div>
  );
}
