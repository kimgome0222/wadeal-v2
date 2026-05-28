"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getAdminReviewById,
  updateAdminReviewStatus,
  type AdminReviewFilter,
} from "@/lib/data/admin-reviews";
import type { ReviewModerationStatus } from "@/lib/reviews/rating-utils";

function reviewLogSnapshot(
  review: Awaited<ReturnType<typeof getAdminReviewById>>,
) {
  if (!review) {
    return null;
  }

  return {
    reviewId: review.id,
    productId: review.productId,
    productName: review.productName,
    status: review.status,
    rating: review.rating,
  };
}

function resolveReviewAction(status: ReviewModerationStatus) {
  if (status === "hidden") {
    return ADMIN_ACTIONS.REVIEW_HIDE;
  }
  if (status === "deleted") {
    return ADMIN_ACTIONS.REVIEW_DELETE;
  }
  return null;
}

export async function updateAdminReviewStatusAction(
  reviewId: string,
  status: ReviewModerationStatus,
) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  const action = resolveReviewAction(status);
  const before = action ? await getAdminReviewById(reviewId) : null;
  const result = await updateAdminReviewStatus(reviewId, status);

  if (result.success && action) {
    const after = await getAdminReviewById(reviewId);
    await logAdminAction({
      adminUserId: user.id,
      action,
      targetType: ADMIN_TARGET_TYPES.REVIEW,
      targetId: reviewId,
      beforeData: reviewLogSnapshot(before),
      afterData: reviewLogSnapshot(after),
    });
  }

  if (result.success) {
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/review-reports");
    revalidatePath("/product/[id]", "page");
  }

  return result;
}

export type { AdminReviewFilter };
