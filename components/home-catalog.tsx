"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryGrid } from "@/components/category-grid";
import { DealSection } from "@/components/deal-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { RecentDealsSection } from "@/components/recent-deals-section";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

type HomeSection = {
  title: string;
  deals: Deal[];
};

type HeaderUserInfo = {
  displayName: string;
  identityLine: string;
  memberGrade?: string;
};

type HomeCatalogProps = {
  sections: HomeSection[];
  headerUser?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

export function HomeCatalog({
  sections,
  headerUser = null,
  unreadNotificationCount = 0,
  roleLinks = [],
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

  const hasAnyDeals = sections.some((section) => section.deals.length > 0);

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
        />
        <CategoryGrid sticky />
      </div>
      <div className="space-y-4 bg-wadeal-surface px-4 py-3">
        <HeroBanner />

        {!hasAnyDeals ?
          <DealsEmptyState />
        : <>
            {sections.map((section) => (
              <DealSection
                deals={section.deals}
                key={section.title}
                title={section.title}
              />
            ))}
            <RecentDealsSection />
          </>
        }
      </div>
    </>
  );
}
