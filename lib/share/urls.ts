export function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function buildShareUrl(
  productSlug: string,
  referralCode?: string | null,
  origin?: string,
): string {
  const base = (origin ?? getSiteOrigin()).replace(/\/$/, "");
  const url = new URL(`/product/${productSlug}`, base);

  if (referralCode) {
    url.searchParams.set("ref", referralCode);
  }

  return url.toString();
}
