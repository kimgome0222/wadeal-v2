"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getBusinessSettings, updateBusinessSettings, parseBusinessSettingsForm, type BusinessSettingsFormInput } from "@/lib/data/business-settings";

type AdminBusinessSettingsActionResult = {
  success: boolean;
  error?: "login_required" | "forbidden" | "invalid_input" | "save_failed";
};

async function ensureAdmin(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: AdminBusinessSettingsActionResult["error"] }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, error: "login_required" };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true, userId: user.id };
}

function revalidateBusinessSettingsPaths() {
  revalidatePath("/admin/settings/business");
  revalidatePath("/");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/refund-policy");
  revalidatePath("/commerce-policy");
  revalidatePath("/support");
  revalidatePath("/login");
}

function businessSettingsLogSnapshot(settings: Awaited<ReturnType<typeof getBusinessSettings>>) {
  return {
    id: settings.id,
    businessName: settings.businessName,
    representativeName: settings.representativeName,
    businessNumber: settings.businessNumber,
    mailOrderSalesNumber: settings.mailOrderSalesNumber,
    businessAddress: settings.businessAddress,
    customerServicePhone: settings.customerServicePhone,
    customerServiceEmail: settings.customerServiceEmail,
    customerServiceHours: settings.customerServiceHours,
    hostingProvider: settings.hostingProvider,
    privacyManagerName: settings.privacyManagerName,
    privacyManagerEmail: settings.privacyManagerEmail,
    bankAccountInfo: settings.bankAccountInfo,
  };
}

export async function updateAdminBusinessSettingsAction(
  raw: Partial<BusinessSettingsFormInput>,
): Promise<AdminBusinessSettingsActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const parsed = parseBusinessSettingsForm(raw);
  if (!parsed.ok) {
    return { success: false, error: "invalid_input" };
  }

  const before = await getBusinessSettings();
  const result = await updateBusinessSettings(parsed.input);
  if (!result.success) {
    return { success: false, error: result.error ?? "save_failed" };
  }

  await logAdminAction({
    adminUserId: auth.userId,
    action: ADMIN_ACTIONS.BUSINESS_SETTINGS_UPDATE,
    targetType: ADMIN_TARGET_TYPES.BUSINESS_SETTINGS,
    targetId: String(result.settings?.id ?? before.id ?? 1),
    beforeData: businessSettingsLogSnapshot(before),
    afterData: businessSettingsLogSnapshot(result.settings ?? before),
  });

  revalidateBusinessSettingsPaths();
  return { success: true };
}
