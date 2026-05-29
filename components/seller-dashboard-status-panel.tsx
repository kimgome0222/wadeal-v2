import Link from "next/link";

import type { SellerSetupStatus } from "@/lib/sellers/setup-status";
import { ui } from "@/lib/ui";

type SellerDashboardStatusPanelProps = {
  companyName?: string | null;
  setup: SellerSetupStatus;
};

function StatusRow({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "ok" | "warn";
}) {
  const valueClass =
    tone === "ok" ?
      "text-[#2E5E4E]"
    : tone === "warn" ?
      "text-[#E28A3B]"
    : "text-wadeal-muted";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-wadeal-line/70 py-2 last:border-b-0">
      <span className="text-xs font-bold text-wadeal-ink">{label}</span>
      <span className={`text-xs font-black ${valueClass}`}>{value}</span>
    </div>
  );
}

export function SellerDashboardStatusPanel({
  companyName,
  setup,
}: SellerDashboardStatusPanelProps) {
  return (
    <div className={`${ui.panel} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-wadeal-ink">현재 판매자 상태</p>
          {companyName ?
            <p className="mt-1 text-xs font-bold text-wadeal-muted">{companyName}</p>
          : null}
        </div>
        {!setup.businessInfoComplete ?
          <Link
            className="shrink-0 rounded-lg bg-[#2E5E4E] px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-95"
            href="/seller/settings"
          >
            정보 등록
          </Link>
        : null}
      </div>

      <div>
        <StatusRow
          label="판매자 정보"
          tone={setup.profileStatusLabel === "완료" ? "ok" : "warn"}
          value={setup.profileStatusLabel}
        />
        <StatusRow
          label="사업자 인증"
          tone={
            setup.businessVerificationLabel === "인증 완료" ? "ok"
            : setup.businessVerificationLabel === "심사 중" ? "muted"
            : "warn"
          }
          value={setup.businessVerificationLabel}
        />
        <StatusRow
          label="상품 등록"
          tone={setup.canRegisterProducts ? "ok" : "warn"}
          value={setup.productRegistrationLabel}
        />
        <StatusRow
          label="정산 계좌"
          tone={setup.settlementAccountComplete ? "ok" : "warn"}
          value={setup.settlementAccountLabel}
        />
      </div>
    </div>
  );
}
