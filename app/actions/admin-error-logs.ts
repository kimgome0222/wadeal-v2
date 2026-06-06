"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { resolveErrorLog } from "@/lib/monitoring/error-log";

export type ResolveErrorLogActionResult = {
  success: boolean;
  message: string;
};

export async function resolveErrorLogAction(logId: string): Promise<ResolveErrorLogActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  if (!(await isAdminUser(user))) {
    return { success: false, message: "관리자만 처리할 수 있어요." };
  }

  const trimmedId = logId.trim();
  if (!trimmedId) {
    return { success: false, message: "로그 ID가 없어요." };
  }

  const result = await resolveErrorLog(trimmedId, user.id);

  if (!result.success) {
    const message =
      result.error === "not_found" ? "이미 해결됐거나 로그를 찾을 수 없어요." : "해결 처리에 실패했어요.";
    return { success: false, message };
  }

  revalidatePath("/admin/error-logs");
  revalidatePath("/admin/dashboard");

  return { success: true, message: "해결 처리했어요." };
}
