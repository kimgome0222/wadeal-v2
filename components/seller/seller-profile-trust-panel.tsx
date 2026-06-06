import Link from "next/link";

import {
  SELLER_TRUST_MOCK_DISCLAIMER,
  formatInquiryResponseRate,
  formatRepurchaseRate,
  getSellerTrustHints,
} from "@/lib/copy/seller-trust-copy";
import type { SellerProfile } from "@/lib/sellers/types";

type SellerProfileTrustPanelProps = {
  profile: SellerProfile;
};

export function SellerProfileTrustPanel({ profile }: SellerProfileTrustPanelProps) {
  const hints = getSellerTrustHints(profile);

  return (
    <section aria-label="판매자 신뢰 안내" className="space-y-3 px-6">
      <div className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
        <h2 className="text-[14px] font-bold text-[#111111]">판매자 신뢰 정보</h2>
        <ul className="mt-3 space-y-2">
          {hints.map((hint) => (
            <li className="text-[13px] leading-relaxed text-[#444444]" key={hint}>
              · {hint}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#F5F7F6] px-3 py-2.5 text-center">
            <p className="text-[15px] font-bold tabular-nums text-[#111111]">
              {formatRepurchaseRate(profile.repurchaseRate)}
            </p>
            <p className="text-[11px] text-[#666666]">재구매율 (mock)</p>
          </div>
          <div className="rounded-xl bg-[#F5F7F6] px-3 py-2.5 text-center">
            <p className="text-[15px] font-bold tabular-nums text-[#111111]">
              {formatInquiryResponseRate(profile.inquiryResponseRate)}
            </p>
            <p className="text-[11px] text-[#666666]">문의 응답률 (mock)</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-[#999999]">
          {SELLER_TRUST_MOCK_DISCLAIMER}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-[12px] font-semibold">
        <Link className="text-[#2E5E4E] underline underline-offset-2" href="/support/safe-shopping">
          안전구매 안내
        </Link>
        <Link className="text-[#666666] underline underline-offset-2" href="/support">
          고객센터
        </Link>
        <Link className="text-[#666666] underline underline-offset-2" href="/reports">
          신고하기
        </Link>
      </div>
    </section>
  );
}
