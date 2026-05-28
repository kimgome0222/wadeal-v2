import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cache } from "react";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerByUserId, type SellerRecord } from "@/lib/data/sellers";
import type { UserRole } from "@/lib/database/types";
import {
  getSellerStatusLabel,
  isSellerApproved,
  type SellerStatus,
} from "@/lib/sellers/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AccessContext = {
  user: User;
  role: UserRole;
  isAdmin: boolean;
  isSellerRole: boolean;
  seller: SellerRecord | null;
  sellerStatus: SellerStatus | null;
  canAccessSellerCenter: boolean;
  canAccessAdminCenter: boolean;
};

export const getCurrentUser = getServerAuthUser;

export async function getCurrentUserRole(userId: string): Promise<UserRole> {
  if (!isSupabaseConfigured()) {
    return "user";
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return "user";
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[auth] getCurrentUserRole:", error.message);
    return "user";
  }

  const role = (data as { role?: string } | null)?.role;
  if (role === "admin" || role === "seller" || role === "user") {
    return role;
  }

  return "user";
}

export const getAccessContext = cache(async (): Promise<AccessContext | null> => {
  const user = await getServerAuthUser();
  if (!user) {
    return null;
  }

  const [role, isAdmin, seller] = await Promise.all([
    getCurrentUserRole(user.id),
    isAdminUser(user),
    getSellerByUserId(user.id),
  ]);

  const effectiveRole: UserRole = isAdmin ? "admin" : role;
  const sellerStatus = seller?.status ?? null;
  const canAccessSellerCenter = isAdmin || (seller != null && isSellerApproved(seller.status));
  const canAccessAdminCenter = isAdmin;

  return {
    user,
    role: effectiveRole,
    isAdmin,
    isSellerRole: effectiveRole === "seller" || effectiveRole === "admin",
    seller,
    sellerStatus,
    canAccessSellerCenter,
    canAccessAdminCenter,
  };
});

export function getSellerStatus(context: AccessContext | null): SellerStatus | null {
  return context?.sellerStatus ?? null;
}

export async function requireLogin(nextPath?: string): Promise<User> {
  const user = await getServerAuthUser();
  if (!user) {
    const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${query}`);
  }

  return user;
}

export async function requireAdmin(nextPath = "/admin/dashboard"): Promise<AccessContext> {
  const context = await getAccessContext();
  if (!context) {
    redirect(
      `/login?redirect=${encodeURIComponent(nextPath)}&next=${encodeURIComponent(nextPath)}`,
    );
  }

  if (!context.canAccessAdminCenter) {
    redirect(`/unauthorized?next=${encodeURIComponent(nextPath)}`);
  }

  return context;
}

export async function requireSeller(): Promise<AccessContext> {
  const context = await getAccessContext();
  if (!context) {
    redirect("/login?next=/seller/dashboard");
  }

  if (context.isAdmin) {
    return context;
  }

  if (!context.seller) {
    redirect("/seller/apply");
  }

  return context;
}

export async function requireApprovedSeller(): Promise<AccessContext & { seller: SellerRecord }> {
  const context = await getAccessContext();
  if (!context) {
    redirect("/login?next=/seller/dashboard");
  }

  if (context.isAdmin) {
    return context as AccessContext & { seller: SellerRecord };
  }

  if (!context.seller) {
    redirect("/seller/apply");
  }

  if (context.seller.status === "rejected") {
    redirect("/seller/rejected");
  }

  if (context.seller.status === "suspended") {
    redirect("/seller/suspended");
  }

  if (
    context.seller.status === "pending_review" ||
    context.seller.status === "under_review"
  ) {
    redirect("/seller/pending");
  }

  if (!isSellerApproved(context.seller.status)) {
    redirect("/seller/pending");
  }

  return context as AccessContext & { seller: SellerRecord };
}

export function getSellerStatusRedirectPath(status: SellerStatus): string {
  switch (status) {
    case "approved":
      return "/seller/dashboard";
    case "rejected":
      return "/seller/rejected";
    case "suspended":
      return "/seller/suspended";
    case "under_review":
    case "pending_review":
    default:
      return "/seller/pending";
  }
}

export { getSellerStatusLabel };
