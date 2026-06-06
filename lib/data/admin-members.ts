import type { AccountStatus, UserRole } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type AdminMemberRow = {
  id: string;
  email: string | null;
  nickname: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  phone: string | null;
  createdAt: string;
  createdAtLabel: string;
};

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const roleLabel: Record<UserRole, string> = {
  user: "구매자",
  seller: "판매자",
  admin: "관리자",
};

const accountStatusLabel: Record<AccountStatus, string> = {
  active: "정상",
  withdrawal_requested: "탈퇴 요청",
  withdrawn: "탈퇴",
  suspended: "정지",
};

export function getAdminMemberRoleLabel(role: UserRole): string {
  return roleLabel[role] ?? role;
}

export function getAdminMemberAccountStatusLabel(status: AccountStatus): string {
  return accountStatusLabel[status] ?? status;
}

export async function getAdminMembers(options?: {
  limit?: number;
  query?: string;
}): Promise<AdminMemberRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const limit = options?.limit ?? 100;
  const query = options?.query?.trim().toLowerCase() ?? "";

  let request = supabase
    .from("users")
    .select("id, email, nickname, role, account_status, phone, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (query) {
    request = request.or(
      `email.ilike.%${query}%,nickname.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  const { data, error } = await request;

  if (error) {
    console.error("[admin-members] list:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: (row.email as string | null) ?? null,
    nickname: (row.nickname as string | null) ?? null,
    role: row.role as UserRole,
    accountStatus: row.account_status as AccountStatus,
    phone: (row.phone as string | null) ?? null,
    createdAt: row.created_at as string,
    createdAtLabel: formatDateLabel(row.created_at as string),
  }));
}

export async function countAdminMembers(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  if (error) {
    return 0;
  }

  return count ?? 0;
}
