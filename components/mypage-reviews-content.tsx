"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import type {
  MypageWritableReviewItem,
  MypageWrittenReviewItem,
} from "@/lib/mypage/review-hub-data";
import { renderStarString } from "@/lib/reviews/review-rules";
import { ui } from "@/lib/ui";

type ReviewTab = "writable" | "written" | "expired";

type MypageReviewsContentProps = {
  writableItems: MypageWritableReviewItem[];
  writtenItems: MypageWrittenReviewItem[];
};

function ReviewStatusBadge({ label, tone }: { label: string; tone: "green" | "gray" | "orange" }) {
  const colors =
    tone === "green" ? "bg-[#E8F5EF] text-[#2E5E4E]"
    : tone === "orange" ? "bg-[#FFF4E8] text-[#E28A3B]"
    : "bg-[#F5F7F6] text-[#666666]";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${colors}`}>{label}</span>
  );
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function MypageReviewsContent({
  writableItems,
  writtenItems,
}: MypageReviewsContentProps) {
  const [tab, setTab] = useState<ReviewTab>("writable");

  return (
    <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <div className="space-y-2">
        <p className="text-[14px] text-[#666666]">
          구매 확정 후 15일 이내에 리뷰를 작성할 수 있어요.
        </p>
        <Link className="text-[13px] font-semibold text-[#2E5E4E] underline" href="/policies/review">
          리뷰 정책 보기
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "writable" as const, label: "작성 가능" },
            { key: "written" as const, label: "작성 완료" },
            { key: "expired" as const, label: "기간 만료 (mock)" },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <button
              aria-pressed={active}
              className={`h-11 cursor-pointer rounded-2xl px-4 text-[14px] font-semibold ${
                active ?
                  "bg-[#2E5E4E] text-white"
                : "border border-[#E8ECEA] bg-white text-[#666666]"
              }`}
              key={item.key}
              onClick={() => setTab(item.key)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "writable" ?
        writableItems.length === 0 ?
          <EmptyState
            actionHref="/"
            actionLabel="상품 둘러보기"
            description="구매 확정 후 15일 이내에 리뷰를 작성할 수 있어요."
            title="작성 가능한 리뷰가 없어요"
          />
        : <div className="space-y-3">
            {writableItems.map(({ order, imageUrl }) => (
              <article
                className="flex gap-3 rounded-[20px] border border-[#E8ECEA] bg-white p-4"
                key={order.id}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
                  {imageUrl ?
                    <Image
                      alt={order.productName}
                      className="object-cover"
                      fill
                      sizes="80px"
                      src={imageUrl}
                    />
                  : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <ReviewStatusBadge label="작성 가능" tone="green" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-[15px] font-semibold text-[#111111]">
                    {order.productName}
                  </p>
                  <p className="mt-1 text-[13px] text-[#666666]">
                    구매일 {formatDate(order.createdAt)}
                  </p>
                  <Link
                    className={`${ui.btnPrimary} mt-3 flex h-11 items-center justify-center rounded-2xl text-[14px] font-semibold`}
                    href={`/product/${order.productId}?review=true#product-reviews`}
                  >
                    리뷰쓰기
                  </Link>
                </div>
              </article>
            ))}
          </div>
      : tab === "written" ?
        writtenItems.length === 0 ?
          <EmptyState
            description="상품 구매 후 리뷰를 남겨보세요."
            title="작성한 리뷰가 없어요"
          />
        : <div className="space-y-3">
            {writtenItems.map((review) => (
              <article
                className="rounded-[20px] border border-[#E8ECEA] bg-white p-4"
                key={review.id}
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
                    {review.imageUrl ?
                      <Image
                        alt={review.productName}
                        className="object-cover"
                        fill
                        sizes="64px"
                        src={review.imageUrl}
                      />
                    : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <ReviewStatusBadge label="작성 완료" tone="gray" />
                    <p className="mt-2 truncate text-[14px] font-semibold text-[#111111]">
                      {review.productName}
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-[#E28A3B]">
                      {renderStarString(review.rating)}
                    </p>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#666666]">
                      {review.content}
                    </p>
                  </div>
                </div>
                <Link
                  className={`${ui.btnOutline} mt-3 flex h-11 items-center justify-center rounded-2xl text-[14px] font-semibold`}
                  href={`/product/${review.productId}?review=true#product-reviews`}
                >
                  수정
                </Link>
              </article>
            ))}
          </div>
      : <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
          <ReviewStatusBadge label="기간 만료" tone="orange" />
          <p className="mt-3 text-[15px] font-semibold text-[#111111]">샘플 상품 (mock)</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">
            구매 확정 후 15일이 지나 리뷰 작성이 종료된 예시입니다. 실제 주문 데이터와 연동되지
            않습니다.
          </p>
          <Link
            className="mt-3 inline-block text-[13px] font-semibold text-[#2E5E4E] underline"
            href="/policies/review"
          >
            리뷰 정책 확인
          </Link>
        </article>
      }
    </div>
  );
}
