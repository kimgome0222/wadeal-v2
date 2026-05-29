"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { finalizeDealAction } from "@/app/actions/admin-deals";
import { ui } from "@/lib/ui";

type AdminFinalizeDealButtonProps = {
  dealId: string;
  disabled?: boolean;
};

export function AdminFinalizeDealButton({
  dealId,
  disabled = false,
}: AdminFinalizeDealButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleFinalize() {
    setFeedback(null);

    startTransition(async () => {
      const result = await finalizeDealAction(dealId);

      setFeedback({
        tone: result.success ? "success" : "error",
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-2">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-[#F5F8F4] text-wadeal-red"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      : null}
      <button
        className={`${ui.btnPrimary} h-11 w-full cursor-pointer disabled:opacity-50`}
        disabled={disabled || isPending}
        onClick={handleFinalize}
        type="button"
      >
        {isPending ? "판매 종료 처리 중..." : "판매 종료 처리"}
      </button>
    </div>
  );
}
