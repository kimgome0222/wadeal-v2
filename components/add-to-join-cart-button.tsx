"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToJoinCartAction } from "@/app/actions/join-cart";

type AddToJoinCartButtonProps = {
  dealSlug: string;
  className?: string;
};

export function AddToJoinCartButton({ dealSlug, className = "" }: AddToJoinCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);

    startTransition(async () => {
      const result = await addToJoinCartAction(dealSlug, 1);

      if ("error" in result && result.error === "login_required") {
        router.push(`/login?next=/product/${dealSlug}`);
        return;
      }

      if (!result.success) {
        if ("error" in result && result.error === "deal_closed") {
          setMessage("마감된 공동구매예요.");
          return;
        }
        setMessage("담기에 실패했어요.");
        return;
      }

      router.push("/join-cart");
    });
  }

  return (
    <div className="relative">
      <button
        aria-label="참여 검토함에 담기"
        className={`flex h-12 min-w-[7rem] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white px-2.5 text-[12px] font-black text-wadeal-ink active:bg-gray-50 disabled:opacity-60 ${className}`}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        {isPending ? "담는 중..." : "검토함 담기"}
      </button>
      {message ?
        <p className="absolute -top-8 right-0 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-bold text-white">
          {message}
        </p>
      : null}
    </div>
  );
}
