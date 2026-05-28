import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

async function createWebhookNotification(input: {
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
}): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase.rpc("create_notification", {
    p_user_id: input.userId,
    p_type: input.type,
    p_title: input.title,
    p_message: input.message,
    p_link_url: input.linkUrl ?? "/mypage/orders",
    p_channel: "in_app",
  });

  if (error) {
    console.error("[notifications] webhook:", error.message);
  }
}

export async function notifyDepositCompleted(input: {
  userId: string;
  productName: string;
  amount: number;
}): Promise<void> {
  await createWebhookNotification({
    userId: input.userId,
    type: "payment_deposit_completed",
    title: "입금 완료",
    message: "가상계좌 입금이 확인되었습니다.",
    linkUrl: "/mypage/orders",
  });
}

export async function notifyPaymentApproved(input: {
  userId: string;
  productName: string;
  amount: number;
}): Promise<void> {
  await createWebhookNotification({
    userId: input.userId,
    type: "payment_paid",
    title: "결제 완료",
    message: `${input.productName} · ${input.amount.toLocaleString("ko-KR")}원`,
    linkUrl: "/mypage/orders",
  });
}

export async function notifyPaymentFailed(input: {
  userId: string;
  productName: string;
}): Promise<void> {
  await createWebhookNotification({
    userId: input.userId,
    type: "payment_failed",
    title: "결제 실패",
    message: `${input.productName} · 결제에 실패했어요. 다시 시도해 주세요.`,
    linkUrl: "/mypage/orders",
  });
}

export async function notifyRefundCompleted(input: {
  userId: string;
  productName: string;
  amount: number;
}): Promise<void> {
  await createWebhookNotification({
    userId: input.userId,
    type: "refund_updated",
    title: "환불 완료",
    message: `${input.productName} · ${input.amount.toLocaleString("ko-KR")}원 환불이 완료됐어요`,
    linkUrl: "/mypage/orders",
  });
}
