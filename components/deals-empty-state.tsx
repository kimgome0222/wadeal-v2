import { EmptyState } from "@/components/empty-state";
import { CELLOH_BUTTONS, CELLOH_EMPTY } from "@/lib/copy/ux-writing";

type DealsEmptyStateProps = {
  message?: string;
  className?: string;
};

export function DealsEmptyState({
  message = CELLOH_EMPTY.categoryProducts.title,
  className = "",
}: DealsEmptyStateProps) {
  return (
    <EmptyState
      actionHref="/category/all"
      actionLabel={CELLOH_BUTTONS.browseProducts}
      className={className}
      description={CELLOH_EMPTY.categoryProducts.description}
      title={message}
      variant="shopping"
    />
  );
}
