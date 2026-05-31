"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  removeFromJoinCartAction,
  updateJoinCartQuantityAction,
} from "@/app/actions/join-cart";
import { EmptyState } from "@/components/empty-state";
import { RecommendationBasisHint } from "@/components/recommendations/recommendation-basis-hint";
import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import { TierCouponFillRail } from "@/components/coupon/tier-coupon-fill-rail";
import { JoinCartCheckoutBar } from "@/components/join-cart/join-cart-checkout-bar";
import { JoinCartCouponPicker } from "@/components/join-cart/join-cart-coupon-picker";
import { JoinCartRecentViewsRail } from "@/components/join-cart/join-cart-recent-views-rail";
import { JoinCartCouponNotice } from "@/components/join-cart/join-cart-coupon-notice";
import { JoinCartSummaryCard } from "@/components/join-cart/join-cart-summary-card";
import { CELLOH_BUTTONS, CELLOH_EMPTY } from "@/lib/copy/ux-writing";
import type { JoinCartItem } from "@/lib/data/join-cart";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import {
  resolveOwnedCouponDiscount,
  type MockCouponSelection,
} from "@/lib/coupon/mock-owned-coupons";
import { getCartRecommendations } from "@/lib/recommendations/cart-recommendations";
import {
  GUEST_CART_CHANGED_EVENT,
  readGuestJoinCartItems,
  removeGuestJoinCartItem,
  setGuestJoinCartQuantityBySlug,
  syncGuestJoinCartFromServerItems,
  updateGuestJoinCartQuantity,
  type GuestJoinCartItem,
} from "@/lib/join-cart/guest-cart-storage";

type JoinCartContentProps = {
  items: JoinCartItem[];
  initialLoggedIn: boolean;
  catalog: Deal[];
};

function groupBySeller(items: Array<JoinCartItem | GuestJoinCartItem>) {
  const groups = new Map<string, Array<JoinCartItem | GuestJoinCartItem>>();

  for (const item of items) {
    const bucket = groups.get(item.sellerName) ?? [];
    bucket.push(item);
    groups.set(item.sellerName, bucket);
  }

  return [...groups.entries()];
}

function syncGuestFromJoinItem(
  item: Pick<
    JoinCartItem | GuestJoinCartItem,
    | "id"
    | "productSlug"
    | "productName"
    | "estimatedUnitPrice"
    | "sellerName"
    | "imageUrl"
  >,
  quantity: number,
) {
  if (quantity <= 0) {
    removeGuestJoinCartItem(item.id);
    return;
  }

  setGuestJoinCartQuantityBySlug(
    {
      productSlug: item.productSlug,
      productName: item.productName,
      estimatedUnitPrice: item.estimatedUnitPrice,
      sellerName: item.sellerName,
      imageUrl: item.imageUrl,
    },
    quantity,
  );
}

export function JoinCartContent({ items, initialLoggedIn, catalog }: JoinCartContentProps) {
  const router = useRouter();
  const refreshTimerRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestItems, setGuestItems] = useState<GuestJoinCartItem[]>([]);
  const [guestReady, setGuestReady] = useState(initialLoggedIn);

  useEffect(() => {
    if (initialLoggedIn) {
      return;
    }

    function syncGuestItems() {
      setGuestItems(readGuestJoinCartItems());
      setGuestReady(true);
    }

    syncGuestItems();
    window.addEventListener(GUEST_CART_CHANGED_EVENT, syncGuestItems);
    return () => window.removeEventListener(GUEST_CART_CHANGED_EVENT, syncGuestItems);
  }, [initialLoggedIn]);

  useEffect(() => {
    if (initialLoggedIn) {
      syncGuestJoinCartFromServerItems(items);
    }
  }, [initialLoggedIn, items]);

  useEffect(() => {
    if (!initialLoggedIn) {
      return;
    }

    function scheduleRefresh() {
      if (refreshTimerRef.current != null) {
        window.clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = window.setTimeout(() => {
        router.refresh();
      }, 250);
    }

    window.addEventListener(GUEST_CART_CHANGED_EVENT, scheduleRefresh);
    return () => {
      window.removeEventListener(GUEST_CART_CHANGED_EVENT, scheduleRefresh);
      if (refreshTimerRef.current != null) {
        window.clearTimeout(refreshTimerRef.current);
      }
    };
  }, [initialLoggedIn, router]);

  const displayItems = initialLoggedIn ? items : guestItems;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [couponSelection, setCouponSelection] = useState<MockCouponSelection>("auto");

  useEffect(() => {
    setSelectedIds(new Set(displayItems.map((item) => item.id)));
  }, [displayItems]);

  const groups = useMemo(() => groupBySeller(displayItems), [displayItems]);
  const allSelected = displayItems.length > 0 && selectedIds.size === displayItems.length;

  const selectedItems = displayItems.filter((item) => selectedIds.has(item.id));
  const productSubtotal = selectedItems.reduce((sum, item) => sum + item.estimatedLineTotal, 0);
  const { discount: couponDiscount } = resolveOwnedCouponDiscount(
    productSubtotal,
    couponSelection,
  );
  const shippingFee = selectedItems.length > 0 ? (productSubtotal >= 30000 ? 0 : 3000) : 0;
  const totalAmount = Math.max(0, productSubtotal + shippingFee - couponDiscount);

  const cartRecommendations = useMemo(
    () =>
      getCartRecommendations(
        catalog,
        displayItems.map((item) => ({
          productSlug: item.productSlug,
          sellerName: item.sellerName,
          estimatedUnitPrice: item.estimatedUnitPrice,
        })),
        { subtotal: productSubtotal, limit: 12 },
      ),
    [catalog, displayItems, productSubtotal],
  );

  const upsellDeals = cartRecommendations.primaryDeals;

  const checkoutDisabled =
    isPending || selectedItems.length === 0 || !selectedItems.some((item) => !item.closed);

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(displayItems.map((item) => item.id)));
  }

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleQuantityChange(cartItemId: string, nextQuantity: number) {
    if (nextQuantity > 99) {
      return;
    }

    const targetItem = displayItems.find((item) => item.id === cartItemId);

    if (nextQuantity < 1) {
      handleRemove(cartItemId);
      return;
    }

    if (!initialLoggedIn) {
      updateGuestJoinCartQuantity(cartItemId, nextQuantity);
      setGuestItems(readGuestJoinCartItems());
      return;
    }

    if (targetItem) {
      syncGuestFromJoinItem(targetItem, nextQuantity);
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateJoinCartQuantityAction(cartItemId, nextQuantity);

      if ("error" in result && result.error === "login_required") {
        router.push("/login?next=/join-cart");
        return;
      }

      if (!result.success) {
        setErrorMessage("수량 변경에 실패했어요.");
        return;
      }

      router.refresh();
    });
  }

  function handleRemove(cartItemId: string) {
    const targetItem = displayItems.find((item) => item.id === cartItemId);

    if (!initialLoggedIn) {
      removeGuestJoinCartItem(cartItemId);
      setGuestItems(readGuestJoinCartItems());
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
      return;
    }

    if (targetItem) {
      syncGuestFromJoinItem(targetItem, 0);
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await removeFromJoinCartAction(cartItemId);

      if ("error" in result && result.error === "login_required") {
        router.push("/login?next=/join-cart");
        return;
      }

      if (!result.success) {
        setErrorMessage("삭제에 실패했어요.");
        return;
      }

      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
      router.refresh();
    });
  }

  function handleRemoveSelected() {
    const ids = [...selectedIds];
    if (ids.length === 0) {
      return;
    }

    if (!initialLoggedIn) {
      for (const id of ids) {
        removeGuestJoinCartItem(id);
      }
      setGuestItems(readGuestJoinCartItems());
      setSelectedIds(new Set());
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      for (const id of ids) {
        await removeFromJoinCartAction(id);
      }
      setSelectedIds(new Set());
      router.refresh();
    });
  }

  function handleCheckout() {
    const first = selectedItems.find((item) => !item.closed);
    if (!first) {
      return;
    }

    const checkoutHref =
      first.quantity > 1 ?
        `/checkout/${first.productSlug}?qty=${first.quantity}`
      : `/checkout/${first.productSlug}`;

    router.push(checkoutHref);
  }

  if (!initialLoggedIn && !guestReady) {
    return (
      <div
        aria-busy="true"
        aria-label="장바구니 불러오는 중"
        className="rounded-[16px] bg-[#F5F7F6] py-12 text-center text-[13px] text-[#666666]"
      >
        장바구니를 불러오는 중이에요
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <>
        <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+144px),144px)]">
          {!initialLoggedIn ?
            <div className="rounded-[16px] border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px] leading-relaxed text-[#666666]">
              로그인하면 장바구니가 계정에 저장돼요.{" "}
              <Link className="font-semibold text-[#2E5E4E]" href="/login?next=%2Fjoin-cart">
                로그인
              </Link>
            </div>
          : null}
          <EmptyState
            actionHref="/"
            actionLabel={CELLOH_BUTTONS.browseProducts}
            compact
            description={CELLOH_EMPTY.cart.description}
            title={CELLOH_EMPTY.cart.title}
          />
          {upsellDeals.length > 0 ?
            <>
              <GrowthProductRailSection
                ariaLabel="추천상품"
                className="pt-0"
                deals={upsellDeals}
                maxItems={12}
                subtitle="인기 상품을 둘러보세요"
                title="추천상품"
              />
              <div className="px-6">
                <RecommendationBasisHint />
              </div>
            </>
          : null}
          <JoinCartRecentViewsRail catalog={catalog} />
        </div>
        <JoinCartCheckoutBar
          disabled
          itemCount={0}
          onCheckout={handleCheckout}
          totalAmount={0}
        />
      </>
    );
  }

  return (
    <>
      {!initialLoggedIn ?
        <div className="mb-4 rounded-[16px] border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px] leading-relaxed text-[#666666]">
          비로그인 장바구니예요.{" "}
          <Link className="font-semibold text-[#2E5E4E]" href="/login?next=%2Fjoin-cart">
            로그인
          </Link>
          하면 계정에 저장돼요.
        </div>
      : null}
      <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+144px),144px)]">
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#111111]">
            <input
              checked={allSelected}
              className="h-4 w-4 accent-[#2E5E4E]"
              onChange={toggleAll}
              type="checkbox"
            />
            전체선택
          </label>
          <button
            className="cursor-pointer text-[13px] font-medium text-[#666666] disabled:opacity-40"
            disabled={isPending || selectedIds.size === 0}
            onClick={handleRemoveSelected}
            type="button"
          >
            선택삭제
          </button>
        </div>

        {errorMessage ?
          <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-[13px] text-[#E28A3B]">
            {errorMessage}
          </p>
        : null}

        {groups.map(([sellerName, sellerItems]) => (
          <section className="space-y-3" key={sellerName}>
            <h2 className="text-[15px] font-bold text-[#111111]">{sellerName}</h2>
            <div className="space-y-3">
              {sellerItems.map((item) => (
                <article
                  className="flex gap-3 rounded-[20px] border border-[#E8ECEA] bg-white p-3"
                  key={item.id}
                >
                  <input
                    checked={selectedIds.has(item.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#2E5E4E]"
                    onChange={() => toggleItem(item.id)}
                    type="checkbox"
                  />
                  <Link
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]"
                    href={`/product/${item.productSlug}`}
                  >
                    {item.imageUrl ?
                      <Image
                        alt={item.productName}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={item.imageUrl}
                      />
                    : null}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        className="line-clamp-2 text-[14px] font-medium leading-snug text-[#111111]"
                        href={`/product/${item.productSlug}`}
                      >
                        {item.productName}
                      </Link>
                      <button
                        aria-label="삭제"
                        className="shrink-0 cursor-pointer text-[12px] text-[#666666]"
                        disabled={isPending}
                        onClick={() => handleRemove(item.id)}
                        type="button"
                      >
                        삭제
                      </button>
                    </div>
                    <p className="mt-1 text-[15px] font-bold tabular-nums text-[#111111]">
                      {currency.format(item.estimatedUnitPrice)}원
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#E8ECEA] px-1">
                      <button
                        aria-label="수량 감소"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[14px] disabled:opacity-40"
                        disabled={isPending}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        type="button"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-[14px] font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="수량 증가"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[14px] disabled:opacity-40"
                        disabled={isPending || item.quantity >= 99}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    {item.closed ?
                      <p className="mt-2 text-[12px] text-[#666666]">판매 종료된 상품</p>
                    : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <JoinCartSummaryCard
          couponDiscount={couponDiscount}
          productSubtotal={productSubtotal}
          shippingFee={shippingFee}
          totalAmount={totalAmount}
        />

        <JoinCartCouponPicker
          onChange={setCouponSelection}
          selection={couponSelection}
          subtotal={productSubtotal}
        />

        <JoinCartCouponNotice subtotal={productSubtotal} />

        <TierCouponFillRail
          catalog={catalog}
          className="pt-0"
          excludeSlugs={displayItems.map((item) => item.productSlug)}
          subtotal={productSubtotal}
        />

        {upsellDeals.length > 0 ?
          <>
            <GrowthProductRailSection
              ariaLabel="함께 구매하면 좋아요"
              className="pt-0"
              deals={upsellDeals}
              maxItems={12}
              subtitle={
                cartRecommendations.sections[0]?.subtitle ??
                "함께 담으면 좋은 상품이에요"
              }
              title={
                cartRecommendations.sections[0]?.title ?? "함께 구매하면 좋아요"
              }
            />
            <div className="px-6">
              <RecommendationBasisHint />
            </div>
          </>
        : null}

        <JoinCartRecentViewsRail
          catalog={catalog}
          excludeSlugs={displayItems.map((item) => item.productSlug)}
        />
      </div>

      <JoinCartCheckoutBar
        disabled={checkoutDisabled}
        itemCount={selectedItems.length}
        onCheckout={handleCheckout}
        totalAmount={totalAmount}
      />
    </>
  );
}
