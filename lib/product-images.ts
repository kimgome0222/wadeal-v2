import type { Deal } from "@/lib/deals";

function withUnsplashCrop(url: string, width: number, height: number) {
  const [base] = url.split("?");
  return `${base}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/** Derive hero + detail cut URLs from the single product image field. */
export function getProductImages(deal: Deal) {
  const hero = deal.imageUrl;

  if (!hero) {
    return { hero: "", gallery: [] as string[], details: [] as string[] };
  }

  if (hero.includes("unsplash.com")) {
    const gallery = [
      withUnsplashCrop(hero, 800, 800),
      withUnsplashCrop(hero, 800, 600),
      withUnsplashCrop(hero, 800, 1000),
    ];
    const details = [
      withUnsplashCrop(hero, 960, 720),
      withUnsplashCrop(hero, 960, 960),
      withUnsplashCrop(hero, 960, 540),
    ];
    return { hero: gallery[0], gallery, details };
  }

  return {
    hero,
    gallery: [hero],
    details: [hero],
  };
}
