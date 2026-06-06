import { HomeSellerIconCard } from "@/components/home/home-seller-icon-card";
import type { HomeSellerWithCover } from "@/lib/home/build-home-view";

type HomeTopSellerCardProps = {
  seller: HomeSellerWithCover;
};

/** @deprecated Use HomeSellerIconCard — kept for import compatibility */
export function HomeTopSellerCard({ seller }: HomeTopSellerCardProps) {
  return (
    <HomeSellerIconCard
      coverImageUrl={seller.coverImageUrl}
      id={seller.id}
      name={seller.name}
      rating={seller.rating}
    />
  );
}
