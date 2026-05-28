"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ui } from "@/lib/ui";

type JoinActionButtonProps = {
  dealSlug: string;
  initialLoggedIn: boolean;
  quantity?: number;
};

export function JoinActionButton({
  dealSlug,
  initialLoggedIn,
  quantity = 1,
}: JoinActionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkoutPath =
    quantity > 1 ?
      `/checkout/${dealSlug}?qty=${quantity}`
    : `/checkout/${dealSlug}`;
  const loginHref = `/login?next=${encodeURIComponent(checkoutPath)}`;

  async function handleJoinClick() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      let loggedIn = initialLoggedIn;
      const supabase = createBrowserSupabaseClient();

      if (!supabase) {
        router.push(checkoutPath);
        return;
      }

      if (!loggedIn) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        loggedIn = !!user;
      }

      router.push(loggedIn ? checkoutPath : loginHref);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`${ui.btnPrimary} cursor-pointer disabled:cursor-not-allowed`}
      disabled={loading}
      onClick={() => void handleJoinClick()}
      type="button"
    >
      {loading ? "확인 중..." : "공동구매 참여하기"}
    </button>
  );
}
