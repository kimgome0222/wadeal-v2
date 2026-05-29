"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveUserConsentsAction } from "@/app/actions/consents";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import {
  findUsernameByVerifiedIdentity,
  isUsernameAvailable,
  resolveUserIdByUsername,
} from "@/lib/auth/usernames";
import {
  getPasswordValidationMessage,
  getUsernameValidationMessage,
  maskUsername,
  normalizeUsername,
  usernameToAuthEmail,
  validatePassword,
  validateUsername,
} from "@/lib/auth/credentials";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function checkUsernameAvailabilityAction(username: string) {
  const result = await isUsernameAvailable(username);
  if (result.error === "invalid") {
    const validation = validateUsername(username);
    return {
      available: false as const,
      message: getUsernameValidationMessage(validation),
    };
  }
  if (result.error === "check_failed") {
    return {
      available: false as const,
      message: "아이디 확인을 할 수 없어요. Supabase 연결을 확인해 주세요.",
    };
  }
  return {
    available: result.available,
    message: result.available ? "사용 가능한 아이디예요." : "이미 사용 중인 아이디예요.",
  };
}

export async function signUpWithUsernameAction(input: {
  username: string;
  password: string;
  confirmPassword: string;
  realName: string;
  phoneVerified: boolean;
  consents: {
    terms: boolean;
    privacy: boolean;
    groupbuy: boolean;
    marketing: boolean;
  };
}) {
  const usernameValidation = validateUsername(input.username);
  if (!usernameValidation.valid) {
    return { success: false as const, error: "invalid_username" as const };
  }

  if (!input.realName.trim()) {
    return { success: false as const, error: "invalid_name" as const };
  }

  if (!input.phoneVerified) {
    return { success: false as const, error: "phone_not_verified" as const };
  }

  if (!input.consents.terms || !input.consents.privacy || !input.consents.groupbuy) {
    return { success: false as const, error: "consent_required" as const };
  }

  const passwordValidation = validatePassword(input.password, input.username);
  if (!passwordValidation.valid) {
    return { success: false as const, error: "invalid_password" as const };
  }

  if (input.password !== input.confirmPassword) {
    return { success: false as const, error: "password_mismatch" as const };
  }

  const availability = await isUsernameAvailable(input.username);
  if (!availability.available) {
    return { success: false as const, error: "username_taken" as const };
  }

  if (!isSupabaseConfigured()) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const normalizedUsername = normalizeUsername(input.username);
  const email = usernameToAuthEmail(normalizedUsername);

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        preferred_username: normalizedUsername,
        real_name: input.realName.trim(),
        signup_method: "username",
      },
    },
  });

  if (error || !data.user) {
    if (process.env.NODE_ENV === "development") {
      console.error("[signup]", error?.message);
    }
    return { success: false as const, error: "signup_failed" as const };
  }

  await syncAuthUserToPublicProfile(data.user, supabase);

  const { error: usernameError } = await supabase.from("profile_usernames").insert({
    user_id: data.user.id,
    username: normalizedUsername,
  });

  if (usernameError && process.env.NODE_ENV === "development") {
    console.warn("[signup] profile_usernames:", usernameError.message);
  }

  await saveUserConsentsAction({
    terms: input.consents.terms,
    privacy: input.consents.privacy,
    groupbuy: input.consents.groupbuy,
    marketing: input.consents.marketing,
  });

  revalidatePath("/mypage");
  return { success: true as const };
}

export async function signInWithUsernameAction(input: {
  username: string;
  password: string;
}) {
  const usernameValidation = validateUsername(input.username);
  if (!usernameValidation.valid) {
    return { success: false as const, error: "invalid_credentials" as const };
  }

  if (!input.password.trim()) {
    return { success: false as const, error: "invalid_credentials" as const };
  }

  if (!isSupabaseConfigured()) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const email = usernameToAuthEmail(input.username);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    return { success: false as const, error: "invalid_credentials" as const };
  }

  revalidatePath("/");
  revalidatePath("/mypage");
  return { success: true as const };
}

export async function findUsernameAction(input: {
  realName: string;
  phone: string;
  phoneVerified: boolean;
}) {
  if (!input.phoneVerified) {
    return { success: false as const, error: "phone_not_verified" as const };
  }

  const result = await findUsernameByVerifiedIdentity({
    realName: input.realName,
    phone: input.phone,
  });

  if ("error" in result) {
    return { success: false as const, error: result.error };
  }

  return {
    success: true as const,
    usernames: result.usernames.map((username) => maskUsername(username)),
  };
}

export async function requestPasswordResetAction(input: {
  username: string;
  phoneVerified: boolean;
}) {
  const usernameValidation = validateUsername(input.username);
  if (!usernameValidation.valid) {
    return { success: false as const, error: "invalid_username" as const };
  }

  if (!input.phoneVerified) {
    return { success: false as const, error: "phone_not_verified" as const };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true as const,
      message: "비밀번호 재설정 링크 발송 준비 중이에요. Supabase Auth 설정 후 활성화됩니다.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const userId = await resolveUserIdByUsername(input.username);
  if (!userId) {
    return { success: false as const, error: "user_not_found" as const };
  }

  const email = usernameToAuthEmail(input.username);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { success: false as const, error: "reset_failed" as const };
  }

  return {
    success: true as const,
    message: "비밀번호 재설정 안내를 발송했어요. 이메일을 확인해 주세요.",
  };
}

export async function resetPasswordAction(input: {
  password: string;
  confirmPassword: string;
  username?: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const passwordValidation = validatePassword(input.password, input.username);
  if (!passwordValidation.valid) {
    return {
      success: false as const,
      error: "invalid_password" as const,
      message: getPasswordValidationMessage(passwordValidation),
    };
  }

  if (input.password !== input.confirmPassword) {
    return { success: false as const, error: "password_mismatch" as const };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false as const, error: "provider_unavailable" as const };
  }

  const { error } = await supabase.auth.updateUser({ password: input.password });
  if (error) {
    return { success: false as const, error: "update_failed" as const };
  }

  revalidatePath("/mypage/settings");
  return { success: true as const };
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/");
  redirect("/login");
}
