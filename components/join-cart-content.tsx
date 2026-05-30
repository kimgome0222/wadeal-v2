"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  removeFromJoinCartAction,
  updateJoinCartQuantityAction,
} from "@/app/actions/join-cart";
import { EmptyState } from "@/components/empty-state";
import { JoinCartPromoSection } from "@/components/join-cart-promo-section";
import { TierCouponBanner } from "@/components/coupon/tier-coupon-banner";
import { TierCouponFillRail } from "@/components/coupon/tier-coupon-fill-rail";
import { CartGrowthRecommendations } from "@/components/growth/cart-growth-recommendations";
import type { JoinCartItem } from "@/lib/data/join-cart";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import {
  GUEST_CART_CHANGED_EVENT,
  readGuestJoinCartItems,
  removeGuestJoinCartItem,
  updateGuestJoinCartQuantity,
  type GuestJoinCartItem,
} from "@/lib/join-cart/guest-cart-storage";
import { getTierCouponDiscount } from "@/lib/coupon/tier-coupon";
import { ui } from "@/lib/ui";

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

export function JoinCartContent({ items, initialLoggedIn, catalog }: JoinCartContentProps) {
  const router = useRouter();
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

  const displayItems = initialLoggedIn ? items : guestItems;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSelectedIds(new Set(displayItems.map((item) => item.id)));
  }, [displayItems]);

  const groups = useMemo(() => groupBySeller(displayItems), [displayItems]);
  const allSelected = displayItems.length > 0 && selectedIds.size === displayItems.length;

  const selectedItems = displayItems.filter((item) => selectedIds.has(item.id));
  const productSubtotal = selectedItems.reduce((sum, item) => sum + item.estimatedLineTotal, 0);
  const tierCouponDiscount = getTierCouponDiscount(productSubtotal);
  const shippingFee = selectedItems.length > 0 ? (productSubtotal >= 30000 ? 0 : 3000) : 0;
  const totalAmount = Math.max(0, productSubtotal + shippingFee - tierCouponDiscount);

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
    if (nextQuantity < 1 || nextQuantity > 99) {
      return;
    }

    if (!initialLoggedIn) {
      updateGuestJoinCartQuantity(cartItemId, nextQuantity);
      setGuestItems(readGuestJoinCartItems());
      return;
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
      <div className="space-y-4">
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
          actionLabel="상품 둘러보기"
          description="좋은 판매자의 상품을 둘러보세요."
          title="장바구니가 비어 있어요"
        />
      </div>
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
      <div className="space-y-6 pb-[calc(180px+env(safe-area-inset-bottom))]">
        <TierCouponBanner subtotal={productSubtotal} />
        <JoinCartPromoSection />

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
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        aria-label="수량 감소"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E8ECEA] text-[14px] disabled:opacity-40"
                        disabled={isPending || item.quantity <= 1}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        type="button"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-[14px] font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="수량 증가"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E8ECEA] text-[14px] disabled:opacity-40"
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
        <CartGrowthRecommendations
          cartSlugs={displayItems.map((item) => item.productSlug)}
          cartSubtotal={productSubtotal}
          catalog={catalog}
        />
        <TierCouponFillRail
          catalog={catalog}
          className="pt-0"
          excludeSlugs={displayItems.map((item) => item.productSlug)}
          subtotal={productSubtotal}
        />
      </div>

      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-[#E8ECEA] bg-white px-6 py-4">
        <dl className="space-y-1.5 text-[13px]">
          <div className="flex justify-between text-[#666666]">
            <dt>상품금액</dt>
            <dd className="tabular-nums text-[#111111]">{currency.format(productSubtotal)}원</dd>
          </div>
          {tierCouponDiscount > 0 ?
            <div className="flex justify-between text-[#E28A3B]">
              <dt>자동 쿠폰</dt>
              <dd className="tabular-nums font-semibold">-{currency.format(tierCouponDiscount)}원</dd>
            </div>
          : null}
          <div className="flex justify-between text-[#666666]">
            <dt>할인</dt>
            <dd className="tabular-nums text-[#111111]">0원</dd>
          </div>
          <div className="flex justify-between text-[#666666]">
            <dt>배송비</dt>
            <dd className="tabular-nums text-[#111111]">{currency.format(shippingFee)}원</dd>
          </div>
          <div className="flex justify-between pt-1 text-[15px] font-bold text-[#111111]">
            <dt>결제예정금액</dt>
            <dd className="tabular-nums">{currency.format(totalAmount)}원</dd>
          </div>
        </dl>
        <button
          className={`${ui.btnPrimary} mt-3 flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl text-[15px] font-semibold disabled:opacity-50`}
          disabled={isPending || selectedItems.length === 0 || !selectedItems.some((item) => !item.closed)}
          onClick={handleCheckout}
          type="button"
        >
          {selectedItems.length === 0 ?
            "상품을 담아주세요"
          : `${currency.format(totalAmount)}원 주문하기`}
        </button>
      </div>
    </>
  );
}
