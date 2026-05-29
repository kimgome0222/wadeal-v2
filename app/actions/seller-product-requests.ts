"use server";

import { revalidatePath } from "next/cache";

import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { createSellerProductRequest } from "@/lib/data/seller-product-requests";
import { notifyAdminNewProductRequest } from "@/lib/notifications/admin-events";

type ActionResult = { success: boolean; message: string };

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  const raw = value?.toString().trim();
  if (!raw) {
    return null;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createSellerProductRequestAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 상품 등록을 요청할 수 있어요." };
  }

  const productName = formData.get("productName")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const categoryId = formData.get("categoryId")?.toString().trim() || null;
  const imageUrlsRaw = formData.get("imageUrls")?.toString().trim() ?? "";
  const imageUrls = imageUrlsRaw
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const originalPrice = parseOptionalInt(formData.get("originalPrice"));
  const groupPrice = parseOptionalInt(formData.get("groupPrice"));
  const targetParticipants = parseOptionalInt(formData.get("targetParticipants"));
  const endsAtRaw = formData.get("endsAt")?.toString().trim();
  const endsAt = endsAtRaw ? `${endsAtRaw}T23:59:59.000Z` : null;

  if (!productName) {
    return { success: false, message: "상품명을 입력해 주세요." };
  }

  if (groupPrice == null || groupPrice <= 0) {
    return { success: false, message: "공동구매 판매가를 확인해 주세요." };
  }

  const result = await createSellerProductRequest({
    sellerId: seller.id,
    requestedBy: user.id,
    productName,
    categoryId,
    description,
    imageUrls,
    originalPrice,
    groupPrice,
    targetParticipants,
    endsAt,
  });

  if (!result.success) {
    if (result.error === "migration_required") {
      return {
        success: false,
        message: "상품 등록 요청 기능 준비 중이에요. migration 042 적용을 확인해 주세요.",
      };
    }
    return { success: false, message: "등록 요청에 실패했어요." };
  }

  await notifyAdminNewProductRequest({
    productName,
    productId: result.id ?? "new",
  });

  revalidatePath("/seller/products");
  revalidatePath("/seller/product-requests");
  return { success: true, message: "상품 등록 요청이 접수됐어요. 검수 결과는 알림으로 안내돼요." };
}
