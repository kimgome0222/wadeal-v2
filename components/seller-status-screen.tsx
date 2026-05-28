import Link from "next/link";

import { getSellerStatusLabel, type SellerStatus } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type SellerStatusScreenProps = {
  status: SellerStatus;
  rejectionReason?: string | null;
};

export function SellerStatusScreen({ status, rejectionReason }: SellerStatusScreenProps) {
  const isRejected = status === "rejected";
  const isSuspended = status === "suspended";
  const isUnderReview = status === "under_review";

  const title =
    isRejected ? "판매자 신청이 반려되었어요"
    : isSuspended ? "판매자 이용이 제한되었어요"
    : isUnderReview ? "보완 심사가 진행 중이에요"
    : "입점 심사가 진행 중이에요";

  const description =
    isRejected ?
      rejectionReason ?
        `반려 사유: ${rejectionReason}`
      : "반려 사유 확인 후 정보를 수정해 다시 신청해 주세요."
    : isSuspended ?
      "이용 제한 해제는 고객센터로 문의해 주세요."
    : isUnderReview ?
      "관리자 보완 요청 사항을 확인한 뒤 수정해 주세요. 심사 완료 후 판매자센터를 이용할 수 있어요."
    : "승인 완료 후 상품 관리, 주문/배송, 정산 기능을 이용할 수 있어요.";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-10">
      <div className={`${ui.panel} w-full space-y-4 text-center`}>
        <p className="text-base font-black text-wadeal-ink">{title}</p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{description}</p>
        <p className="text-[11px] font-bold text-wadeal-muted">
          현재 상태: {getSellerStatusLabel(status)}
        </p>
        <div className="grid gap-2">
          {isRejected ?
            <Link className={`${ui.btnPrimary} h-11`} href="/seller/apply">
              재신청하기
            </Link>
          : null}
          {!isSuspended ?
            <Link className={`${ui.btnOutline} h-11`} href="/seller/settings">
              {isRejected ? "신청 정보 수정" : "신청 상태 확인"}
            </Link>
          : null}
          <Link className={`${ui.btnOutline} h-11`} href="/">
            쇼핑몰로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
