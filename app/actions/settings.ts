"use server";

import { revalidatePath } from "next/cache";

import { isSocialAuthUser } from "@/lib/auth/server-session";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (isSocialAuthUser(user)) {
    return { success: false, error: "social_account" as const };
  }

  const currentPassword = input.currentPassword.trim();
  const newPassword = input.newPassword.trim();
  const confirmPassword = input.confirmPassword.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "missing_fields" as const };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "password_too_short" as const };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "password_mismatch" as const };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase || !user.email) {
    return { success: false, error: "provider_unavailable" as const };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: "invalid_current_password" as const };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: "update_failed" as const };
  }

  revalidatePath("/mypage/settings");
  return { success: true as const };
}
