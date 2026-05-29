import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import type { SellerProfile } from "@/lib/sellers/types";

type HomeNewSellersSectionProps = {
  sellers: SellerProfile[];
};

export function HomeNewSellersSection({ sellers }: HomeNewSellersSectionProps) {
  return (
    <HomeSellersCarouselSection
      ariaLabel="신규 판매자"
      kicker="new sellers"
      sellers={sellers}
      subtitle="판매자를 알면, 상품이 보입니다. celloh에 새로 합류한 판매자를 만나보세요."
      title="신규 판매자"
      variant="compact"
    />
  );
}
