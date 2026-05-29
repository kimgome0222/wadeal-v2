"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import type { FollowedSellerSnapshot } from "@/lib/sellers/follow-storage";
import {
  getFollowedSellers,
  SELLER_FOLLOW_EVENTS,
} from "@/lib/sellers/follow-storage";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { buildSellerProfilesFromDeals } from "@/lib/sellers/home-sellers";
import { deals as mockDeals } from "@/lib/deals";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type MypageFollowingSellersContentProps = {
  isLoggedIn?: boolean;
};

export function MypageFollowingSellersContent({
  isLoggedIn = true,
}: MypageFollowingSellersContentProps) {
  const [followed, setFollowed] = useState<FollowedSellerSnapshot[]>([]);

  useEffect(() => {
    const sync = () => {
      setFollowed(getFollowedSellers());
    };

    sync();
    window.addEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
    return () => {
      window.removeEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
    };
  }, []);

  const profiles = buildSellerProfilesFromDeals(mockDeals);
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  if (followed.length === 0) {
    return (
      <EmptyState
        actionHref={isLoggedIn ? "/" : "/login?next=/mypage/following-sellers"}
        actionLabel={isLoggedIn ? "판매자 둘러보기" : "로그인하기"}
        description={CELLOH_EMPTY_STATES.followedSellers.description}
        title={CELLOH_EMPTY_STATES.followedSellers.title}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {followed.map((item) => {
        const profile = profileById.get(item.id);

        return (
          <li className={`${ui.card} min-w-0 p-4`} key={item.id}>
            <div className="flex items-start gap-3">
              <SellerProfileAvatar name={item.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-wadeal-ink">{item.name}</p>
                <p className="mt-1 line-clamp-2 text-xs font-medium text-wadeal-muted">
                  {item.tagline}
                </p>
                {profile ?
                  <SellerTrustBadges badges={profile.badges} className="mt-2" limit={4} />
                : null}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                className={`${ui.btnOutline} h-10 text-[13px]`}
                href={getSellerSearchHref({ name: item.name })}
              >
                {SELLER_UI_COPY.moreProducts}
              </Link>
              {profile ?
                <FollowSellerButton
                  compact
                  isLoggedIn={isLoggedIn}
                  loginNext="/mypage/following-sellers"
                  seller={profile}
                />
              : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
