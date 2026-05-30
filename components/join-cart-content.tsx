"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  removeFromJoinCartAction,
  updateJoinCartQuantityAction,
} from "@/app/actions/join-cart";
import { AuthLoginPrompt } from "@/components/auth-login-prompt";
import { EmptyState } from "@/components/empty-state";
import type { JoinCartItem } from "@/lib/data/join-cart";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type JoinCartContentProps = {
  items: JoinCartItem[];
  initialLoggedIn: boolean;
};

export function JoinCartContent({ items, initialLoggedIn }: JoinCartContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleQuantityChange(cartItemId: string, nextQuantity: number) {
    if (nextQuantity < 1 || nextQuantity > 99) {
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

      router.refresh();
    });
  }

  if (!initialLoggedIn) {
    return <AuthLoginPrompt nextPath="/join-cart" variant="cart" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        actionHref="/"
        actionLabel="상품 둘러보기"
        description="상품 상세에서 장바구니에 담아 보세요."
        title="장바구니에 담긴 상품이 없습니다."
      />
    );
  }

  return (
    <div className="space-y-3">
      {errorMessage ?
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      {items.map((item) => (
        <article
          className="rounded-xl border border-wadeal-line bg-white p-4 shadow-card"
          key={item.id}
        >
          <div className="flex items-start justify-between gap-3">
            <Link
              className="min-w-0 flex-1 cursor-pointer"
              href={`/product/${item.productSlug}`}
            >
              <p className="text-sm font-black text-wadeal-ink">{item.productName}</p>
              <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                {item.participants}명 구매 · {item.badge}
              </p>
            </Link>
            <button
              aria-label="삭제"
              className="shrink-0 cursor-pointer text-xs font-bold text-wadeal-muted active:text-wadeal-red disabled:opacity-50"
              disabled={isPending}
              onClick={() => handleRemove(item.id)}
              type="button"
            >
              삭제
            </button>
          </div>

          <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>예상 단가</dt>
              <dd className="font-black text-wadeal-red">
                {currency.format(item.estimatedUnitPrice)}원
              </dd>
            </div>
            {item.qtyUntilNextTier > 0 ?
              <div className="flex justify-between gap-3">
                <dt>다음 할인까지</dt>
                <dd className="font-black text-wadeal-ink">
                  {item.qtyUntilNextTier}개 더 구매하면 추가 할인
                </dd>
              </div>
            : null}
            <div className="flex items-center justify-between gap-3 border-t border-wadeal-line pt-3">
              <dt>수량</dt>
              <dd className="flex items-center gap-2">
                <button
                  aria-label="수량 감소"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-sm font-black disabled:opacity-40"
                  disabled={isPending || item.quantity <= 1}
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  type="button"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center font-black text-wadeal-ink">
                  {item.quantity}
                </span>
                <button
                  aria-label="수량 증가"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-sm font-black disabled:opacity-40"
                  disabled={isPending || item.quantity >= 99}
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>예상 합계</dt>
              <dd className="font-black text-wadeal-ink">
                {currency.format(item.estimatedLineTotal)}원
              </dd>
            </div>
          </dl>

          {item.closed ?
            <p className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-bold text-wadeal-muted">
              판매가 종료된 상품이에요
            </p>
          : <Link
              className={`${ui.btnPrimary} mt-3 cursor-pointer`}
              href={`/join/${item.productSlug}?qty=${item.quantity}`}
            >
              구매하기
            </Link>}
        </article>
      ))}
    </div>
  );
}
