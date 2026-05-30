import Link from "next/link";
import { Suspense } from "react";

import { SellerInquiriesMockPanel } from "@/components/seller/seller-inquiries-mock-panel";
import { EmptyState } from "@/components/empty-state";
import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerProductInquiriesList } from "@/components/seller-product-inquiries-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import {
  getSellerProductInquiries,
  type SellerProductInquiryFilter,
} from "@/lib/data/seller-product-inquiries";
import { showSellerCenterMock } from "@/lib/sellers/show-seller-mock";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const filters: { value: SellerProductInquiryFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "no_reply", label: "답변 대기" },
  { value: "answered", label: "답변 완료" },
];

function resolveFilter(value: string | undefined): SellerProductInquiryFilter {
  if (value === "no_reply" || value === "answered") {
    return value;
  }
  return "all";
}

export default async function SellerInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { seller } = await getSellerCenterPageContext("/seller/inquiries");

  if (!seller) {
    return (
      <SellerShell title="상품 문의">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  const params = await searchParams;
  const filter = resolveFilter(params.filter);
  const inquiries = await getSellerProductInquiries(seller.userId, filter);
  const pendingCount = (await getSellerProductInquiries(seller.userId, "no_reply")).length;

  return (
    <SellerShell title="상품 문의">
      <div className="space-y-4">
        <p className="text-xs font-bold text-wadeal-muted">
          본인 상품에 등록된 Q&amp;A 문의입니다. 답변 대기 {pendingCount}건
        </p>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Link
              className={`rounded-full px-3 py-1 text-[11px] font-black ${
                filter === item.value ?
                  "bg-wadeal-red text-white"
                : "bg-wadeal-surface text-wadeal-muted"
              }`}
              href={`/seller/inquiries?filter=${item.value}`}
              key={item.value}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {inquiries.length === 0 ?
          showSellerCenterMock() ?
            <SellerInquiriesMockPanel />
          : <EmptyState
              description="고객 문의가 들어오면 이곳에서 답변할 수 있어요."
              title="아직 문의가 없어요."
            />
        : <Suspense fallback={<div className={`${ui.panel} h-24 animate-pulse`} />}>
            <SellerProductInquiriesList inquiries={inquiries} />
          </Suspense>
        }
      </div>
    </SellerShell>
  );
}
