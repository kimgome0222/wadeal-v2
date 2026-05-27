import type { CategorySlug } from "@/lib/categories";

export type DealSectionCategory = "main" | "closing" | "rising" | "food" | "daily";

export type Deal = {
  id: number;
  slug: string;
  title: string;
  section: DealSectionCategory;
  categoryTags: CategorySlug[];
  imageUrl: string;
  originalPrice: number;
  groupPrice: number;
  lowestPrice: number;
  participants: number;
  targetParticipants: number;
  endsIn: string;
  endsInMinutes: number;
  badge: string;
  saved?: boolean;
};

export const deals: Deal[] = [
  {
    id: 1,
    slug: "wd-citrus-001",
    title: "제주 고당도 감귤 3kg",
    section: "main",
    categoryTags: ["all", "food", "closing-soon"],
    imageUrl:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
    originalPrice: 22900,
    groupPrice: 12900,
    lowestPrice: 10900,
    participants: 118,
    targetParticipants: 120,
    endsIn: "02:18",
    endsInMinutes: 138,
    badge: "마감임박",
    saved: true,
  },
  {
    id: 2,
    slug: "wd-beef-001",
    title: "한우 불고기 냉장팩 600g",
    section: "main",
    categoryTags: ["all", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=600&q=80",
    originalPrice: 39800,
    groupPrice: 24900,
    lowestPrice: 21900,
    participants: 78,
    targetParticipants: 80,
    endsIn: "04:52",
    endsInMinutes: 292,
    badge: "인기",
    saved: true,
  },
  {
    id: 3,
    slug: "wd-vacuum-001",
    title: "초경량 무선 청소기",
    section: "main",
    categoryTags: ["all", "digital", "living"],
    imageUrl:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    originalPrice: 129000,
    groupPrice: 79900,
    lowestPrice: 74900,
    participants: 93,
    targetParticipants: 95,
    endsIn: "08:24",
    endsInMinutes: 504,
    badge: "인기",
    saved: true,
  },
  {
    id: 4,
    slug: "wd-coldbrew-001",
    title: "성수동 콜드브루 12병",
    section: "closing",
    categoryTags: ["all", "food", "closing-soon"],
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    originalPrice: 36000,
    groupPrice: 21900,
    lowestPrice: 19900,
    participants: 68,
    targetParticipants: 100,
    endsIn: "01:41",
    endsInMinutes: 101,
    badge: "마감임박",
  },
  {
    id: 5,
    slug: "wd-yogurt-001",
    title: "유기농 그릭요거트 8개",
    section: "closing",
    categoryTags: ["all", "food", "closing-soon"],
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    originalPrice: 28800,
    groupPrice: 16900,
    lowestPrice: 15900,
    participants: 54,
    targetParticipants: 60,
    endsIn: "01:35",
    endsInMinutes: 95,
    badge: "마감임박",
  },
  {
    id: 6,
    slug: "wd-towel-001",
    title: "순면 호텔 타월 10장",
    section: "rising",
    categoryTags: ["all", "living", "fashion"],
    imageUrl:
      "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=600&q=80",
    originalPrice: 45900,
    groupPrice: 26900,
    lowestPrice: 24900,
    participants: 147,
    targetParticipants: 160,
    endsIn: "05:09",
    endsInMinutes: 309,
    badge: "급상승",
    saved: true,
  },
  {
    id: 7,
    slug: "wd-abalone-001",
    title: "완도 활전복 1kg",
    section: "food",
    categoryTags: ["all", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80",
    originalPrice: 59800,
    groupPrice: 39900,
    lowestPrice: 36900,
    participants: 71,
    targetParticipants: 90,
    endsIn: "13:18",
    endsInMinutes: 798,
    badge: "인기",
  },
  {
    id: 8,
    slug: "wd-grape-001",
    title: "국산 샤인머스캣 2송이",
    section: "food",
    categoryTags: ["all", "food", "closing-soon"],
    imageUrl:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80",
    originalPrice: 32800,
    groupPrice: 21900,
    lowestPrice: 19900,
    participants: 43,
    targetParticipants: 55,
    endsIn: "06:44",
    endsInMinutes: 404,
    badge: "마감임박",
  },
  {
    id: 9,
    slug: "wd-detergent-001",
    title: "주방 세제 리필 4팩",
    section: "daily",
    categoryTags: ["all", "living"],
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    originalPrice: 23900,
    groupPrice: 13900,
    lowestPrice: 12900,
    participants: 82,
    targetParticipants: 100,
    endsIn: "09:27",
    endsInMinutes: 567,
    badge: "인기",
  },
  {
    id: 10,
    slug: "wd-laundry-001",
    title: "프리미엄 세탁 캡슐 60개",
    section: "daily",
    categoryTags: ["all", "living"],
    imageUrl:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=600&q=80",
    originalPrice: 34900,
    groupPrice: 21900,
    lowestPrice: 19900,
    participants: 128,
    targetParticipants: 150,
    endsIn: "12:03",
    endsInMinutes: 723,
    badge: "인기",
  },
  {
    id: 11,
    slug: "wd-wipes-001",
    title: "대용량 물티슈 20팩",
    section: "main",
    categoryTags: ["all", "living", "pet"],
    imageUrl:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80",
    originalPrice: 31900,
    groupPrice: 17900,
    lowestPrice: 15900,
    participants: 198,
    targetParticipants: 200,
    endsIn: "07:05",
    endsInMinutes: 425,
    badge: "급상승",
  },
  {
    id: 12,
    slug: "wd-earbuds-001",
    title: "노이즈캔슬링 무선 이어폰",
    section: "rising",
    categoryTags: ["all", "digital"],
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    originalPrice: 189000,
    groupPrice: 119000,
    lowestPrice: 109000,
    participants: 201,
    targetParticipants: 220,
    endsIn: "10:12",
    endsInMinutes: 612,
    badge: "인기",
    saved: true,
  },
  {
    id: 13,
    slug: "wd-hoodie-001",
    title: "오버핏 기모 후디",
    section: "rising",
    categoryTags: ["all", "fashion"],
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    originalPrice: 69000,
    groupPrice: 39900,
    lowestPrice: 35900,
    participants: 88,
    targetParticipants: 100,
    endsIn: "14:20",
    endsInMinutes: 860,
    badge: "급상승",
  },
  {
    id: 14,
    slug: "wd-serum-001",
    title: "히알루론 수분 세럼 2개",
    section: "rising",
    categoryTags: ["all", "beauty"],
    imageUrl:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
    originalPrice: 52000,
    groupPrice: 32900,
    lowestPrice: 29900,
    participants: 62,
    targetParticipants: 80,
    endsIn: "03:48",
    endsInMinutes: 228,
    badge: "인기",
    saved: true,
  },
  {
    id: 15,
    slug: "wd-dogfood-001",
    title: "저알러지 강아지 사료 5kg",
    section: "daily",
    categoryTags: ["all", "pet"],
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    originalPrice: 48000,
    groupPrice: 31900,
    lowestPrice: 28900,
    participants: 95,
    targetParticipants: 110,
    endsIn: "16:05",
    endsInMinutes: 965,
    badge: "인기",
  },
  {
    id: 16,
    slug: "wd-lipstick-001",
    title: "벨벳 립스틱 3종 세트",
    section: "closing",
    categoryTags: ["all", "beauty", "closing-soon"],
    imageUrl:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    originalPrice: 42000,
    groupPrice: 25900,
    lowestPrice: 23900,
    participants: 37,
    targetParticipants: 50,
    endsIn: "00:52",
    endsInMinutes: 52,
    badge: "마감임박",
  },
];

export const currency = new Intl.NumberFormat("ko-KR");

export function getDealDiscount(deal: Deal) {
  return Math.round(
    ((deal.originalPrice - deal.groupPrice) / deal.originalPrice) * 100,
  );
}

export function getDealRemaining(deal: Deal) {
  return Math.max(0, deal.targetParticipants - deal.participants);
}

export function getDealById(id: string) {
  return deals.find((deal) => deal.slug === id || deal.id.toString() === id);
}

export function getDealsBySection(section: DealSectionCategory) {
  return deals.filter((deal) => deal.section === section);
}

export function getDealsByCategorySlug(slug: CategorySlug) {
  if (slug === "all") {
    return [...deals];
  }
  return deals.filter((deal) => deal.categoryTags.includes(slug));
}

export function getSavedDeals() {
  return deals.filter((deal) => deal.saved);
}

export type SortTab = "popular" | "closing" | "discount";

export function sortDeals(list: Deal[], sort: SortTab) {
  const sorted = [...list];
  if (sort === "popular") {
    return sorted.sort((a, b) => b.participants - a.participants);
  }
  if (sort === "closing") {
    return sorted.sort((a, b) => a.endsInMinutes - b.endsInMinutes);
  }
  return sorted.sort((a, b) => getDealDiscount(b) - getDealDiscount(a));
}

/** @deprecated Use getDealsBySection */
export function getDealsByCategory(category: DealSectionCategory) {
  return getDealsBySection(category);
}
