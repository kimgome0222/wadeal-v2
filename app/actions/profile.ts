"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import {
  getUserIdentityProfile,
  markUserPhoneVerified,
  updateUserIdentityProfile,
  updateUserPhoneWithVerification,
} from "@/lib/data/users";
import {
  getUserProfile,
  requestAccountWithdrawal,
  updateUserProfile,
} from "@/lib/data/profile";
import { isMockIdentityProviderEnabled } from "@/lib/identity/providers";
import { verifyPhoneMock } from "@/lib/identity/providers/mock";
import {
  issuePhoneVerificationCode,
  verifyPhoneVerificationCode,
} from "@/lib/identity/phone-verification";
import type { UpdateUserIdentityInput } from "@/lib/identity/types";
import type { UpdateUserProfileInput } from "@/lib/profile/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type UpdateProfileActionInput = UpdateUserIdentityInput & {
  phoneVerified?: boolean;
};

async function ensureProfile(user: NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await syncAuthUserToPublicProfile(user, supabase);
}

export async function updateProfileAction(input: UpdateProfileActionInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensureProfile(user);

  const result = await updateUserIdentityProfile(user.id, {
    realName: input.realName,
    phone: input.phone,
  });

  if (!result.success) {
    return result;
  }

  if (input.phoneVerified) {
    const verified = await markUserPhoneVerified(user.id);
    if (!verified.success) {
      return { success: false, error: "save_failed" as const };
    }
  }

  revalidatePath("/mypage/account");
  revalidatePath("/mypage/profile/edit");
  revalidatePath("/mypage/profile");
  revalidatePath("/mypage");
  revalidatePath("/checkout");

  return result;
}

export async function updateFullProfileAction(input: UpdateUserProfileInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensureProfile(user);

  const result = await updateUserProfile(user.id, input);

  if (result.success) {
    revalidatePath("/mypage/account");
    revalidatePath("/mypage/profile/edit");
    revalidatePath("/mypage/profile");
    revalidatePath("/mypage/settings");
    revalidatePath("/mypage");
    revalidatePath("/checkout");
  }

  return result;
}

export async function verifyPhoneAction() {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (!isMockIdentityProviderEnabled()) {
    return { success: false, error: "provider_unavailable" as const };
  }

  await ensureProfile(user);

  const profile = await getUserIdentityProfile(user.id);
  if (!profile?.phone) {
    return { success: false, error: "missing_phone" as const };
  }

  if (profile.phoneVerifiedAt) {
    return { success: false, error: "already_verified" as const };
  }

  const providerResult = await verifyPhoneMock(user.id, profile.phone);
  if (!providerResult.success) {
    return providerResult;
  }

  const saved = await markUserPhoneVerified(user.id);
  if (!saved.success) {
    return { success: false, error: "save_failed" as const };
  }

  revalidatePath("/mypage/account");
  revalidatePath("/mypage/profile/edit");
  revalidatePath("/mypage/profile");
  revalidatePath("/mypage");
  revalidatePath("/checkout");

  return { success: true as const };
}

export async function sendPhoneVerificationCodeAction(phone: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  await ensureProfile(user);

  const result = issuePhoneVerificationCode(user.id, phone);
  if (!result.success) {
    return { success: false as const, error: result.error ?? ("send_failed" as const) };
  }

  return {
    success: true as const,
    devCode: result.devCode,
  };
}

export async function verifyPhoneCodeAction(input: { phone: string; code: string }) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  await ensureProfile(user);

  const verification = verifyPhoneVerificationCode(user.id, input.phone, input.code);
  if (!verification.success) {
    return { success: false as const, error: verification.error ?? ("verify_failed" as const) };
  }

  const saved = await updateUserPhoneWithVerification(user.id, input.phone);
  if (!saved.success) {
    return { success: false as const, error: saved.error ?? ("save_failed" as const) };
  }

  revalidatePath("/mypage/account");
  revalidatePath("/mypage/profile/edit");
  revalidatePath("/mypage/profile");
  revalidatePath("/mypage");
  revalidatePath("/checkout");

  return { success: true as const };
}

export async function getProfileAction() {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const, profile: null };
  }

  await ensureProfile(user);
  const profile = await getUserProfile(user.id, user);
  return { success: true as const, profile };
}

export async function requestWithdrawalAction() {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await requestAccountWithdrawal(user.id);

  if (result.success) {
    revalidatePath("/mypage/settings");
    revalidatePath("/mypage");
  }

  return result;
}
