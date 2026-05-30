import type { CategorySlug } from "@/lib/categories";

/** 하위 카테고리 칩/카드용 이모지 (정적 UI) */
export const SUBCATEGORY_GLYPHS: Record<string, string> = {
  "food-fresh": "🥬",
  "food-processed": "🍜",
  "food-health": "💊",
  "food-drink": "☕",
  "living-kitchen": "🍳",
  "living-bath": "🛁",
  "living-clean": "🧹",
  "living-storage": "📦",
  "beauty-skincare": "🧴",
  "beauty-makeup": "💄",
  "beauty-hair": "💇",
  "beauty-body": "🧼",
  "digital-appliance": "🔌",
  "digital-kitchen": "🍲",
  "digital-it": "🎧",
  "digital-mobile": "📱",
  "fashion-women": "👗",
  "fashion-men": "👔",
  "fashion-acc": "👜",
  "fashion-inner": "🧦",
  "pet-food": "🦴",
  "pet-supplies": "🎾",
  "pet-groom": "🛁",
  "baby-diaper": "🍼",
  "baby-feed": "🥣",
  "baby-care": "🧸",
  "local-fruit": "🍊",
  "local-meat": "🥩",
  "local-gift": "🎁",
};

export function getSubcategoryGlyph(subSlug: string, parentSlug?: CategorySlug): string {
  if (SUBCATEGORY_GLYPHS[subSlug]) {
    return SUBCATEGORY_GLYPHS[subSlug];
  }

  if (parentSlug === "food") return "🍽️";
  if (parentSlug === "living") return "🏠";
  if (parentSlug === "beauty") return "✨";
  if (parentSlug === "digital") return "📱";
  if (parentSlug === "fashion") return "👕";
  if (parentSlug === "pet") return "🐾";
  if (parentSlug === "baby") return "👶";
  if (parentSlug === "local") return "🌾";

  return "📦";
}
