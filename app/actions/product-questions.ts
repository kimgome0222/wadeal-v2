"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { createSupportTicket } from "@/lib/data/support-tickets";
import { notifySellerNewProductQuestion } from "@/lib/notifications/seller-events";
import { resolveProductSellerContext } from "@/lib/notifications/product-seller";

type ActionResult = { success: boolean; message: string };

export async function createProductQuestionAction(
  productId: string,
  productName: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인 후 문의할 수 있어요." };
  }

  const content = formData.get("content")?.toString().trim() ?? "";
  if (content.length < 5) {
    return { success: false, message: "문의 내용을 5자 이상 입력해 주세요." };
  }

  const result = await createSupportTicket({
    userId: user.id,
    productId,
    type: "product",
    title: `${productName} 상품 문의`,
    content,
  });

  if (!result.success) {
    return { success: false, message: "문의 등록에 실패했어요." };
  }

  const sellerContext = await resolveProductSellerContext(productId);
  if (sellerContext) {
    await notifySellerNewProductQuestion({
      sellerUserId: sellerContext.sellerUserId,
      productName: sellerContext.productName,
      ticketId: result.id ?? productId,
    });
  }

  revalidatePath(`/product/${productId}`);
  return { success: true, message: "문의가 등록됐어요." };
}

export async function createProductQuestionFormAction(
  productId: string,
  productName: string,
  formData: FormData,
): Promise<void> {
  await createProductQuestionAction(productId, productName, formData);
}
