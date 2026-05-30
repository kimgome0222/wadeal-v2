import Link from "next/link";

import { EMPTY_BUSINESS_SETTINGS, type BusinessSettings } from "@/lib/business-settings/shared";
import { CELLOH_BRAND } from "@/lib/brand/copy";
import { ds } from "@/lib/design-system";

const footerLinks = [
  { label: "고객센터", href: "/support" },
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "환불정책", href: "/refund-policy" },
  { label: "쇼핑 운영정책", href: "/commerce-policy" },
] as const;

const footerLinkClass =
  "text-[13px] font-medium text-[#1F2A24] transition-colors duration-200 hover:text-[#2E5E4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E5E4E]/25";

type SiteFooterContentProps = {
  className?: string;
  settings?: BusinessSettings;
};

function displayValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function joinParts(parts: Array<string | null>, separator: string) {
  const filtered = parts.filter((part): part is string => Boolean(part));
  return filtered.length > 0 ? filtered.join(separator) : null;
}

function FooterDivider() {
  return <div aria-hidden className="my-6 border-t border-[#DDE8E2]/60" />;
}

function BusinessInfoLines({ settings }: { settings: BusinessSettings }) {
  const businessLine = joinParts(
    [
      displayValue(settings.businessName) ? `상호: ${settings.businessName}` : null,
      displayValue(settings.representativeName) ? `대표: ${settings.representativeName}` : null,
    ],
    " · ",
  );

  const registrationLine = joinParts(
    [
      displayValue(settings.businessNumber) ? `사업자등록번호: ${settings.businessNumber}` : null,
      displayValue(settings.mailOrderSalesNumber)
        ? `통신판매업: ${settings.mailOrderSalesNumber}`
        : null,
    ],
    " · ",
  );

  const addressLine = displayValue(settings.businessAddress)
    ? `주소: ${settings.businessAddress}`
    : null;

  const customerServiceLine = joinParts(
    [
      displayValue(settings.customerServicePhone)
        ? `전화: ${settings.customerServicePhone}`
        : null,
      displayValue(settings.customerServiceEmail)
        ? `이메일: ${settings.customerServiceEmail}`
        : null,
      displayValue(settings.customerServiceHours)
        ? `운영시간: ${settings.customerServiceHours}`
        : null,
    ],
    " · ",
  );

  const lines = [businessLine, registrationLine, addressLine, customerServiceLine].filter(
    (line): line is string => Boolean(line),
  );

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-1.5 text-center">
      {lines.map((line) => (
        <p className={`${ds.type.caption} leading-relaxed text-wadeal-muted`} key={line}>
          {line}
        </p>
      ))}
    </div>
  );
}

export function SiteFooterContent({
  className = "",
  settings = EMPTY_BUSINESS_SETTINGS,
}: SiteFooterContentProps) {
  const copyrightName = displayValue(settings.businessName) ?? "celloh";

  return (
    <footer className={`min-w-0 ${ds.chrome.footer} ${className}`}>
      <div className="text-center">
        <p className="text-[21px] font-semibold text-[#1F2A24]">{CELLOH_BRAND.name}</p>
        <p className={`mt-3 ${ds.type.bodySm} text-[#1F2A24]`}>{CELLOH_BRAND.tagline}</p>
        <p className={`mt-1 ${ds.type.caption}`}>{CELLOH_BRAND.philosophy}</p>
      </div>

      <FooterDivider />

      <nav aria-label="정책 및 고객지원">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link className={footerLinkClass} href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <FooterDivider />

      <nav aria-label="판매자 및 운영자 전용" className="space-y-2 text-center">
        <Link className="text-[12px] font-medium text-wadeal-muted hover:text-[#2E5E4E]" href="/seller/login">
          판매자센터
        </Link>
        <Link
          className="block text-[12px] font-medium text-wadeal-muted hover:text-[#2E5E4E]"
          href="/admin/login"
        >
          관리자센터
        </Link>
      </nav>

      <BusinessInfoLines settings={settings} />

      <p className={`mt-6 text-center text-[11px] text-wadeal-muted`}>
        © {copyrightName}. All rights reserved.
      </p>
    </footer>
  );
}
