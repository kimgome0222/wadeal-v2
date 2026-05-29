import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { FINANCE_POLICY } from "@/lib/policies/content";

export default function FinanceTermsPage() {
  return (
    <PageShell>
      <SubHeader backHref="/login" title={FINANCE_POLICY.title} />
      <PolicyPageContent document={FINANCE_POLICY} />
      <SiteFooter />
    </PageShell>
  );
}
