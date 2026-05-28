"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createSupportTicketAction,
  requestOrderCancelAction,
  requestOrderRefundAction,
} from "@/app/actions/support";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import {
  SUPPORT_TICKET_TYPES,
  canRequestCancel,
  canRequestRefund,
  getSupportTypeLabel,
  type SupportTicketType,
} from "@/lib/support/ticket-rules";
import { ui } from "@/lib/ui";

type SupportTicketCreateFormProps = {
  orders: UserOrderRecord[];
  initialOrderId?: string | null;
  initialProductId?: string | null;
  initialType?: string | null;
  mode?: "general" | "cancel" | "refund";
};

const GENERAL_TYPES = SUPPORT_TICKET_TYPES.filter(
  (type) => type !== "cancel" && type !== "refund",
);

function getCreatedTicketPath(result: { success: boolean } & Record<string, unknown>): string {
  if (!result.success) {
    return "/support";
  }

  const ticketId =
    typeof result.id === "string" ? result.id
    : typeof result.ticketId === "string" ? result.ticketId
    : null;

  return ticketId ? `/support/${ticketId}` : "/support";
}

function parseInitialType(value: string | null | undefined): SupportTicketType {
  if (value === "cancel" || value === "refund") {
    return value;
  }

  if (value && (SUPPORT_TICKET_TYPES as readonly string[]).includes(value)) {
    return value as SupportTicketType;
  }

  return "order";
}

export function SupportTicketCreateForm({
  orders,
  initialOrderId,
  initialProductId,
  initialType,
  mode = "general",
}: SupportTicketCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderId, setOrderId] = useState(initialOrderId ?? "");
  const [type, setType] = useState<SupportTicketType>(
    mode === "cancel" ? "cancel" : mode === "refund" ? "refund" : parseInitialType(initialType),
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const selectedOrder = orders.find((order) => order.id === orderId) ?? null;
  const isCancelMode = mode === "cancel" || type === "cancel";
  const isRefundMode = mode === "refund" || type === "refund";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      if (isCancelMode && selectedOrder) {
        const result = await requestOrderCancelAction({
          orderId: selectedOrder.id,
          reason: content.trim(),
        });

        if (result.success) {
          router.push(getCreatedTicketPath(result));
          router.refresh();
          return;
        }

        setFeedback({
          tone: "error",
          message:
            result.error === "not_eligible" ?
              "현재 상태에서는 취소 요청을 할 수 없어요."
            : "취소 요청에 실패했어요. 잠시 후 다시 시도해 주세요.",
        });
        return;
      }

      if (isRefundMode && selectedOrder) {
        const result = await requestOrderRefundAction({
          orderId: selectedOrder.id,
          reason: content.trim(),
        });

        if (result.success) {
          router.push(getCreatedTicketPath(result));
          router.refresh();
          return;
        }

        setFeedback({
          tone: "error",
          message:
            result.error === "not_eligible" ?
              "현재 상태에서는 환불 요청을 할 수 없어요."
            : "환불 요청에 실패했어요. 잠시 후 다시 시도해 주세요.",
        });
        return;
      }

      const result = await createSupportTicketAction({
        orderId: orderId || null,
        productId: initialProductId ?? selectedOrder?.productId ?? null,
        type,
        title: title.trim(),
        content: content.trim(),
      });

      if (result.success) {
        router.push(getCreatedTicketPath(result));
        router.refresh();
        return;
      }

      setFeedback({
        tone: "error",
        message: "문의 등록에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      {mode === "general" ?
        <div>
          <label className={ui.label} htmlFor="support-type">
            문의 유형
          </label>
          <select
            className={ui.input}
            id="support-type"
            onChange={(event) => setType(event.target.value as SupportTicketType)}
            value={type}
          >
            {GENERAL_TYPES.map((item) => (
              <option key={item} value={item}>
                {getSupportTypeLabel(item)}
              </option>
            ))}
          </select>
        </div>
      : null}

      <div>
        <label className={ui.label} htmlFor="support-order">
          관련 주문 (선택)
        </label>
        <select
          className={ui.input}
          id="support-order"
          onChange={(event) => setOrderId(event.target.value)}
          value={orderId}
        >
          <option value="">선택 안 함</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.productName}
            </option>
          ))}
        </select>
      </div>

      {!isCancelMode && !isRefundMode ?
        <div>
          <label className={ui.label} htmlFor="support-title">
            제목
          </label>
          <input
            className={ui.input}
            id="support-title"
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="문의 제목을 입력해 주세요"
            required
            value={title}
          />
        </div>
      : null}

      <div>
        <label className={ui.label} htmlFor="support-content">
          {isCancelMode ? "취소 사유" : isRefundMode ? "환불 사유" : "문의 내용"}
        </label>
        <textarea
          className={`${ui.input} min-h-[120px] py-3`}
          id="support-content"
          maxLength={2000}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            isCancelMode ? "취소 사유를 입력해 주세요"
            : isRefundMode ?
              "환불 사유를 입력해 주세요"
            : "문의 내용을 자세히 입력해 주세요"
          }
          required
          value={content}
        />
      </div>

      {selectedOrder && isCancelMode && !canRequestCancel(selectedOrder) ?
        <p className="text-xs font-bold text-wadeal-red">
          선택한 주문은 현재 취소 요청을 할 수 없어요.
        </p>
      : null}

      {selectedOrder && isRefundMode && !canRequestRefund(selectedOrder) ?
        <p className="text-xs font-bold text-wadeal-red">
          선택한 주문은 현재 환불 요청을 할 수 없어요.
        </p>
      : null}

      <button
        className={`${ui.btnPrimary} disabled:opacity-50`}
        disabled={
          isPending ||
          (isCancelMode && selectedOrder != null && !canRequestCancel(selectedOrder)) ||
          (isRefundMode && selectedOrder != null && !canRequestRefund(selectedOrder))
        }
        type="submit"
      >
        {isPending ?
          "등록 중..."
        : isCancelMode ?
          "취소 요청하기"
        : isRefundMode ?
          "환불 요청하기"
        : "문의 등록하기"}
      </button>

      <Link className={`${ui.btnOutline} block text-center`} href="/support">
        목록으로
      </Link>
    </form>
  );
}
