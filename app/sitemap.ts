import type { MetadataRoute } from "next";

import { categoryNavItems } from "@/lib/categories";
import { getAllActiveDeals } from "@/lib/data";
import { getSiteOrigin } from "@/lib/share/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${origin}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoryNavItems.map((item) => ({
    url: `${origin}/category/${item.slug}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const deals = await getAllActiveDeals();
    productRoutes = deals.map((deal) => ({
      url: `${origin}/product/${deal.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sitemap] failed to load deals:", error);
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
