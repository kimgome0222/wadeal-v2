"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToJoinCartAction } from "@/app/actions/join-cart";
import { ds } from "@/lib/design-system";

type AddToJoinCartButtonProps = {
  dealSlug: string;
  quantity?: number;
  className?: string;
};

export function AddToJoinCartButton({
  dealSlug,
  quantity = 1,
  className = "",
}: AddToJoinCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);

    startTransition(async () => {
      const result = await addToJoinCartAction(dealSlug, quantity);

      if ("error" in result && result.error === "login_required") {
        const returnPath = `/join-cart?pending=${encodeURIComponent(dealSlug)}`;
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
        return;
      }

      if (!result.success) {
        if ("error" in result && result.error === "deal_closed") {
          setMessage("판매가 종료된 상품이에요.");
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
        aria-label="장바구니에 담기"
        className={`${ds.btn.outline} h-11 min-w-0 cursor-pointer px-3 text-[12px] disabled:opacity-60 ${className}`}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        {isPending ? "담는 중..." : "장바구니"}
      </button>
      {message ?
        <p className="absolute -top-8 right-0 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-white">
          {message}
        </p>
      : null}
    </div>
  );
}
