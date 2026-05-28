"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  deactivateSavedPaymentMethod,
  registerSavedPaymentMethod,
  setDefaultSavedPaymentMethod,
} from "@/lib/data/saved-payment-methods";
import { issueBillingKey, revokeBillingKey } from "@/lib/payments/toss/billing";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";

export async function issueBillingKeyAction(input: {
  authKey: string;
  cardCompany?: string;
  cardLast4?: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await syncAuthUserToPublicProfile(user, supabase);
  }

  const issueResult = await issueBillingKey({
    customerKey: user.id,
    authKey: input.authKey,
  });

  if (!issueResult.success || !issueResult.billingKey) {
    return {
      success: false as const,
      error: "issue_failed" as const,
      message: issueResult.error ?? "빌링키 발급에 실패했어요.",
    };
  }

  const registerResult = await registerSavedPaymentMethod({
    billingKey: issueResult.billingKey,
    cardCompany: input.cardCompany ?? issueResult.cardCompany ?? null,
    cardLast4: input.cardLast4 ?? issueResult.cardLast4 ?? "0000",
    setDefault: true,
  });

  if (!registerResult.success) {
    return {
      success: false as const,
      error: "save_failed" as const,
      message: registerResult.error ?? "결제수단 저장에 실패했어요.",
    };
  }

  revalidatePath("/mypage/payment");
  revalidatePath("/checkout/[id]", "page");

  return { success: true as const, id: registerResult.id };
}

export async function deactivateSavedPaymentMethodAction(methodId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  // Revoke at Toss is best-effort; billing key is server-only so we skip client-side fetch.
  await revokeBillingKey(`stub_revoke_${methodId}`);

  const result = await deactivateSavedPaymentMethod(user.id, methodId);
  if (!result.success) {
    return { success: false as const, error: "save_failed" as const };
  }

  revalidatePath("/mypage/payment");
  return { success: true as const };
}

export async function setDefaultSavedPaymentMethodAction(methodId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await setDefaultSavedPaymentMethod(user.id, methodId);
  if (!result.success) {
    return { success: false as const, error: "save_failed" as const };
  }

  revalidatePath("/mypage/payment");
  revalidatePath("/checkout/[id]", "page");
  return { success: true as const };
}

/** Dev/prototype card registration without Toss redirect. */
export async function registerMockBillingCardAction(input: {
  cardLast4: string;
  cardCompany?: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const issueResult = await issueBillingKey({
    customerKey: user.id,
    authKey: `mock_auth_${input.cardLast4}`,
  });

  if (!issueResult.success || !issueResult.billingKey) {
    return { success: false as const, error: "issue_failed" as const };
  }

  const registerResult = await registerSavedPaymentMethod({
    billingKey: issueResult.billingKey,
    cardCompany: input.cardCompany ?? issueResult.cardCompany ?? "등록 카드",
    cardLast4: input.cardLast4,
    setDefault: true,
  });

  if (!registerResult.success) {
    return { success: false as const, error: "save_failed" as const };
  }

  revalidatePath("/mypage/payment");
  revalidatePath("/checkout/[id]", "page");
  return { success: true as const, id: registerResult.id };
}
