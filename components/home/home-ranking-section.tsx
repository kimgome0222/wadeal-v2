"use client";

import Link from "next/link";
import { useState } from "react";

import { HomeRankingColumn } from "@/components/home/home-ranking-column";
import { HomeRankingColumnShell, HomeRankingColumnTrack } from "@/components/home/home-ranking-column-track";
import { PolicyCriteriaLink } from "@/components/product/policy-criteria-link";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import { HOME_SECTION_COPY } from "@/lib/copy/home-section-copy";
import {
  HOME_RANKING_CATEGORIES,
  getRankingDealsForCategory,
} from "@/lib/home/mock-home-commerce-data";
import { motion } from "@/lib/ui";

type HomeRankingSectionProps = {
  catalog: Deal[];
};

/** 카테고리 랭킹 — 3-stack column 가로 스크롤 */
export function HomeRankingSection({ catalog }: HomeRankingSectionProps) {
  const [activeId, setActiveId] = useState(HOME_RANKING_CATEGORIES[0]?.id ?? "ready-meal");
  const active = HOME_RANKING_CATEGORIES.find((item) => item.id === activeId);
  const deals = getRankingDealsForCategory(catalog, activeId, 20);

  if (catalog.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="카테고리 랭킹"
      className={`${motion.sectionEnter} overflow-visible pt-10`}
      id="home-section-ranking"
    >
      <div className="px-6">
        <SectionHeader
          moreHref={HOME_SECTION_COPY.ranking.moreHref}
          moreLabel={HOME_SECTION_COPY.ranking.moreLabel}
          subtitle={HOME_SECTION_COPY.ranking.subtitle}
          title={HOME_SECTION_COPY.ranking.title}
        />
        <PolicyCriteriaLink
          className="pb-2"
          href="/info/ranking-policy"
          label="랭킹 기준 안내"
        />
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-3">
          {HOME_RANKING_CATEGORIES.map((category) => (
            <button
              aria-pressed={activeId === category.id}
              className={`h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-[100ms] ${
                activeId === category.id ?
                  "bg-[#2E5E4E] text-white"
                : "border border-[#E8ECEA] bg-white text-[#666666]"
              }`}
              key={category.id}
              onClick={() => setActiveId(category.id)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <HomeRankingColumnTrack ariaLabel={active?.label ?? "랭킹"}>
        {Array.from({ length: Math.ceil(deals.length / 3) }, (_, columnIndex) => {
          const columnDeals = deals.slice(columnIndex * 3, columnIndex * 3 + 3);
          return (
            <HomeRankingColumnShell key={`${activeId}-${columnIndex}`}>
              <HomeRankingColumn deals={columnDeals} startRank={columnIndex * 3 + 1} />
            </HomeRankingColumnShell>
          );
        })}
      </HomeRankingColumnTrack>

      {active ?
        <div className="px-6 pt-4">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8ECEA] text-[14px] font-semibold text-[#2E5E4E] active:bg-[#F5F7F6]"
            href={active.moreHref}
          >
            전체보기
          </Link>
        </div>
      : null}
    </section>
  );
}
