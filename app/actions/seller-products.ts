"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerProductById } from "@/lib/data/seller-products";
import { submitProductForReview } from "@/lib/data/product-approval";

type ActionResult = { success: boolean; message: string };

export async function submitSellerProductForReviewAction(
  productId: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const product = await getSellerProductById(user.id, productId);
  if (!product) {
    return { success: false, message: "상품을 찾을 수 없어요." };
  }

  if (
    product.approvalStatus !== "draft" &&
    product.approvalStatus !== "rejected"
  ) {
    return { success: false, message: "검수 요청할 수 없는 상태예요." };
  }

  const result = await submitProductForReview(productId);
  if (!result.success) {
    return { success: false, message: "검수 요청에 실패했어요." };
  }

  revalidatePath("/seller/products");
  revalidatePath("/admin/products");
  return { success: true, message: "검수 요청이 접수됐어요." };
}
