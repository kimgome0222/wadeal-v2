"use server";

import { revalidatePath } from "next/cache";

import { isPhoneVerificationRequiredForSellerApply } from "@/lib/auth/identity-guards";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getCheckoutIdentityGuardForUser } from "@/lib/data/users";
import { createSellerApplication } from "@/lib/data/sellers";
import type { SellerApplicationInput } from "@/lib/sellers/types";

export async function submitSellerApplicationAction(input: SellerApplicationInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  if (isPhoneVerificationRequiredForSellerApply()) {
    const identityGuard = await getCheckoutIdentityGuardForUser(user.id, {
      hasAddress: true,
    });
    if (!identityGuard.ok && identityGuard.reason === "phone_not_verified") {
      return { success: false as const, error: "phone_not_verified" as const };
    }
  }

  const result = await createSellerApplication(user.id, input);

  if (result.success) {
    revalidatePath("/seller");
    revalidatePath("/seller/settings");
    revalidatePath("/seller/apply");
    revalidatePath("/seller/pending");
    revalidatePath("/seller/rejected");
    revalidatePath("/admin/sellers");
  }

  return result;
}
