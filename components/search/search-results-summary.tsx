import { ds } from "@/lib/design-system";

type SearchResultsSummaryProps = {
  query: string;
  productTotal: number;
  sellerTotal?: number;
};

export function SearchResultsSummary({
  query,
  productTotal,
  sellerTotal = 0,
}: SearchResultsSummaryProps) {
  return (
    <div className="space-y-0.5">
      <p className={ds.type.h2}>
        &apos;{query}&apos; 검색 결과
      </p>
      <p className={ds.type.caption}>
        상품 {productTotal.toLocaleString("ko-KR")}개
        {sellerTotal > 0 ?
          ` · 판매자 ${sellerTotal.toLocaleString("ko-KR")}명`
        : null}
      </p>
    </div>
  );
}
