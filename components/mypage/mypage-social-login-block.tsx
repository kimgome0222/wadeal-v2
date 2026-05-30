"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { setPrototypeSessionAction } from "@/app/actions/auth";
import {
  signInWithGoogleOAuth,
  signInWithKakaoOAuth,
} from "@/lib/auth/supabase-oauth";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ui } from "@/lib/ui";

type MypageSocialLoginBlockProps = {
  redirect?: string;
  loginHref?: string;
  signupHref?: string;
  className?: string;
};

export function MypageSocialLoginBlock({
  redirect = "/mypage",
  loginHref,
  signupHref,
  className = "px-6",
}: MypageSocialLoginBlockProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const prototypeEnabled = isPrototypeAuthEnabled();
  const supabaseReady = isSupabaseConfigured();
  const resolvedLoginHref = loginHref ?? `/login?next=${encodeURIComponent(redirect)}`;
  const resolvedSignupHref = signupHref ?? `/signup?next=${encodeURIComponent(redirect)}`;

  async function handleKakao() {
    setErrorMessage(null);
    setLoading("kakao");
    try {
      await signInWithKakaoOAuth(redirect);
    } catch {
      setErrorMessage("카카오 로그인을 시작하지 못했어요.");
      setLoading(null);
    }
  }

  async function handleGoogle() {
    setErrorMessage(null);
    setLoading("google");
    try {
      await signInWithGoogleOAuth(redirect);
    } catch {
      setErrorMessage("Google 로그인을 시작하지 못했어요.");
      setLoading(null);
    }
  }

  async function handlePrototype() {
    await setPrototypeSessionAction();
    router.refresh();
  }

  const btnKakao = `${ui.btnKakao} flex h-12 w-full items-center justify-center rounded-2xl text-[14px] font-semibold ${loading === "kakao" ? "opacity-70" : ""}`;
  const btnGoogle =
    "flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white text-[14px] font-semibold text-[#111111] active:bg-[#FAFBFA]";

  return (
    <section className={className}>
      {errorMessage ?
        <p className="mb-4 rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-[13px] text-[#E28A3B]">
          {errorMessage}
        </p>
      : null}

      <div className="space-y-2.5">
        <button
          className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-2xl bg-[#03c75a]/40 text-[14px] font-semibold text-white"
          disabled
          type="button"
        >
          네이버 로그인 (준비중)
        </button>
        <button
          className={btnKakao}
          disabled={loading !== null || !supabaseReady}
          onClick={() => void handleKakao()}
          type="button"
        >
          {loading === "kakao" ? "연결 중..." : "카카오 로그인"}
        </button>
        <button
          className={btnGoogle}
          disabled={loading !== null || !supabaseReady}
          onClick={() => void handleGoogle()}
          type="button"
        >
          {loading === "google" ? "연결 중..." : "Google 로그인"}
        </button>
        <Link
          className={`${ui.btnOutline} flex h-12 w-full items-center justify-center rounded-2xl text-[14px] font-semibold`}
          href={resolvedLoginHref}
        >
          셀로 아이디 로그인
        </Link>
        {prototypeEnabled ?
          <button
            className={`${ui.btnOutline} h-11 w-full rounded-2xl text-[13px]`}
            onClick={() => void handlePrototype()}
            type="button"
          >
            데모 로그인 (개발)
          </button>
        : null}
      </div>

      <p className="mt-6 text-center">
        <Link
          className="text-[14px] font-medium text-[#666666] underline-offset-2 hover:underline"
          href={resolvedSignupHref}
        >
          셀로 아이디로 회원가입
        </Link>
      </p>
    </section>
  );
}
