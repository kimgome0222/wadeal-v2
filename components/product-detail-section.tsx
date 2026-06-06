import type { Deal } from "@/lib/deals";
import { getProductImages } from "@/lib/product-images";

type ProductDetailSectionProps = {
  deal: Deal;
};

const defaultDescription =
  "celloh에서 판매자 스토리와 함께 만나는 상품입니다. 상품 특성과 사용 방법은 아래 상세 이미지를 참고해 주세요.";

export function ProductDetailSection({ deal }: ProductDetailSectionProps) {
  const description = deal.description?.trim() || defaultDescription;
  const { details } = getProductImages(deal);
  const detailImages =
    details.length > 0 ? details
    : deal.imageUrl ? [deal.imageUrl]
    : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-wadeal-line bg-white shadow-card">
      <div className="celloh-section-head">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-4 w-1 rounded-full bg-wadeal-red" />
          <div>
            <h2 className="text-sm font-black text-wadeal-ink">상품 상세</h2>
            <p className="mt-0.5 text-[11px] font-bold text-wadeal-muted">
              상품 정보 및 상세 컷을 확인해 보세요
            </p>
          </div>
        </div>
      </div>

      {detailImages.length > 0 ?
        <div className="space-y-0">
          {detailImages.map((image, index) => (
            <img
              alt={`${deal.title} 상세 이미지 ${index + 1}`}
              className="w-full bg-wadeal-surface object-cover"
              key={`${image}-${index}`}
              src={image}
            />
          ))}
        </div>
      : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-wadeal-surface text-xs font-bold text-wadeal-muted">
          상세 이미지 준비중
        </div>
      )}

      <div className="border-t border-wadeal-line bg-wadeal-surface/40 px-4 py-4">
        <h3 className="text-xs font-black text-wadeal-red">상품 설명</h3>
        <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-wadeal-muted">
          {description}
        </p>
      </div>
    </section>
  );
}
