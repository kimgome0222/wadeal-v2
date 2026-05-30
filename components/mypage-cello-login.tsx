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
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

export function MypageCelloLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const prototypeEnabled = isPrototypeAuthEnabled();
  const supabaseReady = isSupabaseConfigured();
  const redirect = "/mypage";
  const loginHref = `/login?next=${encodeURIComponent(redirect)}`;

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

  return (
    <div className="relative z-0 px-5 pb-8 pt-10">
      <div className="mx-auto w-full max-w-[360px] text-center">
        <div
          aria-hidden
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F8F4] text-[#2E5E4E]"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21a8 8 0 1 0-16 0" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className={ds.type.h2}>로그인이 필요해요</h1>
        <p className={`mt-3 ${ds.type.bodySm} leading-relaxed text-wadeal-muted`}>
          마이셀로에서 주문, 찜, 혜택을 한 번에 확인해보세요.
        </p>

        {errorMessage ?
          <p className="mt-4 rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-medium text-wadeal-red">
            {errorMessage}
          </p>
        : null}

        <div className="relative z-10 mt-8 space-y-2.5">
          <Link
            className={`${ui.btnPrimary} relative z-10 flex h-[52px] items-center justify-center rounded-[14px] text-[15px] font-semibold`}
            href={loginHref}
          >
            로그인하기
          </Link>

          <p className="pt-1 text-[12px] font-medium text-wadeal-muted">또는 소셜 계정으로 바로 시작</p>

          <button
            className="flex h-[52px] w-full cursor-not-allowed items-center justify-center rounded-[14px] bg-[#03c75a]/40 text-[14px] font-semibold text-white"
            disabled
            type="button"
          >
            네이버로 로그인 (준비중)
          </button>
          <button
            className={`${ui.btnKakao} relative z-10 ${loading === "kakao" ? "opacity-70" : ""}`}
            disabled={loading !== null || !supabaseReady}
            onClick={() => void handleKakao()}
            type="button"
          >
            <span aria-hidden className="text-[18px] leading-none">💬</span>
            {loading === "kakao" ? "연결 중..." : "카카오톡 로그인"}
          </button>
          <button
            className={`${ui.authBtn} relative z-10 border border-[#DDE8E2] bg-white text-wadeal-ink active:bg-[#FAFBFA]`}
            disabled={loading !== null || !supabaseReady}
            onClick={() => void handleGoogle()}
            type="button"
          >
            {loading === "google" ? "연결 중..." : "Google로 로그인"}
          </button>
          {prototypeEnabled ?
            <button
              className={`${ui.btnOutline} relative z-10 h-[52px] w-full rounded-[14px] text-[13px]`}
              onClick={() => void handlePrototype()}
              type="button"
            >
              데모 로그인 (개발)
            </button>
          : null}
        </div>

        <p className="relative z-10 mt-6 text-center">
          <Link className={`${ds.type.link} text-[13px]`} href={`/signup?next=${encodeURIComponent(redirect)}`}>
            셀로 아이디로 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
