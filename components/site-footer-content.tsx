import Link from "next/link";

import { EMPTY_BUSINESS_SETTINGS, type BusinessSettings } from "@/lib/business-settings/shared";

const footerLinks = [
  { label: "고객센터", href: "/support" },
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "환불정책", href: "/refund-policy" },
  { label: "쇼핑 운영정책", href: "/commerce-policy" },
] as const;

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

function BusinessInfoLines({ settings }: { settings: BusinessSettings }) {
  const businessLine = joinParts(
    [
      displayValue(settings.businessName) ? `상호: ${settings.businessName}` : null,
      displayValue(settings.representativeName) ? `대표: ${settings.representativeName}` : null,
    ],
    " | ",
  );

  const registrationLine = joinParts(
    [
      displayValue(settings.businessNumber) ? `사업자등록번호: ${settings.businessNumber}` : null,
      displayValue(settings.mailOrderSalesNumber)
        ? `통신판매업: ${settings.mailOrderSalesNumber}`
        : null,
    ],
    " | ",
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
    " | ",
  );

  const lines = [businessLine, registrationLine, addressLine, customerServiceLine].filter(
    (line): line is string => Boolean(line),
  );

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-1 text-center">
      {lines.map((line) => (
        <p className="text-[10px] font-bold leading-relaxed text-gray-300" key={line}>
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
    <footer className={`min-w-0 border-t border-wadeal-line bg-white px-4 py-6 ${className}`}>
      <div className="text-center">
        <p className="text-sm font-black text-wadeal-red">celloh</p>
        <p className="mt-3 text-[14px] font-bold leading-snug text-wadeal-ink">
          누가 만들었는지 알고 사세요.
        </p>
        <p className="mt-1.5 text-[12px] font-semibold leading-relaxed text-wadeal-muted">
          좋은 상품은 좋은 판매자에게서 시작됩니다.
        </p>
        <p className="mt-1 text-[11px] font-medium text-wadeal-muted/90">
          판매자를 알면, 상품이 보입니다.
        </p>
      </div>

      <nav aria-label="정책 및 고객지원" className="mt-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {footerLinks.map((link, index) => (
            <li className="flex items-center" key={link.href}>
              {index > 0 ?
                <span aria-hidden className="mr-2 text-[10px] text-gray-300">
                  |
                </span>
              : null}
              <Link
                className="text-[11px] font-bold text-wadeal-muted underline-offset-2 hover:text-wadeal-ink hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center">
            <span aria-hidden className="mr-2 text-[10px] text-gray-300">
              |
            </span>
            <Link
              className="text-[11px] font-bold text-wadeal-muted underline-offset-2 hover:text-wadeal-ink hover:underline"
              href="/seller/dashboard"
            >
              판매자센터
            </Link>
          </li>
        </ul>
      </nav>

      <BusinessInfoLines settings={settings} />

      <p className="mt-4 text-center text-[10px] font-bold text-gray-300">
        © {copyrightName}. All rights reserved.
      </p>
    </footer>
  );
}
