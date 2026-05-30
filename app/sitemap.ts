import type { MetadataRoute } from "next";

import { categoryNavItems } from "@/lib/categories";
import { getAllActiveDeals } from "@/lib/data";
import { COLLECTION_SITEMAP_SLUGS } from "@/lib/home/collection-data";
import { POLICY_SLUGS } from "@/lib/policies/registry";
import { getSiteOrigin } from "@/lib/share/urls";

const STATIC_PUBLIC_ROUTES = ["/support"] as const;

const POLICY_SITEMAP_SLUGS = ["privacy", "terms"] as const satisfies readonly (typeof POLICY_SLUGS)[number][];

function buildSitemapEntry(
  origin: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "daily",
): MetadataRoute.Sitemap[number] {
  return {
    url: `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();

  const staticRoutes: MetadataRoute.Sitemap = [
    buildSitemapEntry(origin, "", 1, "hourly"),
    buildSitemapEntry(origin, "/search", 0.8, "daily"),
    ...STATIC_PUBLIC_ROUTES.map((path) => buildSitemapEntry(origin, path, 0.6, "weekly")),
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoryNavItems
    .filter((item) => item.slug !== "all" && item.slug !== "recommended" && item.slug !== "popular")
    .map((item) => buildSitemapEntry(origin, `/category/${item.slug}`, 0.7, "hourly"));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTION_SITEMAP_SLUGS.map((slug) =>
    buildSitemapEntry(origin, `/collections/${slug}`, 0.75, "hourly"),
  );

  const policyRoutes: MetadataRoute.Sitemap = POLICY_SITEMAP_SLUGS.map((slug) =>
    buildSitemapEntry(origin, `/policies/${slug}`, 0.5, "monthly"),
  );

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const deals = await getAllActiveDeals();
    productRoutes = deals.map((deal) =>
      buildSitemapEntry(origin, `/product/${deal.slug}`, 0.9, "daily"),
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sitemap] failed to load deals:", error);
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...policyRoutes, ...productRoutes];
}
