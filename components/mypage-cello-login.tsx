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
    <div className="space-y-4 py-2">
      <div className="text-center">
        <h1 className={ds.type.h2}>로그인이 필요해요</h1>
        <p className={`mt-2 ${ds.type.bodySm} text-wadeal-muted`}>
          마이셀로에서 주문, 찜, 혜택을 한 번에 확인해보세요.
        </p>
      </div>

      {errorMessage ?
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-medium text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      <div className="space-y-2.5">
        <button
          className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#03c75a]/40 text-[14px] font-semibold text-white"
          disabled
          type="button"
        >
          네이버로 로그인 (준비중)
        </button>
        <button
          className={`${ui.btnKakao} ${loading === "kakao" ? "opacity-70" : ""}`}
          disabled={loading !== null}
          onClick={() => void handleKakao()}
          type="button"
        >
          {loading === "kakao" ? "연결 중..." : "카카오톡 로그인"}
        </button>
        <button
          className="flex h-12 w-full items-center justify-center rounded-xl border border-[#DDE8E2] bg-white text-[14px] font-semibold text-wadeal-ink active:bg-[#FAFBFA] disabled:opacity-60"
          disabled={loading !== null || !supabaseReady}
          onClick={() => void handleGoogle()}
          type="button"
        >
          {loading === "google" ? "연결 중..." : "Google로 로그인"}
        </button>
        <Link
          className={`${ui.btnOutline} flex h-12 items-center justify-center text-[14px] font-semibold`}
          href={`/login?next=${encodeURIComponent(redirect)}`}
        >
          셀로 아이디로 로그인
        </Link>
        {prototypeEnabled ?
          <button
            className={`${ui.btnOutline} w-full text-[13px]`}
            onClick={() => void handlePrototype()}
            type="button"
          >
            데모 로그인 (개발)
          </button>
        : null}
      </div>

      <p className="text-center">
        <Link className={`${ds.type.link} text-[13px]`} href={`/signup?next=${encodeURIComponent(redirect)}`}>
          셀로 아이디로 회원가입
        </Link>
      </p>
    </div>
  );
}
