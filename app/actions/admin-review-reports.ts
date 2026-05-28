"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { resolveReviewReport } from "@/lib/data/review-reports";

export async function resolveReviewReportAction(reportId: string) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  const result = await resolveReviewReport(reportId);

  if (result.success) {
    await logAdminAction({
      adminUserId: user.id,
      action: ADMIN_ACTIONS.REVIEW_REPORT_RESOLVE,
      targetType: ADMIN_TARGET_TYPES.REVIEW,
      targetId: result.reviewId ?? reportId,
      afterData: {
        reportId,
        reviewId: result.reviewId ?? null,
        status: "resolved",
      },
    });

    revalidatePath("/admin/review-reports");
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/dashboard");
  }

  return result;
}
