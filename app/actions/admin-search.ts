"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  deleteFeaturedSearchTerm,
  saveFeaturedSearchTerm,
} from "@/lib/data/admin-search";

export async function saveFeaturedSearchTermAction(formData: FormData): Promise<void> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return;
  }

  const query = String(formData.get("query") ?? "");
  const displayOrder = Number(formData.get("displayOrder") ?? 0);
  const isActive = formData.get("isActive") === "on";

  const result = await saveFeaturedSearchTerm({
    query,
    displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    isActive,
  });

  if (result.success) {
    revalidatePath("/admin/search");
    revalidatePath("/search");
    revalidatePath("/");
  }
}

export async function deleteFeaturedSearchTermAction(formData: FormData): Promise<void> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return;
  }

  const id = String(formData.get("id") ?? "");
  const result = await deleteFeaturedSearchTerm(id);

  if (result.success) {
    revalidatePath("/admin/search");
    revalidatePath("/search");
    revalidatePath("/");
  }
}
