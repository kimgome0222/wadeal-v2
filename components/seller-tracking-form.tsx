"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { registerTrackingNumberAction } from "@/app/actions/registerTrackingNumber";
import { COURIERS } from "@/lib/shipping/couriers";
import { ui } from "@/lib/ui";

type SellerTrackingFormProps = {
  orderId: string;
};

export function SellerTrackingForm({ orderId }: SellerTrackingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await registerTrackingNumberAction(orderId, formData);
      if (result.success) {
        setFeedback({ tone: "success", message: "송장이 등록됐어요." });
        router.refresh();
        return;
      }

      setFeedback({ tone: "error", message: result.message });
    });
  }

  return (
    <form className={`${ui.panel} mt-6 space-y-3`} onSubmit={handleSubmit}>
      <h3 className="text-sm font-black text-wadeal-ink">송장 등록</h3>

      <select className={ui.input} name="courierCode" required>
        <option value="">택배사 선택</option>
        {COURIERS.map((courier) => (
          <option key={courier.code} value={courier.code}>
            {courier.name}
          </option>
        ))}
      </select>

      <input
        className={ui.input}
        name="trackingNumber"
        placeholder="송장번호 입력"
        required
      />

      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-wadeal-red"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      : null}

      <button className={`${ui.btnPrimary} h-11 disabled:opacity-50`} disabled={isPending} type="submit">
        {isPending ? "등록 중..." : "배송 시작"}
      </button>
    </form>
  );
}
