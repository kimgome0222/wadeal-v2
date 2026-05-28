import { EmptyState } from "@/components/empty-state";

type DealsEmptyStateProps = {
  message?: string;
  className?: string;
};

export function DealsEmptyState({
  message = "등록된 공동구매 상품이 없어요.",
  className = "",
}: DealsEmptyStateProps) {
  return (
    <EmptyState
      actionHref="/category/all"
      actionLabel="전체 상품 보기"
      className={className}
      description="Supabase products · group_buy_deals 데이터를 확인해 주세요."
      title={message}
    />
  );
}
