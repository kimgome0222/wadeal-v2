import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/lib/share/urls";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/checkout/",
        "/mypage/",
        "/login",
        "/auth/",
        "/join-cart",
        "/notifications",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
