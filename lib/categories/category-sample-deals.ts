import type { CategorySlug } from "@/lib/categories";
import {
  dealMatchesSubCategory,
  getSubCategory,
} from "@/lib/categories/catalog";
import type { Deal } from "@/lib/deals";

export type CategorySampleItem = Pick<Deal, "id" | "slug" | "title" | "imageUrl">;

const FALLBACK_TITLES: Partial<Record<CategorySlug, string[]>> = {
  food: ["감귤", "한우", "유기농 샐러드", "생수", "커피", "간편식"],
  living: ["물티슈", "세제", "수납함", "타월", "캡슐세제", "휴지"],
  beauty: ["스킨케어 세트", "핸드크림", "선크림", "립밤", "클렌저", "마스크팩"],
  fashion: ["티셔츠", "에코백", "양말", "모자", "가디건", "운동화"],
  pet: ["강아지 사료", "고양이 모래", "간식", "장난감", "펫타월", "하우스"],
  digital: ["무선 이어폰", "충전기", "키보드", "마우스", "보조배터리", "케이블"],
  baby: ["기저귀", "물티슈", "이유식", "수유병", "아기 로션", "유모차 패드"],
  local: ["감귤", "한우", "전복", "사과", "김치", "선물세트"],
};

function toSample(deal: Deal): CategorySampleItem {
  return {
    id: deal.id,
    slug: deal.slug,
    title: deal.title,
    imageUrl: deal.imageUrl,
  };
}

function categoryPool(catalog: Deal[], slug: CategorySlug): Deal[] {
  const matched = catalog.filter((deal) => deal.categoryTags.includes(slug));
  return matched.length > 0 ? matched : catalog;
}

function uniquePush(
  target: CategorySampleItem[],
  seen: Set<string>,
  deal: Deal,
  limit: number,
  titleOverride?: string,
) {
  if (target.length >= limit || seen.has(deal.slug)) {
    return;
  }

  seen.add(deal.slug);
  target.push({
    ...toSample(deal),
    title: titleOverride ?? deal.title,
  });
}

/** 카테고리·하위 카테고리별 샘플 상품 6개 (catalog 재사용, DB 변경 없음) */
function sortSamplePool(deals: Deal[], sort: string | null | undefined): Deal[] {
  const pool = [...deals];

  switch (sort) {
    case "rating":
    case "reviews":
      return pool.sort((a, b) => b.participants - a.participants);
    case "price-asc":
      return pool.sort((a, b) => a.groupPrice - b.groupPrice);
    case "price-desc":
      return pool.sort((a, b) => b.groupPrice - a.groupPrice);
    case "newest":
      return pool.sort((a, b) => b.id - a.id);
    default:
      return pool;
  }
}

export function getCategorySampleItems(
  catalog: Deal[],
  categorySlug: CategorySlug,
  subSlug?: string | null,
  limit = 6,
  sort?: string | null,
): CategorySampleItem[] {
  if (catalog.length === 0) {
    return [];
  }

  const pool = categoryPool(catalog, categorySlug);
  let matched = pool;

  if (subSlug) {
    const sub = getSubCategory(categorySlug, subSlug);
    if (sub) {
      const subMatched = pool.filter((deal) => dealMatchesSubCategory(deal, sub));
      if (subMatched.length > 0) {
        matched = subMatched;
      }
    }
  }

  matched = sortSamplePool(matched, sort);

  const picked: CategorySampleItem[] = [];
  const seen = new Set<string>();

  for (const deal of matched) {
    uniquePush(picked, seen, deal, limit);
  }

  for (const deal of pool) {
    uniquePush(picked, seen, deal, limit);
  }

  for (const deal of catalog) {
    uniquePush(picked, seen, deal, limit);
  }

  const fallbacks = FALLBACK_TITLES[categorySlug] ?? [];
  const linkPool = picked.length > 0 ? picked : catalog.map(toSample);
  let fallbackIndex = 0;

  while (picked.length < limit && fallbacks.length > 0) {
    const source = linkPool[picked.length % linkPool.length] ?? catalog[0]!;
    const title = fallbacks[fallbackIndex % fallbacks.length] ?? `추천 상품 ${picked.length + 1}`;
    fallbackIndex += 1;

    if (picked.some((item) => item.slug === source.slug && item.title === title)) {
      continue;
    }

    picked.push({
      id: source.id,
      slug: source.slug,
      title,
      imageUrl: source.imageUrl,
    });
  }

  return picked.slice(0, limit);
}
