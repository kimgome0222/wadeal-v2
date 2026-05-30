"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CategoryChip, CategoryChipGrid } from "@/components/category-chip";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { categoryTitles, isCategorySlug, type CategorySlug } from "@/lib/categories";
import {
  buildAllCategoryPanelViewModel,
  buildCategoryPanelViewModel,
} from "@/lib/categories/build-category-panel-view";
import {
  getCategoryDisplaySubcategories,
} from "@/lib/categories/category-display-subcategories";
import { getCategoryListingHref } from "@/lib/categories/catalog";
import type { Deal } from "@/lib/deals";

type LeftNavKey = CategorySlug | "all" | "events" | "seller-news";

type CategoriesSplitViewProps = {
  catalog: Deal[];
  initialCategory?: CategorySlug;
};

const LEFT_NAV_ITEMS: { key: LeftNavKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "food", label: "식품" },
  { key: "living", label: "생활" },
  { key: "beauty", label: "뷰티" },
  { key: "fashion", label: "패션" },
  { key: "digital", label: "디지털" },
  { key: "pet", label: "반려동물" },
  { key: "events", label: "기획전" },
  { key: "seller-news", label: "판매자소식" },
];

function parseLeftNavKey(value: string | null, fallback?: CategorySlug): LeftNavKey {
  if (value === "events" || value === "seller-news" || value === "all") {
    return value;
  }
  if (value && isCategorySlug(value)) {
    return value;
  }
  return fallback ?? "all";
}

export function CategoriesSplitView({ catalog, initialCategory }: CategoriesSplitViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategoryParam = searchParams.get("category");
  const urlCategory =
    urlCategoryParam && (isCategorySlug(urlCategoryParam) || urlCategoryParam === "events" || urlCategoryParam === "seller-news" || urlCategoryParam === "all")
      ? urlCategoryParam
      : null;

  const [selected, setSelected] = useState<LeftNavKey>(
    () => parseLeftNavKey(urlCategory, initialCategory ?? "all"),
  );
  const [activeSub, setActiveSub] = useState<string | null>(
    () => searchParams.get("sub"),
  );

  useEffect(() => {
    const catParam = searchParams.get("category");
    const subParam = searchParams.get("sub");

    if (catParam) {
      setSelected(parseLeftNavKey(catParam, initialCategory ?? "all"));
      setActiveSub(subParam);
      return;
    }

    if (!catParam && !subParam) {
      setActiveSub(null);
    }
  }, [searchParams, initialCategory]);

  const pushCategoriesQuery = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          continue;
        }
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();
      router.replace(query ? `/categories?${query}` : "/categories", { scroll: false });
    },
    [router, searchParams],
  );

  function selectCategory(slug: LeftNavKey) {
    setSelected(slug);
    setActiveSub(null);

    if (slug === "all") {
      pushCategoriesQuery({ category: null, sub: null });
      return;
    }

    if (slug === "events" || slug === "seller-news") {
      pushCategoriesQuery({ category: slug, sub: null });
      return;
    }

    pushCategoriesQuery({ category: slug, sub: null });
  }

  const panelView = useMemo(() => {
    if (selected === "all") {
      return buildAllCategoryPanelViewModel(catalog);
    }
    if (isCategorySlug(selected)) {
      return buildCategoryPanelViewModel(catalog, selected, activeSub);
    }
    return null;
  }, [catalog, selected, activeSub]);

  return (
    <div className="relative z-0 flex min-h-[calc(100vh-13rem)] overflow-x-hidden bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <nav
        aria-label="카테고리 목록"
        className="relative z-10 w-[28%] shrink-0 border-r border-[#E8ECEA] bg-[#F8F8F8]"
      >
        <ul>
          {LEFT_NAV_ITEMS.map((item) => {
            const active = selected === item.key;
            return (
              <li key={item.key}>
                <button
                  aria-pressed={active}
                  className={`relative z-10 flex w-full cursor-pointer items-center border-l-[3px] px-2 py-3.5 text-left text-[14px] font-medium leading-snug transition-colors ${
                    active ?
                      "border-[#2E5E4E] bg-white text-[#2E5E4E]"
                    : "border-transparent text-[#111111] hover:bg-white/70"
                  }`}
                  onClick={() => selectCategory(item.key)}
                  type="button"
                >
                  <span className="line-clamp-2">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative z-10 min-w-0 flex-[0_0_72%] overflow-x-hidden overflow-y-auto p-4">
        {selected === "events" ?
          <EventsPanel />
        : selected === "seller-news" ?
          <SellerNewsPanel />
        : selected === "all" && panelView ?
          <AllCategoryPanel catalog={catalog} view={panelView} />
        : isCategorySlug(selected) && panelView ?
          <CategoryPanel
            activeSub={activeSub}
            slug={selected}
            view={panelView}
          />
        : null}
      </div>
    </div>
  );
}

/** `/categories?category=all` 전용 — 개별 `/category/[slug]` PLP에서는 사용하지 않음 */
function EventsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-bold text-[#111111]">기획전</h2>
      <ul className="space-y-1">
        {[
          { label: "진행 중 이벤트", href: "/events", glyph: "🎉" },
          { label: "쿠폰·포인트", href: "/mypage/benefits", glyph: "🎫" },
          { label: "특가 상품", href: "/category/closing-soon", glyph: "⚡" },
        ].map((link) => (
          <li key={link.href}>
            <Link
              className="relative z-10 flex min-h-[48px] items-center gap-3 rounded-xl px-2 text-[14px] font-medium text-[#111111] hover:bg-[#F5F7F6]"
              href={link.href}
            >
              <span aria-hidden className="text-lg">
                {link.glyph}
              </span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SellerNewsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-bold text-[#111111]">판매자소식</h2>
      <p className="text-[14px] text-[#666666]">판매자 소식과 스토리를 만나보세요.</p>
      <Link
        className="relative z-10 inline-flex min-h-[44px] items-center rounded-xl bg-[#F5F7F6] px-4 text-[14px] font-semibold text-[#2E5E4E]"
        href="/search?q=판매자"
      >
        판매자 소식 보기
      </Link>
    </div>
  );
}

type PanelViewProps = {
  view: ReturnType<typeof buildCategoryPanelViewModel>;
};

type AllCategoryPanelProps = PanelViewProps & {
  catalog: Deal[];
};

function AllCategoryPanel({ view }: AllCategoryPanelProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">전체</h2>
        <p className="text-[13px] text-[#666666]">
          상품 {view.productCount.toLocaleString("ko-KR")}개
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LEFT_NAV_ITEMS.filter(
          (item): item is { key: CategorySlug; label: string } =>
            isCategorySlug(item.key),
        ).map((item) => (
          <Link
            className="relative z-10 flex h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border border-[#E8ECEA] bg-white text-center active:scale-[0.99]"
            href={`/category/${item.key}`}
            key={item.key}
          >
            <span className="text-[14px] font-semibold text-[#111111]">{item.label}</span>
          </Link>
        ))}
      </div>

      <PlpRecommendedSellers sellers={view.recommendedSellers} />

      <ProductSection deals={view.popularDeals} title="인기 상품" />
      <ProductSection deals={view.reviewDeals} title="후기 좋은 상품" />
    </div>
  );
}

type CategoryPanelProps = PanelViewProps & {
  slug: CategorySlug;
  activeSub: string | null;
};

function CategoryPanel({ slug, activeSub, view }: CategoryPanelProps) {
  const subcategories = getCategoryDisplaySubcategories(slug);
  const title = categoryTitles[slug];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
        <p className="text-[13px] text-[#666666]">
          상품 {view.productCount.toLocaleString("ko-KR")}개
        </p>
      </div>

      <CategoryChipGrid ariaLabel={`${title} 하위 카테고리`}>
        <CategoryChip
          active={activeSub === null}
          href={`/category/${slug}`}
          icon="📦"
          label="전체"
          layout="grid"
        />
        {subcategories.map((sub) => (
          <CategoryChip
            active={activeSub === sub.slug}
            href={`/category/${slug}?sub=${sub.slug}`}
            icon={sub.glyph}
            key={sub.slug}
            label={sub.label}
            layout="grid"
          />
        ))}
      </CategoryChipGrid>

      <PlpRecommendedSellers sellers={view.recommendedSellers} />

      <ProductSection
        deals={view.popularDeals}
        moreHref={getCategoryListingHref(slug, activeSub)}
        title="인기 상품"
      />
      <ProductSection
        deals={view.reviewDeals}
        moreHref={getCategoryListingHref(slug, activeSub)}
        title="후기 좋은 상품"
      />
    </div>
  );
}

type ProductSectionProps = {
  title: string;
  deals: Deal[];
  moreHref?: string;
};

function ProductSection({ title, deals, moreHref }: ProductSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section aria-label={title} className="relative z-10 space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
        {moreHref ?
          <Link
            className="shrink-0 text-[14px] font-medium text-[#666666]"
            href={moreHref}
          >
            더보기
          </Link>
        : null}
      </div>
      <DealProductGrid deals={deals.slice(0, 12)} />
    </section>
  );
}
