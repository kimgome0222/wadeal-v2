"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { createSellerApplication } from "@/lib/data/sellers";
import type { SellerApplicationInput } from "@/lib/sellers/types";

export async function submitSellerApplicationAction(input: SellerApplicationInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
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
