import Link from "next/link";
import { redirect } from "next/navigation";

import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getSellerProductRequestStatusLabel,
  getSellerProductRequests,
} from "@/lib/data/seller-product-requests";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerProductRequestsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/product-requests");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    redirect("/seller/apply");
  }

  const requests = await getSellerProductRequests(seller.id);

  return (
    <SellerShell title="상품 등록 요청">
      <div className="space-y-4">
        <Link className={`${ui.btnPrimary} inline-flex h-11 items-center px-4 text-sm`} href="/seller/products/new">
          + 새 상품 등록 요청
        </Link>

        {requests.length === 0 ?
          <div className={`${ui.panel} py-10 text-center`}>
            <p className="text-sm font-black text-wadeal-ink">등록 요청 내역이 없어요.</p>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">새 상품 등록 요청을 작성해 보세요.</p>
          </div>
        : <div className="space-y-3">
            {requests.map((request) => (
              <article className={`${ui.panel} space-y-2`} key={request.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-wadeal-ink">{request.productName}</p>
                    <p className="text-xs font-bold text-wadeal-muted">
                      {new Date(request.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black">
                    {getSellerProductRequestStatusLabel(request.status)}
                  </span>
                </div>
                {request.groupPrice ?
                  <p className="text-xs font-bold text-wadeal-muted">
                    혜택가 {request.groupPrice.toLocaleString("ko-KR")}원
                    {request.targetParticipants ?
                      ` · 목표 ${request.targetParticipants}명`
                    : ""}
                  </p>
                : null}
                {request.rejectedReason ?
                  <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-xs font-bold text-wadeal-red">
                    반려 사유: {request.rejectedReason}
                  </p>
                : null}
                {request.status === "rejected" || request.status === "changes_requested" ?
                  <Link className="text-xs font-black text-wadeal-red" href="/seller/products/new">
                    수정 후 재요청 →
                  </Link>
                : null}
              </article>
            ))}
          </div>
        }
      </div>
    </SellerShell>
  );
}
