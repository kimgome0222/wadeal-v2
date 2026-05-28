"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  createSupportTicketAction,
  requestOrderCancelAction,
  requestOrderRefundAction,
} from "@/app/actions/support";
import { SupportOrderPicker } from "@/components/support-order-picker";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import {
  INQUIRY_CATEGORY_GROUPS,
  filterOrdersForInquiry,
  findInquirySubcategory,
  isOrderLinkedInquiryType,
  type InquiryChannel,
} from "@/lib/support/inquiry-options";
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
  initialSubId?: string | null;
  initialChannel?: InquiryChannel | null;
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
  initialSubId,
  initialChannel,
  mode = "general",
}: SupportTicketCreateFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const presetSub = findInquirySubcategory(initialSubId ?? searchParams.get("sub"));
  const [orderId, setOrderId] = useState(initialOrderId ?? "");
  const [type, setType] = useState<SupportTicketType>(
    mode === "cancel" ? "cancel"
    : mode === "refund" ? "refund"
    : presetSub?.ticketType ?? parseInitialType(initialType),
  );
  const [title, setTitle] = useState(presetSub?.label ?? "");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const channel = initialChannel ?? (searchParams.get("channel") as InquiryChannel | null);
  const recentOrders = useMemo(() => filterOrdersForInquiry(orders), [orders]);
  const requiresOrder = isOrderLinkedInquiryType(type);
  const selectedOrder = orders.find((order) => order.id === orderId) ?? null;
  const isCancelMode = mode === "cancel" || type === "cancel";
  const isRefundMode = mode === "refund" || type === "refund";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (requiresOrder && !orderId && recentOrders.length > 0) {
      setFeedback({ tone: "error", message: "문의할 주문 상품을 선택해 주세요." });
      return;
    }

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
        title: title.trim() || getSupportTypeLabel(type),
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
      {channel === "kakao" ?
        <p className="rounded-lg bg-[#fee500]/30 px-3 py-2 text-xs font-medium text-[#3c1e1e]">
          카카오톡 문의 전, 아래 내용을 미리 작성해 두시면 더 빠르게 도와드릴 수 있어요.
        </p>
      : channel === "email" ?
        <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-medium text-wadeal-muted">
          이메일 문의 시 아래 내용을 함께 보내 주세요.
        </p>
      : null}

      {presetSub ?
        <div className="rounded-xl border border-wadeal-line bg-wadeal-surface px-4 py-3">
          <p className="text-[11px] font-semibold text-wadeal-muted">선택한 문의 유형</p>
          <p className="mt-1 text-sm font-bold text-wadeal-ink">{presetSub.label}</p>
        </div>
      : null}

      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      {mode === "general" && !presetSub ?
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

      {mode === "general" && !presetSub ?
        <div className="space-y-2">
          <p className={ui.label}>세부 유형</p>
          {INQUIRY_CATEGORY_GROUPS.map((group) => (
            <div className="rounded-xl border border-wadeal-line bg-white" key={group.id}>
              <p className="border-b border-wadeal-line px-3 py-2 text-[11px] font-bold text-wadeal-muted">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5 p-2">
                {group.subcategories.map((sub) => (
                  <button
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      type === sub.ticketType && title === sub.label ?
                        "bg-wadeal-red text-white"
                      : "bg-wadeal-surface text-wadeal-ink ring-1 ring-wadeal-line"
                    }`}
                    key={sub.id}
                    onClick={() => {
                      setType(sub.ticketType);
                      setTitle(sub.label);
                    }}
                    type="button"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      : null}

      {requiresOrder ?
        <div>
          <label className={ui.label}>구매 상품 선택</label>
          <SupportOrderPicker
            onSelect={setOrderId}
            orders={recentOrders}
            required={recentOrders.length > 0}
            selectedOrderId={orderId}
          />
        </div>
      : null}

      {!requiresOrder && mode === "general" ?
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
            {recentOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.productName}
              </option>
            ))}
          </select>
        </div>
      : null}

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
          className={`${ui.input} min-h-[140px] py-3`}
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
        <p className="text-xs font-semibold text-wadeal-red">
          선택한 주문은 현재 취소 요청을 할 수 없어요.
        </p>
      : null}

      {selectedOrder && isRefundMode && !canRequestRefund(selectedOrder) ?
        <p className="text-xs font-semibold text-wadeal-red">
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
        고객센터로
      </Link>
    </form>
  );
}
