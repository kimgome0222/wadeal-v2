import type { Metadata } from "next";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { CategoriesAllView } from "@/components/categories-all-view";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export const metadata: Metadata = {
  title: "카테고리 전체보기",
  description: "Wadeal 공동구매 카테고리 전체 목록",
};

export default function CategoriesPage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="카테고리" />
      <div className={`${ui.pageBody} bg-wadeal-surface`}>
        <CategoriesAllView />
      </div>
      <AppBottomNavigation />
    </PageShell>
  );
}
