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
      className="flex min-h-[56px] w-full cursor-pointer items-center px-4 text-left text-[15px] font-medium text-[#111111] active:bg-[#FAFBFA]"
      onClick={() => void handleLogout()}
      type="button"
    >
      로그아웃
    </button>
  );
}
