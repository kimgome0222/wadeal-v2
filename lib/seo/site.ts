import type { Metadata } from "next";

import type { CategorySlug } from "@/lib/categories";
import { categoryTitles } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { getSiteOrigin } from "@/lib/share/urls";

/** Production canonical origin placeholder — set NEXT_PUBLIC_SITE_URL at launch. */
export const LAUNCH_SITE_ORIGIN_PLACEHOLDER = "https://www.celloh.co.kr";

export const siteConfig = {
  name: "celloh",
  title: "celloh",
  tagline: "누가 만들었는지 알고 사세요.",
  subtitle: "좋은 상품은 좋은 판매자에게서 시작됩니다.",
  description:
    "누가 만들었는지 알고 사세요. 좋은 상품은 좋은 판매자에게서 시작됩니다.",
  locale: "ko_KR",
  themeColor: "#2E5E4E",
} as const;

export function getMetadataBase(): URL {
  return new URL(getSiteOrigin());
}

const rootCanonical = new URL("/", getMetadataBase()).toString();

export const rootMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["celloh", "셀로", "판매자", "스토리커머스", "쇼핑", "셀러", "상품발견", "신뢰쇼핑"],
  alternates: {
    canonical: rootCanonical,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: rootCanonical,
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
    `${deal.title} · 현재 예상가 ${priceLabel}. ${siteConfig.tagline} celloh에서 판매자와 함께 만나보세요.`;
  const canonical = new URL(`/product/${deal.slug}`, getMetadataBase()).toString();
  const imageUrl = deal.imageUrl?.trim() || undefined;
  const ogImages =
    imageUrl ?
      [
        {
          url: imageUrl,
          alt: deal.title,
          width: 600,
          height: 600,
        },
      ]
    : undefined;

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
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: deal.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function buildSearchMetadata(query: string): Metadata {
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      title: "상품 검색",
      description: "celloh에서 원하는 상품을 검색해 보세요.",
      alternates: {
        canonical: new URL("/search", getMetadataBase()).toString(),
      },
    };
  }

  const title = `'${trimmed}' 검색 결과`;
  const description = `${trimmed} 관련 상품을 celloh에서 찾아보세요.`;

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
  const title = `${label} 상품`;
  const description = `${label} 카테고리의 상품을 celloh에서 만나보세요. ${siteConfig.subtitle}`;
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildHomeMetadata(): Metadata {
  const canonical = new URL("/", getMetadataBase()).toString();

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
  };
}

export function buildCollectionMetadata(input: {
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const title = input.title;
  const description = `${input.description} ${siteConfig.tagline}`;
  const canonical = new URL(`/collections/${input.slug}`, getMetadataBase()).toString();

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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildSellerMetadata(input: {
  routeId: string;
  name: string;
  tagline?: string | null;
}): Metadata {
  const title = `${input.name} | celloh 판매자`;
  const description =
    input.tagline?.trim() ||
    `${input.name}의 상품을 celloh에서 만나보세요. ${siteConfig.subtitle}`;
  const canonical = new URL(`/sellers/${input.routeId}`, getMetadataBase()).toString();

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
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
