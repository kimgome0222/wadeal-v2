import { EmptyState } from "@/components/empty-state";

type DealsEmptyStateProps = {
  message?: string;
  className?: string;
};

export function DealsEmptyState({
  message = "등록된 상품이 없어요.",
  className = "",
}: DealsEmptyStateProps) {
  return (
    <EmptyState
      actionHref="/category/all"
      actionLabel="상품 둘러보기"
      className={className}
      description="신뢰할 수 있는 상품을 쉽게 찾아보세요."
      title={message}
    />
  );
}
