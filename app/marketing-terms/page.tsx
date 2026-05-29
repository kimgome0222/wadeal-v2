import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { MARKETING_POLICY } from "@/lib/policies/content";

export default function MarketingTermsPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage/settings" title={MARKETING_POLICY.title} />
      <PolicyPageContent document={MARKETING_POLICY} />
      <SiteFooter />
    </PageShell>
  );
}
