"use server";

import { revalidatePath } from "next/cache";

import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getSellerProductById,
  getSellerProductEditDetail,
  updateSellerProduct,
} from "@/lib/data/seller-products";
import { submitProductForReview } from "@/lib/data/product-approval";

type ActionResult = { success: boolean; message: string };

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  const raw = value?.toString().trim();
  if (!raw) {
    return null;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function submitSellerProductForReviewAction(
  productId: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
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

export async function updateSellerProductAction(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";
  const originalPrice = parseOptionalInt(formData.get("originalPrice"));
  const groupPrice = parseOptionalInt(formData.get("groupPrice"));
  const targetParticipants = parseOptionalInt(formData.get("targetParticipants"));
  const endsAtRaw = formData.get("endsAt")?.toString().trim();
  const endsAt = endsAtRaw ? `${endsAtRaw}T23:59:59.000Z` : null;
  const stockRaw = formData.get("stockQuantity")?.toString().trim();
  const stockQuantity =
    stockRaw === "" || stockRaw == null ? null : parseOptionalInt(formData.get("stockQuantity"));

  if (!name) {
    return { success: false, message: "상품명을 입력해 주세요." };
  }

  if (originalPrice == null || groupPrice == null || targetParticipants == null) {
    return { success: false, message: "가격과 목표 인원을 확인해 주세요." };
  }

  const result = await updateSellerProduct({
    sellerUserId: user.id,
    productId,
    name,
    imageUrl: imageUrl || null,
    description: description || null,
    originalPrice,
    groupPrice,
    targetParticipants,
    endsAt,
    stockQuantity,
  });

  if (!result.success) {
    if (result.error === "not_found") {
      return { success: false, message: "상품을 찾을 수 없어요." };
    }
    if (result.error === "locked") {
      return {
        success: false,
        message: "판매 중인 상품은 가격·재고·목표 인원·마감일 변경이 제한돼요. 설명·이미지만 수정하세요.",
      };
    }
    return { success: false, message: "저장에 실패했어요." };
  }

  revalidatePath("/seller/products");
  revalidatePath(`/seller/products/${productId}/edit`);
  revalidatePath("/admin/products");
  return { success: true, message: "상품 정보가 저장됐어요." };
}
