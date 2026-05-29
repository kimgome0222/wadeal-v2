"use server";

import { revalidatePath } from "next/cache";

import { requireSeller } from "@/lib/auth/require-seller";
import {
  sellerOwnsProductInquiry,
} from "@/lib/data/seller-product-inquiries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export async function replySellerProductInquiryAction(
  ticketId: string,
  reply: string,
): Promise<{ ok: boolean; message: string }> {
  const seller = await requireSeller();
  const trimmed = reply.trim();

  if (!trimmed) {
    return { ok: false, message: "답변 내용을 입력해 주세요." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase가 설정되지 않았어요." };
  }

  const owns = await sellerOwnsProductInquiry(seller.userId, ticketId);
  if (!owns) {
    return { ok: false, message: "답변 권한이 없어요." };
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "서버 설정 오류입니다." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("support_tickets")
    .update({
      admin_reply: trimmed,
      status: "answered",
      updated_at: now,
    })
    .eq("id", ticketId);

  if (error) {
    console.error("[seller-product-inquiry] reply:", error.message);
    return { ok: false, message: "답변 저장에 실패했어요." };
  }

  revalidatePath("/seller/inquiries");
  revalidatePath("/seller/cs-reviews");

  return { ok: true, message: "답변이 등록됐어요." };
}
