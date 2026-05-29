import { EmptyState } from "@/components/empty-state";

type DealsEmptyStateProps = {
  message?: string;
  className?: string;
};

export function DealsEmptyState({
  message = "아직 등록된 상품이 없어요.",
  className = "",
}: DealsEmptyStateProps) {
  return (
    <EmptyState
      actionHref="/category/all"
      actionLabel="상품 둘러보기"
      className={className}
      description="첫 상품을 준비 중이에요. 곧 만나보실 수 있어요."
      title={message}
      variant="shopping"
    />
  );
}
