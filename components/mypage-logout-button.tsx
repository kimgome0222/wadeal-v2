"use client";

import { useRouter } from "next/navigation";
import { clearPrototypeSessionAction } from "@/app/actions/auth";
import {
  createBrowserSupabaseClient,
  resetBrowserSupabaseClient,
} from "@/lib/supabase/client";

export function MypageLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await clearPrototypeSessionAction();

    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error && process.env.NODE_ENV === "development") {
        console.error("[mypage] logout:", error.message);
      }
      resetBrowserSupabaseClient();
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left active:bg-gray-50"
      onClick={() => void handleLogout()}
      type="button"
    >
      <p className="text-sm font-black text-wadeal-ink">로그아웃</p>
      <span aria-hidden className="text-gray-400">
        ›
      </span>
    </button>
  );
}
