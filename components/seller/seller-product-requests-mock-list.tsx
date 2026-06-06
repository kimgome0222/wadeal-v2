import Link from "next/link";

import {
  getProductRequestStatusLabel,
  MOCK_PRODUCT_REQUESTS,
} from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

export function SellerProductRequestsMockList() {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-wadeal-muted">mock 등록 요청 내역 — DB 연동 전</p>
      {MOCK_PRODUCT_REQUESTS.map((request) => (
        <article className={`${ui.panel} space-y-2`} key={request.id}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-black text-wadeal-ink">{request.productName}</p>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black">
              {getProductRequestStatusLabel(request.status)}
            </span>
          </div>
          <p className="text-xs font-bold text-wadeal-muted">{request.updatedAt}</p>
          {request.rejectedReason ?
            <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-xs font-bold text-wadeal-red">
              반려 사유: {request.rejectedReason}
            </p>
          : null}
          {request.status === "rejected" ?
            <Link className="text-xs font-black text-wadeal-red" href="/seller/products/new">
              수정 후 재요청 →
            </Link>
          : null}
        </article>
      ))}
    </div>
  );
}
