import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { GROUPBUY_POLICY } from "@/lib/policies/content";
import { ui } from "@/lib/ui";

function CommercePolicyOperatorInfo({
  businessName,
  representativeName,
  businessNumber,
  mailOrderSalesNumber,
  businessAddress,
  customerServicePhone,
  customerServiceEmail,
  customerServiceHours,
}: {
  businessName: string | null;
  representativeName: string | null;
  businessNumber: string | null;
  mailOrderSalesNumber: string | null;
  businessAddress: string | null;
  customerServicePhone: string | null;
  customerServiceEmail: string | null;
  customerServiceHours: string | null;
}) {
  const lines = [
    businessName ? `상호: ${businessName}` : null,
    representativeName ? `대표: ${representativeName}` : null,
    businessNumber ? `사업자등록번호: ${businessNumber}` : null,
    mailOrderSalesNumber ? `통신판매업 신고번호: ${mailOrderSalesNumber}` : null,
    businessAddress ? `주소: ${businessAddress}` : null,
    customerServicePhone ? `고객센터 전화: ${customerServicePhone}` : null,
    customerServiceEmail ? `고객센터 이메일: ${customerServiceEmail}` : null,
    customerServiceHours ? `고객센터 운영시간: ${customerServiceHours}` : null,
  ].filter((line): line is string => Boolean(line));

  if (lines.length === 0) {
    return null;
  }

  return (
    <section className={`${ui.pageBody} pb-0`}>
      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className="text-sm font-black text-wadeal-ink">사업자 및 고객센터 정보</h2>
        <div className="mt-3 space-y-2">
          {lines.map((line) => (
            <p className="text-xs font-bold leading-relaxed text-wadeal-muted" key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function CommercePolicyPage() {
  const settings = await getBusinessSettings();

  return (
    <PageShell>
      <SubHeader backHref="/" title={GROUPBUY_POLICY.title} />
      <PolicyPageContent document={GROUPBUY_POLICY} />
      <CommercePolicyOperatorInfo
        businessAddress={settings.businessAddress}
        businessName={settings.businessName}
        businessNumber={settings.businessNumber}
        customerServiceEmail={settings.customerServiceEmail}
        customerServiceHours={settings.customerServiceHours}
        customerServicePhone={settings.customerServicePhone}
        mailOrderSalesNumber={settings.mailOrderSalesNumber}
        representativeName={settings.representativeName}
      />
      <SiteFooter />
    </PageShell>
  );
}
