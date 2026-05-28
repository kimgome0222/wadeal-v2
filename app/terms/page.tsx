import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { TERMS_POLICY } from "@/lib/policies/content";

export default function TermsPage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title={TERMS_POLICY.title} />
      <PolicyPageContent document={TERMS_POLICY} />
      <SiteFooter />
    </PageShell>
  );
}
