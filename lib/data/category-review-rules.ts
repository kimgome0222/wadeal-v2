import type { CategorySlug } from "@/lib/categories";
import { getCategoryBySlug } from "@/lib/data/categories";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CategoryReviewRuleRecord = {
  id: string;
  categoryId: string;
  categorySlug: CategorySlug | null;
  ruleTitle: string;
  ruleDescription: string;
  requiredDocuments: string[];
  warningKeywords: string[];
  isActive: boolean;
};

const FALLBACK_RULES: Record<
  Exclude<CategorySlug, "all" | "closing-soon">,
  Omit<CategoryReviewRuleRecord, "id" | "categoryId" | "categorySlug" | "isActive">
> = {
  food: {
    ruleTitle: "식품 표시사항",
    ruleDescription: "원산지, 유통기한, 보관방법, 영양/알레르기 표시사항을 확인합니다.",
    requiredDocuments: ["원산지 증빙", "유통기한 표시"],
    warningKeywords: ["치료", "완치", "의약", "100% 효과"],
  },
  beauty: {
    ruleTitle: "화장품 표시·광고",
    ruleDescription: "기능성 문구, 전성분, 사용법 표시를 확인합니다.",
    requiredDocuments: ["전성분 표시"],
    warningKeywords: ["치료", "완치", "주름 제거"],
  },
  living: {
    ruleTitle: "생활용품 안전",
    ruleDescription: "KC 인증 필요 여부, 사용 연령, 안전 주의사항을 확인합니다.",
    requiredDocuments: ["KC 인증서(해당 시)"],
    warningKeywords: ["100% 효과"],
  },
  digital: {
    ruleTitle: "전자·가전 인증",
    ruleDescription: "KC/전파인증, A/S 안내, 정품 여부를 확인합니다.",
    requiredDocuments: ["KC 인증서", "A/S 안내"],
    warningKeywords: ["정품 보장"],
  },
  baby: {
    ruleTitle: "유아·아동 안전",
    ruleDescription: "KC 안전인증, 연령 표시, 소재 정보를 확인합니다.",
    requiredDocuments: ["KC 안전인증"],
    warningKeywords: ["무조건 안전"],
  },
  pet: {
    ruleTitle: "반려동물용품",
    ruleDescription: "사료/간식 원료·유통기한, 사용 대상 표시를 확인합니다.",
    requiredDocuments: ["원료/성분 표시"],
    warningKeywords: ["치료"],
  },
  fashion: {
    ruleTitle: "패션·잡화",
    ruleDescription: "가품/상표권, 소재·세탁 표시를 확인합니다.",
    requiredDocuments: ["소재/세탁 표시"],
    warningKeywords: ["정품 보장", "명품"],
  },
  local: {
    ruleTitle: "지역특산물",
    ruleDescription: "원산지·생산자 정보, 유통기한/보관방법을 확인합니다.",
    requiredDocuments: ["원산지 증빙", "생산자 정보"],
    warningKeywords: ["100% 국산"],
  },
};

function mapRuleRow(row: Record<string, unknown>): CategoryReviewRuleRecord {
  const category = row.categories as { slug?: string } | null | undefined;
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    categorySlug: (category?.slug as CategorySlug | undefined) ?? null,
    ruleTitle: row.rule_title as string,
    ruleDescription: row.rule_description as string,
    requiredDocuments: (row.required_documents as string[] | null) ?? [],
    warningKeywords: (row.warning_keywords as string[] | null) ?? [],
    isActive: Boolean(row.is_active ?? true),
  };
}

function fallbackRulesForSlug(slug: CategorySlug): CategoryReviewRuleRecord[] {
  if (slug === "all" || slug === "closing-soon") {
    return [];
  }

  const rule = FALLBACK_RULES[slug];
  if (!rule) {
    return [];
  }

  return [
    {
      id: `fallback-${slug}`,
      categoryId: `fallback-${slug}`,
      categorySlug: slug,
      isActive: true,
      ...rule,
    },
  ];
}

export async function getCategoryReviewRulesBySlug(
  slug: CategorySlug | string | null | undefined,
): Promise<CategoryReviewRuleRecord[]> {
  if (!slug || slug === "all" || slug === "closing-soon") {
    return [];
  }

  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? fallbackRulesForSlug(slug as CategorySlug) : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? fallbackRulesForSlug(slug as CategorySlug) : [];
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return fallbackRulesForSlug(slug as CategorySlug);
  }

  const { data, error } = await supabase
    .from("category_review_rules")
    .select(
      "id, category_id, rule_title, rule_description, required_documents, warning_keywords, is_active, categories(slug)",
    )
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("[category-review-rules] getCategoryReviewRulesBySlug:", error.message);
    }
    return fallbackRulesForSlug(slug as CategorySlug);
  }

  return (data as Record<string, unknown>[]).map(mapRuleRow);
}

export async function getProductCategorySlug(productId: string): Promise<CategorySlug | null> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? "food" : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? "food" : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("category, category_id, categories(slug)")
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[category-review-rules] getProductCategorySlug:", error.message);
    }
    return shouldUseMockData() ? "food" : null;
  }

  const row = data as {
    category?: string | null;
    categories?: { slug?: string } | null;
  };

  const slug = row.categories?.slug ?? row.category ?? null;
  if (!slug || slug === "all" || slug === "closing-soon") {
    return slug === "all" || slug === "closing-soon" ? null : (slug as CategorySlug);
  }

  return slug as CategorySlug;
}
