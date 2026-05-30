import Image from "next/image";
import Link from "next/link";

import type { Deal } from "@/lib/deals";
import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";

function getSellerThumbnails(seller: SellerProfile, catalog: Deal[]): string[] {
  const matched = catalog.filter(
    (deal) =>
      deal.slug === seller.featuredProductSlug ||
      (deal.brandName?.trim() || "celloh 셀러") === seller.name,
  );

  const urls = matched.map((deal) => deal.imageUrl).filter(Boolean);
  if (urls.length >= 2) {
    return urls.slice(0, 3);
  }

  const featured = catalog.find((deal) => deal.slug === seller.featuredProductSlug);
  if (featured?.imageUrl) {
    return [featured.imageUrl, ...urls.filter((url) => url !== featured.imageUrl)].slice(0, 3);
  }

  return urls.slice(0, 3);
}

type SearchSellerResultCardProps = {
  seller: SellerProfile;
  catalog: Deal[];
};

export function SearchSellerResultCard({ seller, catalog }: SearchSellerResultCardProps) {
  const thumbnails = getSellerThumbnails(seller, catalog);

  return (
    <Link
      className="relative z-10 block rounded-[20px] border border-[#E8ECEA] bg-white p-4 active:scale-[0.99]"
      href={getSellerPublicProfileHref(seller)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold text-[#111111]">{seller.name}</p>
          <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-[#666666]">
            {seller.tagline}
          </p>
          <p className="mt-2 text-[12px] text-[#666666]">⭐ {seller.rating.toFixed(1)}</p>
          <p className="text-[12px] text-[#666666]">
            📦 {seller.totalSales.toLocaleString("ko-KR")}건 판매
          </p>
        </div>
        {thumbnails.length > 0 ?
          <div className="flex shrink-0 gap-1.5">
            {thumbnails.map((url, index) => (
              <div
                className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#F5F7F6]"
                key={`${seller.id}-${index}`}
              >
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={url}
                />
              </div>
            ))}
          </div>
        : null}
      </div>
      <span className="mt-3 inline-flex h-9 items-center rounded-xl bg-[#F5F7F6] px-3 text-[13px] font-semibold text-[#2E5E4E]">
        판매자관 보기
      </span>
    </Link>
  );
}

type SearchSellerResultListProps = {
  sellers: SellerProfile[];
  catalog: Deal[];
  query: string;
};

export function SearchSellerResultList({ sellers, catalog, query }: SearchSellerResultListProps) {
  if (sellers.length === 0) {
    return (
      <div className="space-y-2 py-8 text-center">
        <p className="text-[18px] font-bold text-[#111111]">판매자 결과가 없어요</p>
        <p className="text-[14px] text-[#666666]">
          &apos;{query}&apos;에 맞는 판매자를 찾지 못했어요.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="판매자 검색 결과" className="relative z-10 space-y-4">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">판매자 결과</h2>
        <p className="text-[13px] text-[#666666]">
          {sellers.length.toLocaleString("ko-KR")}명의 판매자
        </p>
      </div>
      <ul className="space-y-4">
        {sellers.map((seller) => (
          <li key={seller.id}>
            <SearchSellerResultCard catalog={catalog} seller={seller} />
          </li>
        ))}
      </ul>
    </section>
  );
}
