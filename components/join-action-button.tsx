"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ui } from "@/lib/ui";

type JoinActionButtonProps = {
  dealSlug: string;
  initialLoggedIn: boolean;
  quantity?: number;
};

export function JoinActionButton({
  dealSlug,
  initialLoggedIn: _initialLoggedIn,
  quantity = 1,
}: JoinActionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkoutPath =
    quantity > 1 ?
      `/checkout/${dealSlug}?qty=${quantity}`
    : `/checkout/${dealSlug}`;

  async function handleJoinClick() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      router.push(checkoutPath);
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
      {loading ? "확인 중..." : "구매하기"}
    </button>
  );
}
