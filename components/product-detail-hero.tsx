import { ProductImageGallery } from "@/components/product-image-gallery";
import type { Deal } from "@/lib/deals";

type ProductDetailHeroProps = {
  deal: Deal;
};

export function ProductDetailHero({ deal }: ProductDetailHeroProps) {
  return <ProductImageGallery deal={deal} />;
}
