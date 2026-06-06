import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import type { SellerProfile } from "@/lib/sellers/types";

type HomePopularSellersSectionProps = {
  sellers: SellerProfile[];
};

export function HomePopularSellersSection({ sellers }: HomePopularSellersSectionProps) {
  return (
    <HomeSellersCarouselSection
      ariaLabel="인기 판매자"
      kicker="popular sellers"
      sellers={sellers}
      subtitle="누적 판매와 리뷰로 검증된 인기 판매자를 만나보세요"
      title="인기 판매자"
      variant="compact"
    />
  );
}
