import Link from "next/link";

import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type SellerProfileUnavailableProps = {
  routeId: string;
};

export function SellerProfileUnavailable({ routeId }: SellerProfileUnavailableProps) {
  const decoded = decodeURIComponent(routeId);

  return (
    <div className={`${ui.pageBody} space-y-4 py-10 text-center`}>
      <h1 className={ds.type.h2}>판매자 정보를 찾을 수 없어요</h1>
      <p className={`${ds.type.bodySm} text-wadeal-muted`}>
        &ldquo;{decoded}&rdquo; 판매자 프로필이 아직 준비 중이거나 주소가 변경되었을 수 있어요.
      </p>
      <div className="flex flex-col gap-2 pt-2">
        <Link className={ui.btnPrimary} href="/search">
          다른 판매자 찾기
        </Link>
        <Link className={`${ds.type.link} py-2`} href="/">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
