import type { Metadata } from "next";

import type { CategorySlug } from "@/lib/categories";
import { categoryTitles } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { getSiteOrigin } from "@/lib/share/urls";

export const siteConfig = {
  name: "와딜",
  title: "와딜 | 공동구매",
  description: "함께 사면 더 저렴한 프리미엄 공동구매, 와딜.",
  locale: "ko_KR",
  themeColor: "#e53935",
} as const;

export function getMetadataBase(): URL {
  return new URL(getSiteOrigin());
}

export const rootMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["공동구매", "와딜", "할인", "그룹바잉", "한국"],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export function buildProductMetadata(deal: Deal): Metadata {
  const { applicablePrice } = getTierProgress(deal);
  const priceLabel = `${currency.format(applicablePrice)}원`;
  const description =
    deal.description?.trim() ||
    `${deal.title} · 현재 공동구매 예상가 ${priceLabel}. 함께 참여하면 더 저렴해져요.`;
  const canonical = new URL(`/product/${deal.slug}`, getMetadataBase()).toString();

  return {
    title: deal.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: deal.title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: deal.imageUrl,
          alt: deal.title,
          width: 600,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: deal.title,
      description,
      images: [deal.imageUrl],
    },
  };
}

export function buildSearchMetadata(query: string): Metadata {
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      title: "상품 검색",
      description: "와딜에서 원하는 공동구매 상품을 검색해 보세요.",
      alternates: {
        canonical: new URL("/search", getMetadataBase()).toString(),
      },
    };
  }

  const title = `'${trimmed}' 검색 결과`;
  const description = `${trimmed} 관련 공동구매 상품을 와딜에서 찾아보세요.`;

  return {
    title,
    description,
    alternates: {
      canonical: new URL(
        `/search?q=${encodeURIComponent(trimmed)}`,
        getMetadataBase(),
      ).toString(),
    },
    openGraph: {
      title,
      description,
      url: new URL(`/search?q=${encodeURIComponent(trimmed)}`, getMetadataBase()).toString(),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
  };
}

export function buildCategoryMetadata(slug: CategorySlug): Metadata {
  const label = categoryTitles[slug];
  const title = `${label} 공동구매`;
  const description = `${label} 카테고리의 공동구매 상품을 와딜에서 만나보세요.`;
  const canonical = new URL(`/category/${slug}`, getMetadataBase()).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
  };
}
