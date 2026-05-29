import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import type { SellerProfile } from "@/lib/sellers/types";

type HomeTrustedSellersSectionProps = {
  sellers: SellerProfile[];
};

export function HomeTrustedSellersSection({ sellers }: HomeTrustedSellersSectionProps) {
  return (
    <HomeSellersCarouselSection
      ariaLabel="신뢰 판매자"
      kicker="trusted sellers"
      sellers={sellers}
      subtitle="인증과 응답률, 재구매율로 검증된 판매자입니다"
      title="신뢰 판매자"
      variant="compact"
    />
  );
}
