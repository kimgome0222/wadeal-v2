import { ui } from "@/lib/ui";

export function SellerProductComplianceNotice() {
  return (
    <div className={`${ui.panel} space-y-3 border-wadeal-coral/20 bg-wadeal-cream/30`}>
      <div>
        <p className="text-sm font-black text-wadeal-ink">상품 등록 전 필수 안내</p>
        <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
          금지 상품 등록 시 검수 반려 및 계정 제재가 될 수 있어요.
        </p>
      </div>

      <ul className="list-disc space-y-1 pl-4 text-xs font-bold text-wadeal-muted">
        <li>의약품, 주류, 담배, 성인용품, 무기류, 위조·가품 등은 판매할 수 없어요.</li>
        <li>카테고리별 원산지·인증·표시사항을 반드시 기재해 주세요.</li>
        <li>치료·완치·100% 효과 등 과장·허위 광고 표현은 금지됩니다.</li>
      </ul>

      <p className="text-xs font-bold text-wadeal-muted">
        자세한 기준은 celloh 운영팀 공지 및 판매자센터 FAQ를 참고해 주세요.
      </p>
    </div>
  );
}
