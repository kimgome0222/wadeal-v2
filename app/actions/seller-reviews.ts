"use server";

import { revalidatePath } from "next/cache";

import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  hideSellerReviewReply,
  upsertSellerReviewReply,
} from "@/lib/data/seller-reviews";

type ActionResult = { success: boolean; message: string };

export async function saveSellerReviewReplyAction(input: {
  reviewId: string;
  body: string;
}): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const result = await upsertSellerReviewReply({
    sellerId: seller.id,
    sellerUserId: user.id,
    reviewId: input.reviewId,
    body: input.body,
  });

  if (!result.success) {
    const message =
      result.error === "invalid_input" ? "답글 내용을 입력해 주세요."
      : result.error === "not_found" ? "리뷰를 찾을 수 없어요."
      : "답글 저장에 실패했어요.";
    return { success: false, message };
  }

  revalidatePath("/seller/reviews");
  revalidatePath(`/seller/reviews/${input.reviewId}`);
  revalidatePath("/seller/cs-reviews");

  return { success: true, message: "답글이 저장됐어요." };
}

export async function hideSellerReviewReplyAction(reviewId: string): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const result = await hideSellerReviewReply({
    sellerId: seller.id,
    sellerUserId: user.id,
    reviewId,
  });

  if (!result.success) {
    return { success: false, message: "답글 삭제에 실패했어요." };
  }

  revalidatePath("/seller/reviews");
  revalidatePath(`/seller/reviews/${reviewId}`);
  revalidatePath("/seller/cs-reviews");

  return { success: true, message: "답글이 삭제됐어요." };
}
