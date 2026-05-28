import { SellerPlaceholderPanel, SellerShell } from "@/components/seller-shell";

export default function SellerProductsPage() {
  return (
    <SellerShell title="상품 관리">
      <SellerPlaceholderPanel
        description="판매자 소유 상품 등록, 가격 단계 설정, 공동구매 일정 관리 기능이 연결될 예정입니다."
        title="상품 관리 (준비 중)"
      />
    </SellerShell>
  );
}
