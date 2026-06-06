import type { Metadata } from "next";

import { OpenSourcePageContent } from "@/components/open-source-page-content";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { getOpenSourcePageData } from "@/lib/open-source";

export const metadata: Metadata = {
  title: "오픈소스 고지",
  description: "CELLOH가 참고·사용하는 오픈소스 라이브러리 목록",
};

export default function OpenSourcePage() {
  const data = getOpenSourcePageData();

  return (
    <PageShell>
      <SubHeader backHref="/mypage/settings" title="오픈소스" />
      <OpenSourcePageContent data={data} />
      <SiteFooter />
    </PageShell>
  );
}
