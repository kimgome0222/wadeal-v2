"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DealSection } from "@/components/deal-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { HomeCategoryIcons } from "@/components/home-category-icons";
import { HomeMainDealsSection } from "@/components/home-main-deals-section";
import { RecentDealsSection } from "@/components/recent-deals-section";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { HeaderUserInfo } from "@/lib/auth/user-display";
import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

type HomeSection = {
  title: string;
  deals: Deal[];
};

type HomeCatalogProps = {
  sections: HomeSection[];
  mainDeals?: Deal[];
  headerUser?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
  heroFeatured?: { href: string; title: string } | null;
};

export function HomeCatalog({
  sections,
  mainDeals = [],
  headerUser = null,
  unreadNotificationCount = 0,
  roleLinks = [],
  heroFeatured = null,
}: HomeCatalogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const hasAnyDeals =
    mainDeals.length > 0 || sections.some((section) => section.deals.length > 0);
  const allDeals = [...mainDeals, ...sections.flatMap((section) => section.deals)];

  return (
    <>
      <div className="sticky top-0 z-30 bg-white">
        <Header
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          roleLinks={roleLinks}
          searchQuery={searchQuery}
          unreadNotificationCount={unreadNotificationCount}
          user={headerUser}
          variant="home"
        />
      </div>
      <HomeCategoryIcons />
      <div className="space-y-4 bg-wadeal-surface px-4 py-3">
        <HeroBanner
          featuredHref={heroFeatured?.href}
          featuredTitle={heroFeatured?.title}
        />

        {!hasAnyDeals ?
          <DealsEmptyState />
        : <>
            {mainDeals.length > 0 ?
              <HomeMainDealsSection deals={mainDeals} title="오늘의 추천 공동구매" />
            : null}
            {sections.map((section) => (
              <DealSection deals={section.deals} key={section.title} title={section.title} />
            ))}
            <RecentDealsSection />
          </>
        }
      </div>
    </>
  );
}
