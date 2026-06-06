import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type ProductQuestionItem = {
  id: string;
  content: string;
  adminReply: string | null;
  status: string;
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

export async function getProductQuestionsForDisplay(
  productId: string,
): Promise<ProductQuestionItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .select("id, content, admin_reply, status, created_at")
    .eq("type", "product")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[product-questions] list:", error.message);
    }
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    content: row.content as string,
    adminReply: (row.admin_reply as string | null) ?? null,
    status: row.status as string,
    createdAt: row.created_at as string,
    createdAtLabel: formatDateLabel(row.created_at as string),
  }));
}
