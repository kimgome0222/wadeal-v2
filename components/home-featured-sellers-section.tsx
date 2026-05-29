import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import type { SellerProfile } from "@/lib/sellers/types";

type HomeFeaturedSellersSectionProps = {
  sellers: SellerProfile[];
};

export function HomeFeaturedSellersSection({ sellers }: HomeFeaturedSellersSectionProps) {
  return (
    <HomeSellersCarouselSection
      ariaLabel="추천 판매자"
      kicker="celloh"
      moreLabel="전체보기"
      sellers={sellers}
      subtitle="누가 만들었는지 알고 사세요. 좋은 상품은 좋은 판매자에게서 시작됩니다."
      title="추천 판매자"
    />
  );
}
