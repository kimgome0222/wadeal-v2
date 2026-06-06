"use client";

import { useEffect } from "react";
import { recordRecentViewAction } from "@/app/actions/recent-views";
import type { Deal } from "@/lib/deals";
import { trackEvent } from "@/lib/analytics/track-event";
import { addRecentDeal } from "@/lib/storage/local-user-data";

type ProductViewTrackerProps = {
  deal: Deal;
  isLoggedIn: boolean;
};

export function ProductViewTracker({ deal, isLoggedIn }: ProductViewTrackerProps) {
  useEffect(() => {
    addRecentDeal(deal);
    trackEvent("product_view", {
      product_slug: deal.slug,
      product_name: deal.title,
    });

    if (isLoggedIn) {
      void recordRecentViewAction(deal.slug);
    }
  }, [deal, isLoggedIn]);

  return null;
}
