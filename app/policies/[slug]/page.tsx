import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { getPolicyBySlug, isPolicySlug } from "@/lib/policies/registry";
import { ui } from "@/lib/ui";

type PolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    { slug: "privacy" },
    { slug: "terms" },
    { slug: "commerce" },
    { slug: "refund" },
    { slug: "shipping" },
    { slug: "payment" },
    { slug: "marketing" },
    { slug: "referral" },
    { slug: "seller" },
    { slug: "youth" },
    { slug: "membership" },
    { slug: "review" },
  ];
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;

  if (!isPolicySlug(slug)) {
    notFound();
  }

  const document = getPolicyBySlug(slug);
  if (!document) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/" title={document.title} />
      <PolicyPageContent document={document} />
      <div className={`${ui.pageBody} flex flex-col gap-2 pb-8`}>
        <Link className={`${ui.btnOutline} min-h-[44px]`} href="/support">
          고객센터 문의
        </Link>
        <Link className={`${ui.btnPrimary} min-h-[44px]`} href="/">
          홈으로 돌아가기
        </Link>
      </div>
      <SiteFooter />
    </PageShell>
  );
}
