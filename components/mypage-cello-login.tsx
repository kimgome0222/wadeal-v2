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

export function MypageCelloLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const prototypeEnabled = isPrototypeAuthEnabled();
  const supabaseReady = isSupabaseConfigured();
  const redirect = "/mypage";
  const loginHref = `/login?next=${encodeURIComponent(redirect)}`;
  const signupHref = `/signup?next=${encodeURIComponent(redirect)}`;

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

  const btnPrimary = `${ui.btnPrimary} flex h-14 w-full items-center justify-center rounded-2xl text-[15px] font-semibold`;
  const btnKakao = `${ui.btnKakao} flex h-14 w-full items-center justify-center rounded-2xl text-[15px] font-semibold ${loading === "kakao" ? "opacity-70" : ""}`;
  const btnGoogle =
    "flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white text-[15px] font-semibold text-[#111111] active:bg-[#FAFBFA]";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-16">
      <div className="mx-auto w-full max-w-[360px] text-center">
        <h1 className="text-[22px] font-bold text-[#111111]">로그인이 필요해요</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#666666]">
          로그인 후 주문, 찜, 혜택을 한 번에 확인해보세요.
        </p>

        {errorMessage ?
          <p className="mt-4 rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-[13px] text-[#E28A3B]">
            {errorMessage}
          </p>
        : null}

        <div className="mt-10 space-y-3">
          <Link className={btnPrimary} href={loginHref}>
            로그인하기
          </Link>
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
            {loading === "google" ? "연결 중..." : "구글 로그인"}
          </button>
          <Link
            className={`${ui.btnOutline} flex h-14 w-full items-center justify-center rounded-2xl text-[15px] font-semibold`}
            href={loginHref}
          >
            셀로 아이디 로그인
          </Link>
          {prototypeEnabled ?
            <button
              className={`${ui.btnOutline} h-12 w-full rounded-2xl text-[13px]`}
              onClick={() => void handlePrototype()}
              type="button"
            >
              데모 로그인 (개발)
            </button>
          : null}
        </div>

        <p className="mt-8">
          <Link className="text-[14px] font-medium text-[#666666] underline-offset-2 hover:underline" href={signupHref}>
            셀로 아이디로 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
